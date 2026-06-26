import React from 'react';
import { Link } from 'react-router-dom';
import { SERVICES } from '../../data/mockData';
import { Box, Glasses, Film, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeUp, staggerContainer, staggerItem } from '../../utils/animations';

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
        <section className="py-32 bg-neutral text-text relative overflow-hidden transition-colors duration-500">
            {/* Brand-colored atmospheric glow */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-6 md:px-12 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">

                    {/* Left Column — Title */}
                    <motion.div
                        className="lg:col-span-5"
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-80px' }}
                    >
                        <h2 className="text-6xl md:text-8xl font-medium font-display uppercase leading-[0.85] tracking-tighter mb-8 text-text">
                            Our <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/50">Expertise</span>
                        </h2>
                        <p className="text-text-muted text-lg max-w-sm border-l-2 border-primary/40 pl-6 mt-12">
                            We combine architectural precision with cinematic storytelling to create digital experiences that matter.
                        </p>
                    </motion.div>

                    {/* Right Column — Services List with stagger cascade */}
                    <div className="lg:col-span-7 flex flex-col justify-center">
                        <motion.div
                            className="space-y-0"
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-80px' }}
                        >
                            {SERVICES.map((service, index) => (
                                <motion.div
                                    key={index}
                                    variants={staggerItem}
                                    className="group relative border-t border-neutral-border py-12 hover:bg-neutral-card transition-colors duration-500"
                                >
                                    <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-6 mb-4 px-4">
                                        <div className="flex items-center gap-6">
                                            <motion.span
                                                className="text-primary/60 group-hover:text-primary transition-colors duration-300"
                                                whileHover={{ rotate: 8, scale: 1.1 }}
                                                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                                            >
                                                {getIcon(service.icon)}
                                            </motion.span>
                                            <h3 className="text-3xl md:text-4xl font-light font-display uppercase group-hover:translate-x-2 transition-transform duration-500 text-text">
                                                {service.title}
                                            </h3>
                                        </div>
                                        <motion.div
                                            whileHover={{ x: 3, y: -3 }}
                                            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                                        >
                                            <ArrowUpRight className="w-6 h-6 text-text-muted/50 group-hover:text-primary transition-colors duration-300" />
                                        </motion.div>
                                    </div>

                                    {/* Description — revealed on hover only */}
                                    <div className="md:pl-[88px] overflow-hidden grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-500 px-4">
                                        <div className="min-h-0">
                                            <p className="text-text-muted max-w-md pt-4">
                                                {service.description}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Amber highlight line — sweeps in from left on hover */}
                                    <div className="absolute top-0 left-0 w-full h-[1.5px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                                </motion.div>
                            ))}
                            <div className="border-t border-neutral-border" />
                        </motion.div>

                        {/* CTA */}
                        <motion.div
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="mt-12 px-4"
                        >
                            <Link
                                to="/services"
                                className="inline-flex items-center gap-3 text-sm font-medium text-text-muted hover:text-primary transition-colors duration-300 group"
                            >
                                <span>View all services</span>
                                <motion.span
                                    whileHover={{ x: 3, y: -3 }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                                >
                                    <ArrowUpRight className="w-4 h-4 text-primary" />
                                </motion.span>
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ServicesOverview;
