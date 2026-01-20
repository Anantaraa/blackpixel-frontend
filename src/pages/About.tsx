import React from 'react';
import Navigation from '../components/common/Navigation';
import Footer from '../components/common/Footer';
import { motion } from 'framer-motion';

const About: React.FC = () => {
    return (
        <div className="min-h-screen bg-neutral flex flex-col">
            <Navigation />

            <main className="flex-grow pt-32 pb-24">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-4xl mx-auto text-center mb-24"
                    >
                        <h1 className="text-4xl md:text-6xl font-bold font-heading text-secondary mb-8">
                            Crafting Reality Before It Exists
                        </h1>
                        <p className="text-xl text-gray-500 leading-relaxed">
                            BlackPixel is a creative studio dedicated to the art of architectural visualization.
                            We bridge the gap between imagination and reality, helping architects and developers
                            communicate their vision with clarity and emotion.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-24">
                        <img
                            src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2700&auto=format&fit=crop"
                            alt="Studio Office"
                            className="rounded-xl shadow-lg w-full h-auto"
                        />
                        <div>
                            <h2 className="text-3xl font-bold font-heading text-secondary mb-6">Our Philosophy</h2>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                We believe that every project has a story. Our role is not just to produce images,
                                but to be storytellers. By combining cutting-edge technology with artistic sensitivity,
                                we create visuals that resonate on an emotional level.
                            </p>
                            <p className="text-gray-600 leading-relaxed">
                                Precision is our language, and atmosphere is our medium. From the way light falls
                                on a material to the composition of a shot, every detail is curated to support the narrative.
                            </p>
                        </div>
                    </div>

                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold font-heading text-secondary mb-12">The Team</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {/* Team Member 1 */}
                            <div className="bg-white p-6 rounded-xl border border-gray-100 text-center">
                                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 overflow-hidden">
                                    <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop" alt="Founder" />
                                </div>
                                <h3 className="text-lg font-bold text-secondary">Alex Morgan</h3>
                                <p className="text-primary text-sm font-medium mb-3">Creative Director</p>
                                <p className="text-gray-500 text-sm">Visionary leader with 15+ years in architectural visualization.</p>
                            </div>
                            {/* Team Member 2 */}
                            <div className="bg-white p-6 rounded-xl border border-gray-100 text-center">
                                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 overflow-hidden">
                                    <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop" alt="Visualizer" />
                                </div>
                                <h3 className="text-lg font-bold text-secondary">Sarah Chen</h3>
                                <p className="text-primary text-sm font-medium mb-3">Senior 3D Artist</p>
                                <p className="text-gray-500 text-sm">Expert in lighting and atmospheric composition.</p>
                            </div>
                            {/* Team Member 3 */}
                            <div className="bg-white p-6 rounded-xl border border-gray-100 text-center">
                                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 overflow-hidden">
                                    <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&auto=format&fit=crop" alt="Manager" />
                                </div>
                                <h3 className="text-lg font-bold text-secondary">David Kim</h3>
                                <p className="text-primary text-sm font-medium mb-3">Project Manager</p>
                                <p className="text-gray-500 text-sm">Ensures seamless delivery and client satisfaction.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default About;
