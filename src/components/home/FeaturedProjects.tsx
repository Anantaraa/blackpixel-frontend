import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useProjects } from '../../hooks/useProjects';
import type { Project } from '../../hooks/useProjects';
import ProjectLightbox from './ProjectLightbox';
import { fadeUp, scaleReveal } from '../../utils/animations';

interface DisplayItem {
    id: string;
    project: Project;
    imageUrl: string;
}

const FeaturedProjects: React.FC = () => {
    const { projects, loading } = useProjects();
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
        const idx = projects.findIndex(p => p.id === selectedProject.id);
        setSelectedProject(projects[(idx + 1) % projects.length]);
    };

    const handlePrev = () => {
        if (!selectedProject) return;
        const idx = projects.findIndex(p => p.id === selectedProject.id);
        setSelectedProject(projects[(idx - 1 + projects.length) % projects.length]);
    };

    const displayItems: DisplayItem[] = projects.flatMap(p => {
        const items: DisplayItem[] = [];
        if (p.image) items.push({ id: `${p.id}-main`, project: p, imageUrl: p.image });
        p.gallery?.forEach((img, idx) => {
            if (img.featured) items.push({ id: `${p.id}-gallery-${idx}`, project: p, imageUrl: img.url });
        });
        return items;
    });

    if (loading && projects.length === 0) {
        return (
            <section className="bg-neutral text-text" id="projects">
                <div className="py-10 md:py-16 px-4 md:px-6 mb-4">
                    <div className="flex items-end justify-between border-b border-neutral-border pb-6">
                        <div>
                            <div className="h-3 w-16 bg-neutral-border rounded mb-3 animate-pulse" />
                            <div className="h-12 w-64 bg-neutral-border rounded animate-pulse" />
                        </div>
                    </div>
                </div>
                <div className="w-full px-4 columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-2">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="break-inside-avoid mb-2">
                            <div
                                className="w-full bg-neutral-card animate-pulse rounded-lg"
                                style={{ height: `${200 + (i % 3) * 80}px` }}
                            />
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    return (
        <section className="bg-neutral text-text" id="projects">
            {/* Section Header */}
            <motion.div
                className="py-10 md:py-16 px-4 md:px-6 mb-4"
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
            >
                <div className="flex items-end justify-between border-b border-neutral-border pb-6">
                    <div>
                        <p className="text-xs uppercase tracking-widest text-primary mb-3 font-medium">Portfolio</p>
                        <h2 className="text-4xl md:text-6xl font-display font-medium tracking-tighter text-text">
                            Selected Works
                        </h2>
                    </div>
                    {projects.length > 0 && (
                        <p className="text-text-muted text-sm hidden md:block pb-1">
                            {projects.length} project{projects.length !== 1 ? 's' : ''}
                        </p>
                    )}
                </div>
            </motion.div>

            {/* CSS Masonry — each card fades up independently as it enters the viewport */}
            <div className="w-full px-4 columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-2">
                {displayItems.map((item) => (
                    <div key={item.id} className="break-inside-avoid mb-2">
                        <motion.div
                            variants={scaleReveal}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-40px' }}
                        >
                            <ProjectItem
                                project={item.project}
                                imageUrl={item.imageUrl}
                                onClick={() => openLightbox(item.project)}
                            />
                        </motion.div>
                    </div>
                ))}
            </div>

            <ProjectLightbox
                project={selectedProject}
                nextProject={selectedProject ? projects[(projects.findIndex(p => p.id === selectedProject.id) + 1) % projects.length] : null}
                prevProject={selectedProject ? projects[(projects.findIndex(p => p.id === selectedProject.id) - 1 + projects.length) % projects.length] : null}
                isOpen={isLightboxOpen}
                onClose={closeLightbox}
                onNext={handleNext}
                onPrev={handlePrev}
            />
        </section>
    );
};

const ProjectItem: React.FC<{ project: Project; imageUrl: string; onClick: () => void }> = ({ project, imageUrl, onClick }) => {
    const [imgError, setImgError] = useState(false);

    if (imgError) return null;

    return (
        <motion.div
            className="group relative overflow-hidden cursor-pointer rounded-lg"
            onClick={onClick}
            whileHover="hover"
            initial="rest"
        >
            <div className="relative w-full h-auto overflow-hidden">
                <motion.img
                    src={imageUrl}
                    alt={project.title}
                    className="w-full h-auto block object-cover will-change-transform"
                    loading="lazy"
                    onError={() => setImgError(true)}
                    variants={{
                        rest: { scale: 1 },
                        hover: { scale: 1.04, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
                    }}
                />
            </div>

            {/* Hover Overlay */}
            <motion.div
                className="absolute inset-0 z-10"
                variants={{
                    rest: { backgroundColor: 'rgba(0,0,0,0)' },
                    hover: { backgroundColor: 'rgba(0,0,0,0.4)', transition: { duration: 0.4 } },
                }}
            >
                <motion.div
                    className="absolute bottom-6 left-6 right-6"
                    variants={{
                        rest: { opacity: 0, y: 12 },
                        hover: { opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.05 } },
                    }}
                >
                    <span className="inline-block px-2 py-1 mb-2 text-[10px] bg-white/10 backdrop-blur-md rounded-full text-white/90 uppercase tracking-widest shadow-sm border border-white/10">
                        {project.categories?.name || 'Project'}
                    </span>
                    <h3 className="text-xl font-display font-medium text-white leading-tight drop-shadow-md">
                        {project.title}
                    </h3>
                </motion.div>
            </motion.div>

            {/* Amber accent line — sweeps in from left on hover */}
            <motion.div
                className="absolute bottom-0 left-0 h-[2px] bg-primary"
                variants={{
                    rest: { scaleX: 0, originX: 0 },
                    hover: { scaleX: 1, originX: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
                }}
            />
        </motion.div>
    );
};

export default FeaturedProjects;
