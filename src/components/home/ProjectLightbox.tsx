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
    const [isDetailsVisible, setIsDetailsVisible] = useState(true);

    // Reset image index and details visibility when project changes
    useEffect(() => {
        setCurrentImageIndex(0);
        setIsDetailsVisible(true);
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

                    {/* Floating Details Pane */}
                    <AnimatePresence>
                        {isDetailsVisible && (
                            <motion.div
                                key="details-pane"
                                initial={{ opacity: 0, clipPath: 'circle(0px at calc(100% - 3.5rem) calc(100% - 3.5rem))' }}
                                animate={{ opacity: 1, clipPath: 'circle(150% at calc(100% - 3.5rem) calc(100% - 3.5rem))' }}
                                exit={{ opacity: 0, clipPath: 'circle(0px at calc(100% - 3.5rem) calc(100% - 3.5rem))' }}
                                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                className="fixed bottom-0 left-0 right-0 z-[120] pb-0 pt-10 px-4 md:px-12 bg-surface/20 backdrop-blur-2xl text-text  flex flex-col shadow-[0_-20px_40px_-20px_rgba(0,0,0,0.1)] pointer-events-auto h-[40vh] md:h-[35vh] border-t border-text/10"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="flex flex-col md:flex-row gap-6 p-6 md:p-8 overflow-y-auto custom-scrollbar relative h-full">
                                    {/* Left Side: Category, Title, Location */}
                                    <div className="w-full md:w-1/3 shrink-0 flex flex-col pt-4">
                                        <span className="w-fit inline-block px-4 py-2 mb-3 text-sm bg-text/5 rounded-full text-text/60 uppercase tracking-widest font-semibold border border-text/10">
                                            {project.categories?.name || 'Project'}
                                        </span>
                                        <h2 className="text-5xl md:text-6xl font-display font-medium text-text mb-3 leading-tight tracking-tight">
                                            {project.title}
                                        </h2>
                                        <p className="text-text/40 text-base font-mono tracking-wider mb-6 uppercase">
                                            {project.location} • {project.year}
                                        </p>
                                    </div>

                                    {/* Center: Description */}
                                    {project.description && (
                                        <div className="w-full md:w-1/2 max-w-2xl text-[1.18rem] text-text/70 leading-relaxed font-light mt-4 md:mt-0 pr-0 md:pr-4 pt-4">
                                            <p>{project.description}</p>
                                        </div>
                                    )}

                                    {/* Right Side: Pagination */}
                                    <div className="hidden md:flex flex-col items-end justify-start ml-auto h-full pt-4">
                                        {allImages.length > 1 && (
                                            <div className="inline-flex items-center gap-2 px-6 py-3 bg-text/5 rounded-full border border-text/10 mb-4 backdrop-blur-md">
                                                <span className="text-text/60 font-mono text-base tracking-widest">
                                                    {currentImageIndex + 1} / {allImages.length}
                                                </span>
                                            </div>
                                        )}
                                        {/* Spacer to prevent overlap with the global fixed button */}
                                        <div className="w-12 h-12 mt-auto shrink-0" />
                                    </div>

                                    {/* Mobile bottom row: Pagination & Spacer */}
                                    <div className="flex md:hidden items-center justify-between w-full mt-6 pb-6">
                                        {allImages.length > 1 && (
                                            <div className="inline-flex items-center gap-2 px-6 py-3 bg-text/5 rounded-full border border-text/10">
                                                <span className="text-text/60 font-mono text-base tracking-widest">
                                                    {currentImageIndex + 1} / {allImages.length}
                                                </span>
                                            </div>
                                        )}
                                        {/* Spacer to prevent overlap with the global fixed button */}
                                        <div className="w-12 h-12 ml-auto shrink-0" />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Permanent Toggle Button (X / Info) */}
                    <button
                        onClick={(e) => { e.stopPropagation(); setIsDetailsVisible(!isDetailsVisible); }}
                        className="fixed bottom-8 right-8 md:bottom-12 md:right-12 z-[130] w-12 h-12 flex items-center justify-center bg-surface hover:bg-surface/90 backdrop-blur-xl border border-text/10 rounded-full text-text transition-all shadow-xl hover:shadow-text/5 pointer-events-auto overflow-hidden group"
                        title={isDetailsVisible ? "Minimize Details" : "Show Details"}
                    >
                        <AnimatePresence mode="wait">
                            {isDetailsVisible ? (
                                <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                                    <X size={20} className="group-hover:scale-110 transition-transform" />
                                </motion.div>
                            ) : (
                                <motion.div key="info" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                                    <Info size={20} className="group-hover:scale-110 transition-transform" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ProjectLightbox;
