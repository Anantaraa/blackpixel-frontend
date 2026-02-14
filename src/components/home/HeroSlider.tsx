import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHeroSlides } from '../../hooks/useHeroSlides';

const HeroSlider: React.FC = () => {
    const { slides, loading } = useHeroSlides();
    const [tuple, setTuple] = useState([0, 0]); // [prev, current]
    const [prevIndex, currentIndex] = tuple;

    // Auto-advance
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
                alt="Previous Hero Slide"
                className="absolute inset-0 w-full h-full object-cover z-0"
            />

            {/* Foreground Layer (Current Slide) - Only animate if index changed */}
            <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                    key={currentIndex}
                    className="absolute inset-0 w-full h-full z-10"
                    initial={{ clipPath: 'circle(0% at 32px 32px)' }}
                    animate={{ clipPath: 'circle(150% at 32px 32px)' }}
                    // No exit animation needed, it just disappears when key changes (or we could fade out?)
                    // Actually, we want it to stay until the *next* one covers it.
                    // But here, we replace the component.
                    // IMPORTANT: We are relying on 'prevIndex' to keep the OLD image visible.
                    // So we don't need 'exit' prop at all.
                    transition={{ duration: 2, ease: [0.25, 1, 0.5, 1] }}
                >
                    <img
                        src={slides[currentIndex].image_url}
                        alt="Hero Slide"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20" />
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default HeroSlider;
