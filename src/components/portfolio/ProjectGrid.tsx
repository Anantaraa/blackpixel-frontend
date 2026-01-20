import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

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
    // Generate predictable random rotation based on ID or index to keep it consistent during renders
    const rotation = (i % 2 === 0 ? 1 : -1) * (Math.random() * 3 + 1); // Mock random, ideally purely deterministic

    const scale = useTransform(progress, range, [1, targetScale]);

    // Create a "slide up" parallax effect for the image inside the card
    const imageY = useTransform(progress, [0, 1], ["0%", "20%"]);

    return (
        <div className="h-screen flex items-center justify-center sticky top-0">
            <motion.div
                style={{
                    scale,
                    top: `calc(10vh + ${i * 35}px)`,
                    rotate: `${i % 2 === 0 ? 2 : -2}deg`, // Alternating subtle rotation
                }}
                className="relative flex flex-col w-[90vw] md:w-[1200px] h-[70vh] rounded-[2rem] bg-neutral-card overflow-hidden origin-top shadow-2xl border border-white/5"
            >
                <Link to={`/projects/${project.id}`} className="block w-full h-full relative group cursor-none-ish">
                    {/* Full Background Image */}
                    <div className="absolute inset-0 overflow-hidden">
                        <motion.div style={{ y: imageY }} className="w-full h-[120%] -mt-[10%]">
                            <img
                                src={project.image}
                                alt={project.title}
                                className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                            />
                        </motion.div>
                    </div>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80" />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />

                    {/* Content Overlay */}
                    <div className="absolute inset-x-0 bottom-0 p-8 md:p-16 flex flex-col md:flex-row items-end justify-between gap-8">
                        <div>
                            <div className="flex items-center gap-4 mb-6">
                                <span className="px-4 py-1.5 rounded-full border border-white/30 text-sm font-mono text-white/80 backdrop-blur-md">
                                    {project.category}
                                </span>
                                <span className="text-white/60 font-mono text-sm">
                                    {project.year}
                                </span>
                            </div>
                            <h2 className="text-5xl md:text-8xl font-display font-medium text-white mb-4 leading-[0.9] tracking-tighter">
                                {project.title}
                            </h2>
                            <div className="flex items-center gap-2 text-white/60">
                                <span className="w-2 h-2 rounded-full bg-primary" />
                                <p className="font-sans text-lg tracking-wide uppercase">
                                    {project.location}
                                </p>
                            </div>
                        </div>

                        <div className="hidden md:block">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                className="w-24 h-24 rounded-full bg-white text-black flex items-center justify-center group-hover:bg-primary transition-colors duration-300"
                            >
                                <ArrowUpRight className="w-10 h-10 transition-transform duration-300 group-hover:rotate-45" />
                            </motion.button>
                        </div>
                    </div>
                </Link>
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
        <div ref={container} className="relative mt-[10vh] mb-[10vh] px-4 min-h-[300vh]"> {/* Increased scroll distance */}
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
