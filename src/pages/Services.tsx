import React from 'react';
import Navigation from '../components/common/Navigation';
import Footer from '../components/common/Footer';
import ServicesOverview from '../components/home/ServicesOverview';
import { motion } from 'framer-motion';
import PageTransition from '../components/common/PageTransition';
import TextReveal from '../components/common/TextReveal';

const Services: React.FC = () => {
    return (
        <PageTransition>
            <div className="bg-neutral min-h-screen text-text">
                <Navigation />

                <main className="pt-32 pb-20">
                    <div className="container mx-auto px-6 md:px-12 mb-20">
                        <h1 className="text-6xl md:text-9xl font-display font-bold tracking-tighter mb-8 text-text">
                            <TextReveal text="Services" delay={0.1} stagger={0.07} />
                        </h1>
                        <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: 0.7, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                            className="w-full h-[1px] bg-neutral-border mb-12 origin-left"
                        />
                    </div>

                    <div className="-mt-32">
                        <ServicesOverview />
                    </div>
                </main>

                <Footer />
            </div>
        </PageTransition>
    );
};

export default Services;
