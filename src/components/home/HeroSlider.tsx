import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useHeroSlides } from '../../hooks/useHeroSlides';

const PIXEL_SIZE = 48;
const STEP_MS = 40;    // ms per column base advance (left-to-right)
const JITTER_MS = 90;  // max random per-pixel offset — breaks the hard column edge
const BLACK_MS = 80;  // how long each pixel stays black — controls flood width

function drawCoverWithTint(
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    W: number,
    H: number,
) {
    const { naturalWidth: nw, naturalHeight: nh } = img;
    if (!nw || !nh) {
        ctx.fillStyle = '#111';
        ctx.fillRect(0, 0, W, H);
        return;
    }
    const scale = Math.max(W / nw, H / nh);
    const sw = W / scale;
    const sh = H / scale;
    const sx = (nw - sw) / 2;
    const sy = (nh - sh) / 2;
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, W, H);
    // Match the persistent dark tint applied over the display img
    ctx.fillStyle = 'rgba(0,0,0,0.30)';
    ctx.fillRect(0, 0, W, H);
}

const HeroSlider: React.FC = () => {
    const { slides, loading } = useHeroSlides();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const displayImgRef = useRef<HTMLImageElement>(null);
    const rafRef = useRef<number | null>(null);
    const isTransRef = useRef(false);
    const currentIdxRef = useRef(0);

    useEffect(() => { currentIdxRef.current = currentIndex; }, [currentIndex]);

    // Preload the next slide so it's in the browser cache when needed
    useEffect(() => {
        if (slides.length <= 1) return;
        const nextIdx = (currentIndex + 1) % slides.length;
        const img = new Image();
        img.src = slides[nextIdx].image_url;
    }, [currentIndex, slides]);

    const runTransition = useCallback((nextIdx: number) => {
        if (isTransRef.current) return;

        const canvas = canvasRef.current;
        const img = displayImgRef.current;
        if (!canvas || !img) return;

        isTransRef.current = true;
        setIsTransitioning(true);

        // Size canvas to its rendered dimensions (resets content — must redraw)
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        const W = canvas.width;
        const H = canvas.height;

        if (!W || !H) {
            isTransRef.current = false;
            setIsTransitioning(false);
            setCurrentIndex(nextIdx);
            return;
        }

        const ctx = canvas.getContext('2d');
        if (!ctx) {
            isTransRef.current = false;
            setIsTransitioning(false);
            setCurrentIndex(nextIdx);
            return;
        }

        // Snapshot current slide (+ tint) onto canvas so the underlying img
        // can safely switch to the next slide without a visible flash
        try {
            drawCoverWithTint(ctx, img, W, H);
        } catch {
            // CORS prevented canvas draw — fall back to instant switch
            ctx.clearRect(0, 0, W, H);
            isTransRef.current = false;
            setIsTransitioning(false);
            setCurrentIndex(nextIdx);
            return;
        }

        // Switch underlying img src to next slide — canvas is on top (z=4),
        // so this change is invisible to the viewer
        setCurrentIndex(nextIdx);

        // Build pixel grid
        const cols = Math.ceil(W / PIXEL_SIZE) + 1;
        const rows = Math.ceil(H / PIXEL_SIZE) + 1;
        const total = cols * rows;

        // Use typed arrays for tight inner-loop performance
        const states = new Uint8Array(total);     // 0=original, 1=black, 2=cleared
        const blackAts = new Float32Array(total); // elapsed-ms when this pixel turns black
        const clearAts = new Float32Array(total); // elapsed-ms when this pixel clears
        let maxClearAt = 0;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const i = r * cols + c;
                // Column index is the base, random jitter spreads each pixel independently
                const ba = c * STEP_MS + Math.random() * JITTER_MS;
                blackAts[i] = ba;
                clearAts[i] = ba + BLACK_MS;
                if (clearAts[i] > maxClearAt) maxClearAt = clearAts[i];
            }
        }

        const t0 = performance.now();

        function frame(now: number) {
            const t = now - t0;

            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    const i = r * cols + c;
                    const x = c * PIXEL_SIZE;
                    const y = r * PIXEL_SIZE;

                    if (states[i] === 0 && t >= blackAts[i]) {
                        ctx.fillStyle = '#000';
                        ctx.fillRect(x, y, PIXEL_SIZE, PIXEL_SIZE);
                        states[i] = 1;
                    } else if (states[i] === 1 && t >= clearAts[i]) {
                        ctx.clearRect(x, y, PIXEL_SIZE, PIXEL_SIZE);
                        states[i] = 2;
                    }
                }
            }

            if (t < maxClearAt + 50) {
                rafRef.current = requestAnimationFrame(frame);
            } else {
                ctx.clearRect(0, 0, W, H);
                isTransRef.current = false;
                setIsTransitioning(false);
            }
        }

        rafRef.current = requestAnimationFrame(frame);
    }, []);

    // Auto-advance every 5 s
    useEffect(() => {
        if (slides.length <= 1) return;
        const id = setInterval(() => {
            if (!isTransRef.current) {
                runTransition((currentIdxRef.current + 1) % slides.length);
            }
        }, 5000);
        return () => clearInterval(id);
    }, [slides.length, runTransition]);

    // RAF cleanup on unmount
    useEffect(() => () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
    }, []);

    if (loading) return <div className="w-full h-full bg-neutral animate-pulse" />;

    if (slides.length === 0) {
        return (
            <img
                src="/hero-bg.png"
                alt="Architectural visualization"
                className="w-full h-full object-cover"
            />
        );
    }

    return (
        <div className="relative w-full h-full overflow-hidden bg-neutral">
            {/* Display image — shows current slide; src switches to next at transition start */}
            <img
                ref={displayImgRef}
                src={slides[currentIndex].image_url}
                alt={slides[currentIndex].caption || `Slide ${currentIndex + 1}`}
                className="absolute inset-0 w-full h-full object-cover"
                style={{ zIndex: 1 }}
            />

            {/* Persistent dark tint for text legibility */}
            <div
                className="absolute inset-0 bg-black/30 pointer-events-none"
                style={{ zIndex: 2 }}
            />

            {/* Pixel transition canvas — transparent when idle (z=-1), animates on top when active */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ zIndex: isTransitioning ? 4 : -1 }}
            />

            {/* Progress dots */}
            {slides.length > 1 && (
                <div
                    className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2"
                    style={{ zIndex: 10 }}
                >
                    {slides.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => {
                                if (!isTransRef.current && i !== currentIdxRef.current) {
                                    runTransition(i);
                                }
                            }}
                            aria-label={`Go to slide ${i + 1}`}
                            className={`h-1.5 rounded-full transition-all duration-500 ${
                                i === currentIndex
                                    ? 'w-6 bg-white'
                                    : 'w-1.5 bg-white/40 hover:bg-white/70'
                            }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default HeroSlider;
