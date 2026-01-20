import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { Link } from 'react-router-dom';

interface Project {
    id: number;
    title: string;
    category: string;
    location: string;
    year: number;
    image: string;
}

interface ProjectGridProps {
    projects: Project[];
}

const ProjectCard = ({ project, i, range, targetScale, progress }: {
    project: Project;
    i: number;
    range: number[];
    targetScale: number;
    progress: MotionValue<number>;
}) => {
    const scale = useTransform(progress, range, [1, targetScale]);

    return (
        <div className="h-screen flex items-center justify-center sticky top-0">
            <motion.div
                style={{ scale, top: `calc(-5vh + ${i * 25}px)` }}
                className="relative flex flex-col w-[1000px] h-[600px] rounded-3xl bg-neutral-card border border-white/5 overflow-hidden origin-top shadow-2xl"
            >
                <div className="flex h-full">
                    {/* Image Section */}
                    <div className="w-[60%] h-full overflow-hidden">
                        <Link to={`/projects/${project.id}`} className="block w-full h-full group">
                            <motion.div className="w-full h-full overflow-hidden">
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </motion.div>
                        </Link>
                    </div>

                    {/* Info Section */}
                    <div className="w-[40%] p-12 flex flex-col justify-between bg-neutral-card">
                        <div>
                            <span className="inline-block px-3 py-1 rounded-full border border-white/20 text-xs font-medium text-text-muted mb-6">
                                {project.category}
                            </span>
                            <h2 className="text-4xl font-display font-medium text-white mb-4 leading-tight">
                                {project.title}
                            </h2>
                            <p className="text-text-muted font-light">
                                Location: {project.location}<br />
                                Year: {project.year}
                            </p>
                        </div>

                        <Link to={`/projects/${project.id}`}>
                            <button className="flex items-center gap-4 text-white hover:text-primary transition-colors group">
                                <span className="text-lg">View Project</span>
                                <div className="w-12 h-[1px] bg-white group-hover:bg-primary transition-colors" />
                            </button>
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

const ProjectGrid: React.FC<ProjectGridProps> = ({ projects }) => {
    const container = useRef(null);
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ['start start', 'end end']
    });

    return (
        <div ref={container} className="relative mt-[20vh] mb-[20vh] px-4">
            <div className="max-w-[1000px] mx-auto mb-24">
                <h2 className="text-6xl md:text-8xl font-display font-medium text-white mb-8">
                    Featured <br /> <span className="text-text-muted">Works</span>
                </h2>
            </div>

            {projects.map((project, i) => {
                const targetScale = 1 - ((projects.length - i) * 0.05);
                return (
                    <ProjectCard
                        key={project.id}
                        i={i}
                        project={project}
                        range={[i * 0.25, 1]}
                        targetScale={targetScale}
                        progress={scrollYProgress}
                    />
                );
            })}
        </div>
    );
};

export default ProjectGrid;
