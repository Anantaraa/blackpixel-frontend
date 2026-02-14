import React, { useState, useEffect } from 'react';
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

    // Masonry Column Calculation
    const [columns, setColumns] = useState<Project[][]>([]);

    useEffect(() => {
        const calculateColumns = () => {
            const width = window.innerWidth;
            let numCols = 1;
            if (width >= 1024) numCols = 5;      // lg
            else if (width >= 768) numCols = 3;  // md
            else if (width >= 640) numCols = 2;  // sm

            // Distribute projects
            const newCols: Project[][] = Array.from({ length: numCols }, () => []);
            projects.forEach((project, i) => {
                newCols[i % numCols].push(project);
            });
            setColumns(newCols);
        };

        calculateColumns();
        window.addEventListener('resize', calculateColumns);
        return () => window.removeEventListener('resize', calculateColumns);
    }, [projects]);

    if (loading && projects.length === 0) {
        return <div className="py-20 text-center text-text">Loading Projects...</div>;
    }

    return (
        <section className="bg-neutral text-text" id="projects">
            <div className="py-20 mb-8 text-center bg-neutral">
                <h2 className="text-4xl md:text-6xl font-display font-medium uppercase tracking-tight">
                    Selected Works
                </h2>
            </div>

            {/* Masonry Layout - JS Distributed for Horizontal Ordering */}
            <div className="w-full px-4 flex gap-2 items-start">
                {columns.map((col, colIndex) => (
                    <div key={colIndex} className="flex flex-col gap-2 flex-1">
                        {col.map((project) => (
                            <ProjectItem
                                key={project.id}
                                project={project}
                                onClick={() => openLightbox(project)}
                            />
                        ))}
                    </div>
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
const ProjectItem: React.FC<{ project: any, onClick: () => void }> = ({ project, onClick }) => {
    // Parallax removed to ensure 100% image visibility (no cropping) as requested.
    // Standard Masonry behavior: Width fits column, Height is dynamic based on aspect ratio.

    return (
        <div
            className="break-inside-avoid group relative overflow-hidden cursor-pointer rounded-lg" // Removed bg-neutral-900 and mb-4
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
                    <span className="inline-block px-2 py-1 mb-2 text-[10px] bg-white/10 backdrop-blur-md rounded-full text-white/90 uppercase tracking-widest shadow-sm">
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
