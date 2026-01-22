import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useProjects } from '../../hooks/useProjects';
import type { Project } from '../../hooks/useProjects';
import ProjectLightbox from './ProjectLightbox';

const FeaturedProjects: React.FC = () => {
    const { projects, loading } = useProjects();

    // Filter only featured projects if needed, or show all. 
    // User said "incremental height based on number of projects uploaded which are featured".
    // Let's assume we show ALL projects that are marked 'featured' in DB.
    // Or just all projects if 'featured' flag isn't strictly used yet. 
    // The Admin panel allows setting 'featured'. Let's trust the DB sort.

    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    const openLightbox = (project: Project) => {
        setSelectedProject(project);
        setIsLightboxOpen(true);
    };

    const closeLightbox = () => {
        setIsLightboxOpen(false);
        setTimeout(() => setSelectedProject(null), 300);
    };

    const handleNext = () => {
        if (!selectedProject) return;
        const currentIndex = projects.findIndex(p => p.id === selectedProject.id);
        const nextIndex = (currentIndex + 1) % projects.length;
        setSelectedProject(projects[nextIndex]);
    };

    const handlePrev = () => {
        if (!selectedProject) return;
        const currentIndex = projects.findIndex(p => p.id === selectedProject.id);
        const prevIndex = (currentIndex - 1 + projects.length) % projects.length;
        setSelectedProject(projects[prevIndex]);
    };

    if (loading && projects.length === 0) {
        return <div className="py-20 text-center text-white">Loading Projects...</div>;
    }

    return (
        <section className="bg-neutral text-white" id="projects">
            <div className="py-20 mb-8 text-center bg-neutral">
                <h2 className="text-4xl md:text-6xl font-display font-medium uppercase tracking-tight">
                    Selected Works
                </h2>
            </div>

            {/* Masonry Layout - 5 Columns */}
            <div className="w-full px-4 columns-1 sm:columns-2 md:columns-3 lg:columns-5 gap-4 space-y-4">
                {projects.map((project, index) => (
                    <ProjectItem
                        key={project.id}
                        project={project}
                        index={index}
                        onClick={() => openLightbox(project)}
                    />
                ))}
            </div>

            <ProjectLightbox
                project={selectedProject as any} // Temporary cast until Lightbox is updated
                isOpen={isLightboxOpen}
                onClose={closeLightbox}
                onNext={handleNext}
                onPrev={handlePrev}
            />
        </section>
    );
};

// Separate component to handle per-item scroll parallax logic
// Separate component to handle per-item scroll parallax logic
const ProjectItem: React.FC<{ project: any, index: number, onClick: () => void }> = ({ project, index, onClick }) => {
    // Parallax removed to ensure 100% image visibility (no cropping) as requested.
    // Standard Masonry behavior: Width fits column, Height is dynamic based on aspect ratio.

    return (
        <div
            className="break-inside-avoid mb-4 group relative overflow-hidden cursor-pointer bg-neutral-900 rounded-lg"
            onClick={onClick}
        >
            {/* Image Container */}
            <div className="relative w-full h-auto">
                <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-auto block object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02] will-change-transform"
                    loading="lazy"
                />
            </div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-500 z-10">
                <div className="absolute bottom-6 left-6 right-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                    <span className="inline-block px-2 py-1 mb-2 text-[10px] border border-white/50 rounded-full text-white/90 uppercase tracking-widest backdrop-blur-sm shadow-sm">
                        {project.categories?.name || 'Project'}
                    </span>
                    <h3 className="text-xl font-display font-medium text-white leading-tight drop-shadow-md">
                        {project.title}
                    </h3>
                </div>
            </div>
        </div>
    );
}

export default FeaturedProjects;
