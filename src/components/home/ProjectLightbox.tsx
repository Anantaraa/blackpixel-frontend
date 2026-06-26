import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Info } from 'lucide-react';

import type { Project } from '../../hooks/useProjects';

interface ProjectLightboxProps {
    project: Project | null;
    nextProject?: Project | null;
    prevProject?: Project | null;
    isOpen: boolean;
    onClose: () => void;
    onNext: () => void;
    onPrev: () => void;
}

const ProjectLightbox: React.FC<ProjectLightboxProps> = ({ project, nextProject, prevProject, isOpen, onClose, onNext, onPrev }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isDetailsVisible, setIsDetailsVisible] = useState(false);

    useEffect(() => {
        setCurrentImageIndex(0);
        setIsDetailsVisible(false);
    }, [project]);

    const allImages = project
        ? Array.from(new Set([project.image, ...(project.gallery?.map(g => g.url) || [])].filter(Boolean)))
        : [];

    const handleNextImage = () => {
        if (currentImageIndex < allImages.length - 1) {
            setCurrentImageIndex(prev => prev + 1);
        } else {
            onNext();
        }
    };

    const handlePrevImage = () => {
        if (currentImageIndex > 0) {
            setCurrentImageIndex(prev => prev - 1);
        } else {
            onPrev();
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight') handleNextImage();
            if (e.key === 'ArrowLeft') handlePrevImage();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose, currentImageIndex, allImages.length]);

    if (!project) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-surface/80 backdrop-blur-sm"
                    onClick={onClose}
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="fixed top-4 right-4 md:top-6 md:right-6 z-[140] w-12 h-12 flex items-center justify-center bg-text/10 hover:bg-text/20 text-text/70 hover:text-text rounded-full transition-colors backdrop-blur-md"
                        aria-label="Close"
                    >
                        <X size={20} />
                    </button>

                    {/* Project Navigation — left edge */}
                    <div
                        className="fixed left-2 md:left-6 top-1/2 -translate-y-1/2 z-[130] flex flex-col items-start gap-2 group cursor-pointer"
                        onClick={(e) => { e.stopPropagation(); onPrev(); }}
                        aria-label="Previous project"
                    >
                        <div className="p-3 text-text/40 hover:text-text/80 transition-all group-hover:scale-110 group-hover:-translate-x-1">
                            <ChevronLeft className="w-6 h-6 md:w-10 md:h-10" />
                        </div>
                        {prevProject && (
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute top-full mt-2 left-0 w-48 pointer-events-none bg-surface/80 backdrop-blur-md p-3 rounded-lg border border-text/10">
                                <p className="text-[10px] text-text/50 uppercase tracking-widest mb-1">Previous Project</p>
                                <p className="text-sm text-text font-medium truncate">{prevProject.title}</p>
                            </div>
                        )}
                    </div>

                    {/* Project Navigation — right edge */}
                    <div
                        className="fixed right-2 md:right-6 top-1/2 -translate-y-1/2 z-[130] flex flex-col items-end gap-2 group cursor-pointer"
                        onClick={(e) => { e.stopPropagation(); onNext(); }}
                        aria-label="Next project"
                    >
                        <div className="p-3 text-text/40 hover:text-text/80 transition-all group-hover:scale-110 group-hover:translate-x-1">
                            <ChevronRight className="w-6 h-6 md:w-10 md:h-10" />
                        </div>
                        {nextProject && (
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute top-full mt-2 right-0 w-48 text-right pointer-events-none bg-surface/80 backdrop-blur-md p-3 rounded-lg border border-text/10">
                                <p className="text-[10px] text-text/50 uppercase tracking-widest mb-1">Next Project</p>
                                <p className="text-sm text-text font-medium truncate">{nextProject.title}</p>
                            </div>
                        )}
                    </div>

                    {/* Image area */}
                    <div className="fixed inset-0 z-[80] flex items-center justify-center">
                        {allImages.length > 0 && (
                            <motion.img
                                key={`${project.id}-img-${currentImageIndex}`}
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.35 }}
                                src={allImages[currentImageIndex]}
                                alt={`${project.title} — image ${currentImageIndex + 1} of ${allImages.length}`}
                                className="max-w-full max-h-[100vh] object-contain"
                                onClick={(e) => e.stopPropagation()}
                            />
                        )}

                        {/* Dot indicators */}
                        {allImages.length > 1 && (
                            <div
                                className="absolute bottom-20 md:bottom-24 left-1/2 -translate-x-1/2 z-[90] flex items-center gap-2"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {allImages.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentImageIndex(i)}
                                        aria-label={`Go to image ${i + 1}`}
                                        className={`h-1.5 rounded-full transition-all duration-300 ${
                                            i === currentImageIndex
                                                ? 'w-6 bg-white'
                                                : 'w-1.5 bg-white/40 hover:bg-white/70'
                                        }`}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Image navigation — visible click zones with hint arrows */}
                        {allImages.length > 1 && (
                            <>
                                <button
                                    className="absolute left-16 md:left-20 top-1/2 -translate-y-1/2 z-[90] w-12 h-12 flex items-center justify-center bg-black/30 hover:bg-black/50 text-white/70 hover:text-white rounded-full transition-all duration-200 backdrop-blur-sm"
                                    onClick={(e) => { e.stopPropagation(); handlePrevImage(); }}
                                    aria-label="Previous image"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <button
                                    className="absolute right-16 md:right-20 top-1/2 -translate-y-1/2 z-[90] w-12 h-12 flex items-center justify-center bg-black/30 hover:bg-black/50 text-white/70 hover:text-white rounded-full transition-all duration-200 backdrop-blur-sm"
                                    onClick={(e) => { e.stopPropagation(); handleNextImage(); }}
                                    aria-label="Next image"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </>
                        )}
                    </div>

                    {/* Floating Details Pane */}
                    <div className="fixed bottom-0 left-0 right-0 z-[120] pointer-events-none flex flex-col justify-end">

                        {isDetailsVisible && (
                            <motion.div
                                layoutId="dynamic-pane-bg"
                                className="hidden md:block absolute inset-x-0 bottom-0 top-0 bg-surface/90 border-t border-text/10 pointer-events-auto"
                                transition={{ type: 'spring', bounce: 0.15, duration: 0.6 }}
                            />
                        )}

                        <div className="relative z-10 w-full px-4 md:px-12 py-6 md:py-8 lg:py-10">
                            <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-start md:items-center">

                                <div className="w-full md:w-1/3 shrink-0 flex flex-col pointer-events-none z-10 relative">
                                    <motion.span
                                        layout
                                        className="w-fit inline-block px-3 py-1 mb-2 text-xs bg-surface/60 backdrop-blur-md rounded-full text-text/80 uppercase tracking-widest font-semibold border border-text/10 shadow-sm"
                                    >
                                        {project.categories?.name || 'Project'}
                                    </motion.span>

                                    {/* Info pill — larger touch target */}
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setIsDetailsVisible(!isDetailsVisible); }}
                                        className="relative flex items-center gap-3 pointer-events-auto group text-left py-2 px-3 -ml-3 w-fit max-w-[calc(100vw-2rem)] outline-none"
                                        aria-label={isDetailsVisible ? 'Hide project details' : 'Show project details'}
                                    >
                                        {!isDetailsVisible && (
                                            <motion.div
                                                layoutId="dynamic-pane-bg"
                                                className="absolute inset-0 bg-surface/90 backdrop-blur-xl border border-text/10 shadow-lg pointer-events-none"
                                                style={{ borderRadius: '9999px' }}
                                                transition={{ type: 'spring', bounce: 0.15, duration: 0.6 }}
                                            />
                                        )}

                                        <motion.div layout className="relative z-10 w-8 h-8 shrink-0 flex items-center justify-center border border-text text-text rounded-full group-hover:border-primary group-hover:text-primary transition-colors overflow-hidden">
                                            <AnimatePresence mode="wait">
                                                {isDetailsVisible ? (
                                                    <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                                                        <X className="w-4 h-4" />
                                                    </motion.div>
                                                ) : (
                                                    <motion.div key="info" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                                                        <Info className="w-4 h-4" />
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </motion.div>

                                        <motion.h2 layout className="relative z-10 text-sm lg:text-base font-display font-bold text-text leading-none tracking-tight drop-shadow-sm pr-3 lg:pr-4 whitespace-nowrap">
                                            {project.title}
                                        </motion.h2>
                                    </button>

                                    <motion.p layout className="text-text/60 text-xs md:text-sm font-mono tracking-wider mt-3 uppercase drop-shadow-sm">
                                        {project.location} • {project.year}
                                    </motion.p>
                                </div>

                                <AnimatePresence>
                                    {isDetailsVisible && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.4, delay: 0.1 }}
                                            className="w-full md:w-2/3 flex flex-col md:flex-row flex-wrap gap-6 md:gap-12 items-start md:items-center pointer-events-auto"
                                        >
                                            {project.description && (
                                                <div className="hidden lg:block flex-1 text-sm md:text-base text-text/70 leading-relaxed font-light max-w-2xl">
                                                    <p>{project.description}</p>
                                                </div>
                                            )}

                                            {allImages.length > 1 && (
                                                <div className="shrink-0 flex items-center gap-3">
                                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-text/5 rounded-full border border-text/10 backdrop-blur-sm">
                                                        <span className="text-text/60 font-mono text-sm tracking-widest">
                                                            {currentImageIndex + 1} / {allImages.length}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ProjectLightbox;
