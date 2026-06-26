import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';

const MIN_DISPLAY_MS = 5000;

function loadImg(url: string): Promise<void> {
    return new Promise(resolve => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => resolve(); // never block on a broken image
        img.src = url;
    });
}

export function useSitePreloader() {
    const [progress, setProgress] = useState(0);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        let cancelled = false;
        const t0 = Date.now();

        async function run() {
            try {
                // Fetch hero slide URLs — these gate the loader (must finish before dismiss)
                const { data: slides } = await supabase
                    .from('hero_slides')
                    .select('image_url')
                    .order('display_order', { ascending: true });

                const heroUrls: string[] = (slides || [])
                    .map((s: { image_url: string }) => s.image_url)
                    .filter(Boolean);

                // Kick off project image preloads in background — fire and forget
                // so they're cached when the user scrolls down to the portfolio grid
                supabase
                    .from('projects')
                    .select('image, gallery')
                    .then(({ data }) => {
                        for (const p of data || []) {
                            if (p.image) { const i = new Image(); i.src = p.image; }
                            try {
                                const g = typeof p.gallery === 'string'
                                    ? JSON.parse(p.gallery)
                                    : p.gallery;
                                if (Array.isArray(g)) {
                                    for (const item of g) {
                                        const url = typeof item === 'string' ? item : item?.url;
                                        if (url) { const i = new Image(); i.src = url; }
                                    }
                                }
                            } catch { /* malformed gallery — skip */ }
                        }
                    });

                // Load hero images with progress, then dismiss
                const total = heroUrls.length;
                if (total === 0) {
                    if (!cancelled) setProgress(100);
                } else {
                    let loaded = 0;
                    await Promise.all(
                        heroUrls.map(url =>
                            loadImg(url).then(() => {
                                if (cancelled) return;
                                loaded++;
                                setProgress(Math.round((loaded / total) * 100));
                            })
                        )
                    );
                }

                // Enforce a minimum display time so the loader feels intentional
                const elapsed = Date.now() - t0;
                if (elapsed < MIN_DISPLAY_MS) {
                    await new Promise(r => setTimeout(r, MIN_DISPLAY_MS - elapsed));
                }

                if (!cancelled) setReady(true);
            } catch {
                if (!cancelled) setReady(true);
            }
        }

        run();
        return () => { cancelled = true; };
    }, []);

    return { progress, ready };
}
