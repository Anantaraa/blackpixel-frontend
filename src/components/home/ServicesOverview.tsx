import React from 'react';
import { SERVICES } from '../../data/mockData';
import { Box, Glasses, Film, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

const ServicesOverview: React.FC = () => {
    const getIcon = (iconName: string) => {
        switch (iconName) {
            case 'Cube': return <Box className="w-8 h-8" />;
            case 'Goggles': return <Glasses className="w-8 h-8" />;
            case 'Film': return <Film className="w-8 h-8" />;
            default: return <Box className="w-8 h-8" />;
        }
    };

    return (
        <section className="py-32 bg-neutral text-white relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-6 md:px-12 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
                    {/* Left Column - Title */}
                    <div className="lg:col-span-5">
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className="text-6xl md:text-8xl font-medium font-display uppercase leading-[0.85] tracking-tighter mb-8 text-white">
                                Our <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">Expertise</span>
                            </h2>
                            <p className="text-text-muted text-lg max-w-sm border-l border-white/20 pl-6 mt-12">
                                We combine architectural precision with cinematic storytelling to create digital experiences that matter.
                            </p>
                        </motion.div>
                    </div>

                    {/* Right Column - Services List */}
                    <div className="lg:col-span-7 flex flex-col justify-center">
                        <div className="space-y-0">
                            {SERVICES.map((service, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="group relative border-t border-white/10 py-12 hover:bg-neutral-card transition-colors duration-500"
                                >
                                    <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-6 mb-4 px-4">
                                        <div className="flex items-center gap-6">
                                            <span className="text-primary/50 group-hover:text-primary transition-colors duration-300">
                                                {getIcon(service.icon)}
                                            </span>
                                            <h3 className="text-3xl md:text-4xl font-light font-display uppercase group-hover:translate-x-2 transition-transform duration-500">
                                                {service.title}
                                            </h3>
                                        </div>
                                        <ArrowUpRight className="w-6 h-6 text-white/20 group-hover:text-primary group-hover:rotate-45 transition-all duration-500" />
                                    </div>
                                    <div className="md:pl-[88px] overflow-hidden grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-500 px-4">
                                        <div className="min-h-0">
                                            <p className="text-text-muted max-w-md pt-4">
                                                {service.description}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="md:pl-[88px] block group-hover:hidden transition-all duration-500 px-4">
                                        <p className="text-text-muted/50 max-w-md line-clamp-1">
                                            {service.description}
                                        </p>
                                    </div>

                                    {/* Hover Highlight Line */}
                                    <div className="absolute top-0 left-0 w-full h-[1px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                                </motion.div>
                            ))}
                            <div className="border-t border-white/10" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ServicesOverview;
