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

    // Reset image index and details visibility when project changes
    useEffect(() => {
        setCurrentImageIndex(0);
        setIsDetailsVisible(false);
    }, [project]);

    // Deduplicate images
    const allImages = project
        ? Array.from(new Set([project.image, ...(project.gallery?.map(g => g.url) || [])].filter(Boolean)))
        : [];

    // Handlers for image sliding
    const handleNextImage = () => {
        setCurrentImageIndex(prev => (prev + 1) % allImages.length);
    };

    const handlePrevImage = () => {
        setCurrentImageIndex(prev => (prev - 1 + allImages.length) % allImages.length);
    };

    // Lock body scroll when lightbox is open
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

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight') onNext();
            if (e.key === 'ArrowLeft') onPrev();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose, onNext, onPrev]);

    if (!project) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-surface/75 p-4 md:p-8"
                    onClick={onClose} // Close when clicking backdrop
                >
                    {/* Master Close Button */}
                    <button
                        onClick={onClose}
                        className="fixed top-4 right-4 md:top-6 md:right-6 z-[140] w-12 h-12 flex items-center justify-center bg-text/10 hover:bg-text/20 text-text/70 hover:text-text rounded-full transition-colors backdrop-blur-md"
                        title="Close Project"
                    >
                        <X size={24} />
                    </button>

                    {/* External Navigation Arrows & Previews (Project Level) */}
                    <div
                        className="fixed left-2 md:left-6 top-1/2 -translate-y-1/2 z-[130] flex flex-col items-start gap-2 group cursor-pointer"
                        onClick={(e) => { e.stopPropagation(); onPrev(); }}
                    >
                        <div className="p-3 text-text/50 hover:text-text transition-all group-hover:scale-110 group-hover:-translate-x-1">
                            <ChevronLeft size={48} />
                        </div>
                        {prevProject && (
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute top-full mt-2 left-0 w-48 pointer-events-none bg-surface/60 backdrop-blur-md p-3 rounded-lg border border-text/10">
                                <p className="text-[10px] text-text/60 uppercase tracking-widest mb-1">Previous Project</p>
                                <p className="text-sm text-text font-medium truncate drop-shadow-md">{prevProject.title}</p>
                            </div>
                        )}
                    </div>

                    <div
                        className="fixed right-2 md:right-6 top-1/2 -translate-y-1/2 z-[130] flex flex-col items-end gap-2 group cursor-pointer"
                        onClick={(e) => { e.stopPropagation(); onNext(); }}
                    >
                        <div className="p-3 text-text/50 hover:text-text transition-all group-hover:scale-110 group-hover:translate-x-1">
                            <ChevronRight size={48} />
                        </div>
                        {nextProject && (
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute top-full mt-2 right-0 w-48 text-right pointer-events-none bg-surface/60 backdrop-blur-md p-3 rounded-lg border border-text/10">
                                <p className="text-[10px] text-text/60 uppercase tracking-widest mb-1">Next Project</p>
                                <p className="text-sm text-text font-medium truncate drop-shadow-md">{nextProject.title}</p>
                            </div>
                        )}
                    </div>

                    {/* Fullscreen Image Container */}
                    <div className="fixed inset-0 z-[80] flex items-center justify-center pointer-events-none">
                        {allImages.length > 1 && (
                            <>
                                <div
                                    className="fixed left-0 top-0 bottom-0 w-1/2 z-[90] cursor-w-resize pointer-events-auto"
                                    onClick={(e) => { e.stopPropagation(); handlePrevImage(); }}
                                    title="Previous Image"
                                />
                                <div
                                    className="fixed right-0 top-0 bottom-0 w-1/2 z-[90] cursor-e-resize pointer-events-auto"
                                    onClick={(e) => { e.stopPropagation(); handleNextImage(); }}
                                    title="Next Image"
                                />
                            </>
                        )}
                        {allImages.length > 0 && (
                            <motion.img
                                key={`${project.id}-img-${currentImageIndex}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.4 }}
                                src={allImages[currentImageIndex]}
                                alt={`${project.title} - Image ${currentImageIndex + 1}`}
                                className="max-w-full max-h-[100vh] object-contain pointer-events-auto"
                            />
                        )}
                    </div>

                    {/* Floating Details Pane Container */}
                    <div className="fixed bottom-0 left-0 right-0 z-[120] pointer-events-none flex flex-col justify-end">

                        {/* The Expanded Background (Open State) */}
                        {isDetailsVisible && (
                            <motion.div
                                layoutId="dynamic-pane-bg"
                                className="absolute inset-x-0 bottom-0 top-0 bg-surface/90 border-t border-text/10 pointer-events-auto"
                                transition={{ type: 'spring', bounce: 0.15, duration: 0.6 }}
                            />
                        )}

                        <div className="relative z-10 w-full px-4 md:px-12 py-6 md:py-8 lg:py-10">
                            <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-start md:items-center">

                                {/* Left Side: Category, Title, Location */}
                                <div className="w-full md:w-1/3 shrink-0 flex flex-col pointer-events-none z-10 relative">

                                    {/* Category - Always visible, placed just above the Title */}
                                    <motion.span
                                        layout
                                        className="w-fit inline-block px-3 py-1 mb-2 text-[10px] md:text-xs bg-surface/50 backdrop-blur-md rounded-full text-text/80 uppercase tracking-widest font-semibold border border-text/10 shadow-sm"
                                    >
                                        {project.categories?.name || 'Project'}
                                    </motion.span>

                                    {/* The Pill / Button Wrapper */}
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setIsDetailsVisible(!isDetailsVisible); }}
                                        className="relative flex items-center gap-3 md:gap-4 pointer-events-auto group text-left px-4 py-2 md:py-3 -ml-4 w-fit max-w-full outline-none"
                                    >
                                        {/* The Pill Background (Closed State) */}
                                        {!isDetailsVisible && (
                                            <motion.div
                                                layoutId="dynamic-pane-bg"
                                                className="absolute inset-0 bg-surface/90 backdrop-blur-xl border border-text/10 shadow-lg pointer-events-none"
                                                style={{ borderRadius: '9999px' }}
                                                transition={{ type: 'spring', bounce: 0.15, duration: 0.6 }}
                                            />
                                        )}

                                        {/* Icon Button Inside Pill */}
                                        <motion.div layout className="relative z-10 w-8 h-8 md:w-10 md:h-10 shrink-0 flex items-center justify-center border border-text text-text rounded-full shadow-sm group-hover:scale-105 transition-all overflow-hidden bg-transparent">
                                            <AnimatePresence mode="wait">
                                                {isDetailsVisible ? (
                                                    <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                                                        <X size={16} />
                                                    </motion.div>
                                                ) : (
                                                    <motion.div key="info" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                                                        <Info size={16} />
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </motion.div>

                                        {/* Title */}
                                        <motion.h2 layout className="relative z-10 text-2xl md:text-3xl font-display font-bold text-text leading-none tracking-tight drop-shadow-sm pr-4 truncate pt-1">
                                            {project.title}
                                        </motion.h2>
                                    </button>

                                    {/* Location */}
                                    <motion.p layout className="text-text/70 text-xs md:text-sm font-mono tracking-wider mt-4 uppercase drop-shadow-sm">
                                        {project.location} • {project.year}
                                    </motion.p>
                                </div>

                                {/* Fading Side Content (Open State Only) */}
                                <AnimatePresence>
                                    {isDetailsVisible && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.4, delay: 0.1 }}
                                            className="w-full md:w-2/3 flex flex-col md:flex-row flex-wrap gap-6 md:gap-12 items-start md:items-center pointer-events-auto"
                                        >
                                            {/* Description */}
                                            {project.description && (
                                                <div className="flex-1 text-sm md:text-base text-text/70 leading-relaxed font-light mt-2 md:mt-0 max-w-2xl">
                                                    <p>{project.description}</p>
                                                </div>
                                            )}

                                            {/* Pagination */}
                                            {allImages.length > 1 && (
                                                <div className="shrink-0 flex items-center justify-end w-full md:w-auto mt-4 md:mt-0">
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
