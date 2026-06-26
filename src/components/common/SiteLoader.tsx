import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TOTAL_BLOCKS = 20;

interface Props { progress: number; visible: boolean; }

const SiteLoader: React.FC<Props> = ({ progress, visible }) => {
    const litBlocks = Math.round((progress / 100) * TOTAL_BLOCKS);

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    className="fixed inset-0 z-[9999] bg-neutral flex flex-col items-center justify-center select-none gap-10"
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                    {/* 8-pixel circular spinner */}
                    <motion.div
                        className="relative w-16 h-16"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4 }}
                    >
                        {Array.from({ length: 8 }).map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-2 h-2 bg-text"
                                style={{
                                    // Square starts at top of orbit, centred horizontally
                                    top:  'calc(50% - 4px - 24px)',
                                    left: 'calc(50% - 4px)',
                                    // transform-origin sits at the container centre
                                    transformOrigin: '4px 28px',
                                    rotate: i * 45,
                                }}
                                animate={{ opacity: [0.1, 1, 0.1] }}
                                transition={{
                                    duration: 1.0,
                                    repeat: Infinity,
                                    delay: i * 0.125,
                                    ease: 'easeInOut',
                                }}
                            />
                        ))}
                    </motion.div>

                    {/* Wordmark */}
                    <motion.p
                        className="font-display font-bold text-5xl text-text tracking-tighter"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    >
                        BP.
                    </motion.p>

                    {/* Pixel block progress bar */}
                    <motion.div
                        className="flex flex-col items-center gap-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.4 }}
                    >
                        <div className="flex items-center gap-[3px]">
                            {Array.from({ length: TOTAL_BLOCKS }).map((_, i) => (
                                <div
                                    key={i}
                                    className={`w-[7px] h-3 transition-colors duration-300 ${
                                        i < litBlocks ? 'bg-primary' : 'bg-neutral-border'
                                    }`}
                                />
                            ))}
                        </div>
                        <p className="text-[11px] text-text-muted tabular-nums tracking-widest">
                            {String(progress).padStart(3, ' ')}%
                        </p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SiteLoader;
