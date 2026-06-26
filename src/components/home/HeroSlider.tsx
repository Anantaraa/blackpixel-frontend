import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHeroSlides } from '../../hooks/useHeroSlides';

const HeroSlider: React.FC = () => {
    const { slides, loading } = useHeroSlides();
    const [tuple, setTuple] = useState([0, 0]); // [prev, current]
    const [prevIndex, currentIndex] = tuple;

    useEffect(() => {
        if (slides.length <= 1) return;

        const interval = setInterval(() => {
            setTuple(([_, curr]) => [curr, (curr + 1) % slides.length]);
        }, 5000);

        return () => clearInterval(interval);
    }, [slides.length]);

    if (loading) {
        return <div className="w-full h-full bg-neutral animate-pulse" />;
    }

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
            {/* Background Layer (Previous Slide) */}
            <img
                src={slides[prevIndex].image_url}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover z-0"
            />

            {/* Foreground Layer (Current Slide) */}
            <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                    key={currentIndex}
                    className="absolute inset-0 w-full h-full z-10"
                    initial={{ clipPath: 'circle(0% at 50% 50%)' }}
                    animate={{ clipPath: 'circle(150% at 50% 50%)' }}
                    transition={{ duration: 2, ease: [0.25, 1, 0.5, 1] }}
                >
                    <img
                        src={slides[currentIndex].image_url}
                        alt={slides[currentIndex].caption || `Slide ${currentIndex + 1}`}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30" />
                </motion.div>
            </AnimatePresence>

            {/* Slide Progress Dots */}
            {slides.length > 1 && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
                    {slides.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setTuple([currentIndex, i])}
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
