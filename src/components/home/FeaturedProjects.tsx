import React from 'react';
import { motion } from 'framer-motion';
import { PROJECTS } from '../../data/mockData';
import Button from '../common/Button';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '../../utils/cn';

const FeaturedProjects: React.FC = () => {
    const featured = PROJECTS.slice(0, 8); // Display 8 projects

    return (
        <section className="py-32 bg-neutral text-white">
            <div className="container mx-auto px-4 md:px-8">
                <div className="flex flex-col md:flex-row justify-between items-end mb-24">
                    <h2 className="text-6xl md:text-9xl font-display font-medium uppercase leading-[0.8] tracking-tighter mix-blend-difference">
                        Selected <br /> <span className="text-white/40">Works</span>
                    </h2>
                    <Link to="/projects">
                        <Button variant="outline" className="hidden md:inline-flex rounded-full border-white/20 text-white hover:bg-white hover:text-black uppercase tracking-widest px-8">All Projects</Button>
                    </Link>
                </div>

                {/* Creative Grid: Alternating Layouts */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[500px]">
                    {featured.map((project, index) => {
                        // Creative spanning logic
                        const isLarge = index === 0 || index === 5;
                        const isTall = index === 2 || index === 6;
                        const isWide = index === 3;

                        let spanClass = "md:col-span-1";
                        if (isLarge) spanClass = "md:col-span-2 md:row-span-2";
                        else if (isWide) spanClass = "md:col-span-2";
                        else if (isTall) spanClass = "md:col-span-1 md:row-span-2";

                        return (
                            <motion.div
                                key={project.id}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ delay: index * 0.1, duration: 0.6 }}
                                className={cn(spanClass, "relative group overflow-hidden rounded-2xl bg-neutral-card border border-white/5 cursor-pointer")}
                            >
                                <Link to={`/projects/${project.id}`} className="block w-full h-full">
                                    <div className="w-full h-full relative">
                                        <img
                                            src={project.image}
                                            alt={project.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />

                                        {/* Hover Overlay - Details at Bottom */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-8">
                                            <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                                <div className="flex justify-between items-end">
                                                    <div>
                                                        <span className="inline-block px-3 py-1 mb-3 text-xs border border-white/30 rounded-full text-white/80 uppercase tracking-wider backdrop-blur-md">
                                                            {project.category}
                                                        </span>
                                                        <h3 className="text-3xl font-display font-medium leading-none text-white">
                                                            {project.title}
                                                        </h3>
                                                        <p className="text-white/60 text-sm mt-2 font-mono">
                                                            {project.location} • {project.year}
                                                        </p>
                                                    </div>
                                                    <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center transform rotate-45 group-hover:rotate-0 transition-transform duration-300">
                                                        <ArrowUpRight size={24} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>

                <div className="mt-24 text-center md:hidden">
                    <Link to="/projects">
                        <Button variant="outline" className="w-full rounded-full border-white text-white uppercase tracking-widest">All Projects</Button>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default FeaturedProjects;
