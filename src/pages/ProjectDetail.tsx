import React, { useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Play } from 'lucide-react';
import Navigation from '../components/common/Navigation';
import Footer from '../components/common/Footer';
import { PROJECTS } from '../data/mockData';
import Lenis from 'lenis';

const ProjectDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const project = PROJECTS.find(p => p.id === Number(id));
    const containerRef = useRef(null);

    useEffect(() => {
        const lenis = new Lenis();
        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
        window.scrollTo(0, 0); // Reset scroll on mount
        return () => lenis.destroy();
    }, [id]); // Reset when ID changes

    if (!project) return <div>Project Not Found</div>;

    return (
        <div ref={containerRef} className="min-h-screen bg-neutral text-white selection:bg-primary selection:text-white">
            <Navigation />

            {/* Immersive Hero (Video/Image) */}
            <div className="relative w-full h-screen overflow-hidden">
                <div className="absolute inset-0 bg-neutral/20 z-10" /> {/* Cinematic Overlay */}
                {project.video ? (
                    <video
                        className="w-full h-full object-cover"
                        autoPlay
                        muted
                        loop
                        playsInline
                        poster={project.image}
                    >
                        <source src={project.video} type="video/mp4" />
                    </video>
                ) : (
                    <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                )}

                <div className="absolute inset-0 z-20 flex flex-col justify-end p-8 md:p-24 bg-gradient-to-t from-neutral to-transparent">
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <span className="inline-block px-4 py-1 mb-6 rounded-full border border-white/20 backdrop-blur-md text-sm uppercase tracking-widest text-white/80">
                            {project.category}
                        </span>
                        <h1 className="text-6xl md:text-9xl font-display font-medium tracking-tighter leading-[0.9] mb-4">
                            {project.title}
                        </h1>
                        <div className="flex items-center gap-8 text-lg font-light text-white/60">
                            <span>{project.location}</span>
                            <span className="w-1 h-1 bg-white/60 rounded-full" />
                            <span>{project.year}</span>
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-12 py-24 md:py-32">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8">

                    {/* Sticky Sidebar Info - Col 1-4 */}
                    <div className="md:col-span-4 relative">
                        <div className="sticky top-32 space-y-12">
                            <div>
                                <h3 className="text-xs uppercase tracking-widest text-text-muted mb-4">Challenge</h3>
                                <p className="text-white/90 font-light leading-relaxed text-lg">
                                    To design a space that transcends the ordinary, merging structure with the ephemeral qualities of light and landscape.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-xs uppercase tracking-widest text-text-muted mb-2">Service</h3>
                                    <p className="text-white">CGI / Animation</p>
                                </div>
                                <div>
                                    <h3 className="text-xs uppercase tracking-widest text-text-muted mb-2">Client</h3>
                                    <p className="text-white">Confidential</p>
                                </div>
                            </div>

                            <Link to="/contact">
                                <button className="group flex items-center gap-3 text-primary text-lg font-medium">
                                    <span className="group-hover:translate-x-1 transition-transform">Inquire Project</span>
                                    <ArrowLeft className="rotate-180" size={20} />
                                </button>
                            </Link>
                        </div>
                    </div>

                    {/* Main Content & Gallery - Col 5-12 */}
                    <div className="md:col-span-8 space-y-24">
                        {/* Description */}
                        <div>
                            <h2 className="text-3xl md:text-5xl font-display font-medium leading-tight mb-8 text-white/90">
                                {project.description}
                            </h2>
                            <p className="text-xl text-text-muted font-light leading-relaxed">
                                The generated space is not just about walls and roofs, but about the feelings it evokes.
                                We utilized advanced PBR materials to simulate the real-world weathering of concrete and wood,
                                creating a sense of timelessness.
                            </p>
                        </div>

                        {/* Video Feature */}
                        <div className="relative aspect-video rounded-2xl overflow-hidden bg-neutral-card border border-white/5 group cursor-pointer">
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors z-10">
                                <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform">
                                    <Play className="fill-white text-white ml-1" size={24} />
                                </div>
                            </div>
                            <img src={project.gallery?.[0] || project.image} alt="Video Thumbnail" className="w-full h-full object-cover opacity-80" />
                        </div>

                        {/* 4 Image Gallery - Asymmetric Layout */}
                        <div className="space-y-8">
                            {/* Row 1: Large + Small */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="md:col-span-2 h-[60vh] rounded-2xl overflow-hidden">
                                    <img src={project.gallery?.[0]} alt="Detail 1" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                                </div>
                            </div>

                            {/* Row 2: Two Vertical Portraits */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[80vh]">
                                <div className="h-full rounded-2xl overflow-hidden mt-0 md:mt-24">
                                    <img src={project.gallery?.[1]} alt="Detail 2" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                                </div>
                                <div className="h-full rounded-2xl overflow-hidden">
                                    <img src={project.gallery?.[2]} alt="Detail 3" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                                </div>
                            </div>

                            {/* Row 3: Full Width */}
                            <div className="h-[70vh] rounded-2xl overflow-hidden">
                                <img src={project.gallery?.[3]} alt="Detail 4" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                            </div>
                        </div>

                        {/* Navigation Footer */}
                        <div className="pt-24 border-t border-white/10 flex justify-between items-center">
                            <Link to="/projects" className="text-text-muted hover:text-white transition-colors uppercase tracking-widest text-sm">
                                All Projects
                            </Link>
                            <Link to={`/projects/${project.id === 5 ? 1 : project.id + 1}`} className="text-2xl md:text-4xl font-display font-medium hover:text-primary transition-colors flex items-center gap-4">
                                Next Project <ArrowLeft className="rotate-180" />
                            </Link>
                        </div>
                    </div>

                </div>
            </div>

            <Footer />
        </div>
    );
};

export default ProjectDetail;
