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
    const [isDetailsVisible, setIsDetailsVisible] = useState(true);

    // Reset details visibility when project changes
    useEffect(() => {
        setIsDetailsVisible(true);
    }, [project]);

    // Deduplicate images
    const allImages = project
        ? Array.from(new Set([project.image, ...(project.gallery?.map(g => g.url) || [])].filter(Boolean)))
        : [];

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
                    className="fixed inset-0 z-50 flex items-center justify-center bg-surface/95 backdrop-blur-sm p-4 md:p-8"
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

                    {/* Fullscreen Image Scroll Container */}
                    <div
                        className="fixed inset-0 z-[80] overflow-y-auto overflow-x-hidden custom-scrollbar bg-surface w-full h-full"
                        data-lenis-prevent="true"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="w-full min-h-full flex flex-col items-center">
                            {allImages.map((imgUrl, idx) => (
                                <motion.img
                                    key={`${project.id}-img-${idx}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: Math.min(idx * 0.1, 0.5) }}
                                    src={imgUrl}
                                    alt={`${project.title} - Image ${idx + 1}`}
                                    className="w-full h-auto object-cover mb-1 md:mb-2 pointer-events-none"
                                />
                            ))}
                        </div>
                    </div>

                    {/* Floating Details Pane */}
                    <AnimatePresence mode="wait">
                        {isDetailsVisible ? (
                            <motion.div
                                key="details-open"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="fixed bottom-8 right-4 md:right-24 md:bottom-auto md:top-24 z-[120] w-[calc(100vw-2rem)] md:w-[400px] h-[75vh] max-h-[800px] bg-surface/60 backdrop-blur-xl border border-text/10 p-6 md:p-8 rounded-[2.5rem] rounded-tr-xl flex flex-col shadow-2xl pointer-events-auto"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Minimize Button inside pane */}
                                <button
                                    onClick={() => setIsDetailsVisible(false)}
                                    className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center text-text/50 hover:text-text transition-colors bg-surface/50 hover:bg-surface/80 rounded-full backdrop-blur-md border border-text/10 z-[130]"
                                    title="Minimize Details"
                                >
                                    <X size={24} />
                                </button>

                                <div className="overflow-y-auto pr-2 custom-scrollbar mt-4 h-full">
                                    <div className="mb-6">
                                        <span className="inline-block px-3 py-1 mb-4 text-xs bg-text/10 rounded-full text-text/80 uppercase tracking-widest">
                                            {project.categories?.name || 'Project'}
                                        </span>
                                        <h2 className="text-3xl font-display font-bold text-text mb-2 leading-tight pr-6">
                                            {project.title}
                                        </h2>
                                        <p className="text-text/50 text-sm font-mono tracking-wide">
                                            {project.location} • {project.year}
                                        </p>
                                    </div>

                                    {project.description && (
                                        <div className="mb-6">
                                            <p className="text-text/80 leading-relaxed font-light text-sm">
                                                {project.description}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.button
                                key="details-closed"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                onClick={(e) => { e.stopPropagation(); setIsDetailsVisible(true); }}
                                className="fixed right-10 bottom-[calc(75vh-2.5rem)] md:bottom-auto md:top-[7.5rem] md:right-[7.5rem] z-[130] w-12 h-12 flex items-center justify-center bg-surface/80 hover:bg-surface backdrop-blur-xl border border-text/10 rounded-full text-text transition-all shadow-lg hover:shadow-text/5 pointer-events-auto"
                                title="Show Details"
                            >
                                <Info size={24} />
                            </motion.button>
                        )}
                    </AnimatePresence>


                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ProjectLightbox;
