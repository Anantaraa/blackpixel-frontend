import React from 'react';
import Navigation from '../components/common/Navigation';
import Footer from '../components/common/Footer';
import ServicesOverview from '../components/home/ServicesOverview';
import { motion } from 'framer-motion';

const Services: React.FC = () => {
    return (
        <div className="bg-neutral min-h-screen text-white">
            <Navigation />

            <main className="pt-32 pb-20">
                <div className="container mx-auto px-6 md:px-12 mb-20">
                    <motion.h1
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-6xl md:text-9xl font-display font-bold tracking-tighter mb-8"
                    >
                        Services
                    </motion.h1>
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="w-full h-[1px] bg-white/20 mb-12"
                    />
                </div>

                {/* Reuse the Overview for now as it contains the content, but we might want to expand later */}
                <div className="-mt-32">
                    <ServicesOverview />
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Services;
