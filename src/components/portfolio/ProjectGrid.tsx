import React from 'react';
import { motion } from 'framer-motion';
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

const ProjectCard = ({ project, className, index }: { project: Project; className?: string, index: number }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8, delay: index * 0.1, ease: [0.215, 0.61, 0.355, 1] }}
            className={`group relative block overflow-hidden bg-neutral-card rounded-[2rem] ${className}`}
        >
            <Link to={`/projects/${project.id}`} className="block w-full h-full cursor-none-ish">
                {/* Image - Slight scale on hover */}
                <div className="absolute inset-0 transition-transform duration-1000 ease-out group-hover:scale-105">
                    <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Overlay - Gradient always present, visible details on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Content Container */}
                <div className="absolute inset-x-0 bottom-0 p-8 md:p-12 flex flex-col justify-end">
                    <div className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                        <span className="inline-block px-3 py-1 mb-4 rounded-full border border-white/30 text-xs font-mono text-white/80 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                            {project.category}
                        </span>
                        <h2 className="text-3xl md:text-5xl font-display font-medium text-white mb-2 leading-[0.9] tracking-tighter">
                            {project.title}
                        </h2>
                        <div className="flex items-center justify-between mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200">
                            <p className="font-sans text-sm tracking-wide uppercase text-white/60">
                                {project.location} • {project.year}
                            </p>
                            <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300">
                                <ArrowUpRight className="w-5 h-5" />
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

const ProjectGrid: React.FC<ProjectGridProps> = ({ projects }) => {

    // Helper to determine layout class based on index
    // Revised to eliminate gaps by pairing items
    const getLayoutStyles = (index: number) => {
        const patternIndex = index % 6;

        switch (patternIndex) {
            case 0: // Hero - Full Width
                return "col-span-1 md:col-span-12 aspect-[16/9]";

            case 1: // Asymmetric Left (Wide)
                return "col-span-1 md:col-span-8 aspect-[16/10]";

            case 2: // Asymmetric Right (Narrow) - Indented slightly
                // Fits next to the 8-col item (12-8=4) but let's give it 4 cols.
                return "col-span-1 md:col-span-4 aspect-[3/4] md:mt-12"; // Offset for style

            case 3: // Full Width Slim
                return "col-span-1 md:col-span-12 aspect-[21/9]";

            case 4: // Half Left
                return "col-span-1 md:col-span-6 aspect-[4/3]";

            case 5: // Half Right
                return "col-span-1 md:col-span-6 aspect-[4/3] md:mt-24"; // Offset for style

            default:
                return "col-span-1 md:col-span-12 aspect-[16/9]";
        }
    };

    return (
        <div className="w-full px-4 md:px-8 bg-neutral min-h-screen pb-32">
            <div className="max-w-[1800px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start">
                {projects.map((project, i) => (
                    <ProjectCard
                        key={project.id}
                        project={project}
                        index={i}
                        className={getLayoutStyles(i)}
                    />
                ))}
            </div>
        </div>
    );
};

export default ProjectGrid;
