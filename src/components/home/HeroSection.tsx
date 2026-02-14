import React, { useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Lenis from 'lenis';
import HeroSlider from './HeroSlider';

const HeroSection: React.FC = () => {
    const { scrollY } = useScroll();
    const yText = useTransform(scrollY, [0, 500], [0, -100]);
    const opacityText = useTransform(scrollY, [0, 300], [1, 0]);
    const scaleImg = useTransform(scrollY, [0, 1000], [1, 1.2]);
    const opacityOverlay = useTransform(scrollY, [0, 500], [0, 0.8]);

    useEffect(() => {
        const lenis = new Lenis();
        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
        return () => lenis.destroy();
    }, []);

    return (
        <section className="relative h-screen w-full overflow-hidden bg-neutral">

            {/* Background Media */}
            <div className="absolute inset-0 z-0">
                <motion.div style={{ scale: scaleImg }} className="w-full h-full">
                    <HeroSlider />
                    <motion.div style={{ opacity: opacityOverlay }} className="absolute inset-0 bg-neutral" />
                </motion.div>
            </div>

            {/* Content */}
            <div className="relative z-10 w-full h-full flex flex-col justify-center items-center text-center px-4">
                <motion.div style={{ y: yText, opacity: opacityText }}>
                    <motion.h1
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="text-[12vw] leading-none font-display font-medium tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-text to-text/20 pb-4"
                    >
                        Blackpixel
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 1 }}
                        className="mt-8 text-xl text-text-muted max-w-xl mx-auto font-light"
                    >
                        We craft digital atmospheres that blur the line between the imagined and the real.
                    </motion.p>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            >
                <span className="text-xs uppercase tracking-widest text-text-muted">Scroll</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-text to-transparent" />
            </motion.div>
        </section>
    );
};

export default HeroSection;
