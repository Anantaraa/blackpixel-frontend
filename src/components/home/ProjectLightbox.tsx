import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

import type { Project } from '../../hooks/useProjects';

interface ProjectLightboxProps {
    project: Project | null;
    isOpen: boolean;
    onClose: () => void;
    onNext: () => void;
    onPrev: () => void;
}

const ProjectLightbox: React.FC<ProjectLightboxProps> = ({ project, isOpen, onClose, onNext, onPrev }) => {

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
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 md:p-8"
                    onClick={onClose} // Close when clicking backdrop
                >
                    {/* External Navigation Arrows */}
                    <button
                        onClick={(e) => { e.stopPropagation(); onPrev(); }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 text-white/50 hover:text-white transition-colors hover:scale-110"
                    >
                        <ChevronLeft size={48} />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onNext(); }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 text-white/50 hover:text-white transition-colors hover:scale-110"
                    >
                        <ChevronRight size={48} />
                    </button>

                    {/* Content Container */}
                    <div
                        className="relative w-full h-[90vh] max-w-[95vw] mx-auto flex flex-col md:flex-row bg-neutral-900 overflow-hidden rounded-lg shadow-2xl"
                        onClick={(e) => e.stopPropagation()} // Prevent close on content click
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-50 p-2 bg-black/20 hover:bg-black/50 text-white rounded-full transition-colors backdrop-blur-md"
                        >
                            <X size={24} />
                        </button>

                        {/* Image Section - Flexible width (Grow) */}
                        <div className="flex-1 h-1/2 md:h-full relative bg-black">
                            {/* Arrows removed from here */}

                            <motion.img
                                key={project.id} // Re-render image on project change
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                                src={project.image}
                                alt={project.title}
                                className="w-full h-full object-contain"
                            />
                        </div>

                        <div className="w-full md:w-[400px] h-1/2 md:h-full bg-neutral-900 border-l border-white/10 p-8 flex flex-col overflow-y-auto shrink-0">


                            <div className="mt-auto md:mt-0 mb-8">
                                <span className="inline-block px-3 py-1 mb-4 text-xs bg-white/10 rounded-full text-white/60 uppercase tracking-widest">
                                    {project.categories?.name || 'Project'}
                                </span>
                                <h2 className="text-3xl md:text-4xl font-display font-medium text-white mb-2 leading-tight">
                                    {project.title}
                                </h2>
                                <p className="text-white/40 text-sm font-mono mb-6">
                                    {project.location} • {project.year}
                                </p>
                            </div>

                            {project.description && (
                                <div className="mb-8 relative">
                                    <p className="text-white/70 leading-relaxed font-light text-sm md:text-base">
                                        {project.description}
                                    </p>
                                </div>
                            )}

                            {/* Pagination Numbers */}
                            <div className="mt-auto pt-8 flex justify-between text-white/30 font-mono text-sm">
                                <span>Project Details</span>
                                <span>{project.year}</span>
                            </div>

                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ProjectLightbox;
