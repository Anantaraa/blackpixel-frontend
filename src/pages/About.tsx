import React from 'react';
import Navigation from '../components/common/Navigation';
import Footer from '../components/common/Footer';
import { motion } from 'framer-motion';

const About: React.FC = () => {
    return (
        <div className="min-h-screen bg-neutral flex flex-col">
            <Navigation />

            <main className="flex-grow pt-32 pb-0">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-4xl mx-auto text-center mb-24"
                    >
                        <h1 className="text-4xl md:text-6xl font-bold font-heading text-text mb-8">
                            Crafting Reality Before It Exists
                        </h1>
                        <p className="text-xl text-text-muted leading-relaxed">
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
                            <h2 className="text-3xl font-bold font-heading text-text mb-6">Our Philosophy</h2>
                            <p className="text-text-muted mb-6 leading-relaxed">
                                We believe that every project has a story. Our role is not just to produce images,
                                but to be storytellers. By combining cutting-edge technology with artistic sensitivity,
                                we create visuals that resonate on an emotional level.
                            </p>
                            <p className="text-text-muted leading-relaxed">
                                Precision is our language, and atmosphere is our medium. From the way light falls
                                on a material to the composition of a shot, every detail is curated to support the narrative.
                            </p>
                        </div>
                    </div>

                    <div className="mb-0">
                        <h2 className="text-3xl md:text-5xl font-display font-medium mb-16 text-center text-text">The Team</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { name: 'Alex Rivera', role: 'Creative Director', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300&h=300', bio: 'Visionary leader with 15+ years in architectural visualization.' },
                                { name: 'Sarah Chen', role: 'Senior 3D Artist', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=300&h=300', bio: 'Expert in lighting and atmospheric composition.' },
                                { name: 'Marcus Jo', role: 'Project Manager', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300&h=300', bio: 'Ensures seamless delivery and client satisfaction.' },
                            ].map((member) => (
                                <div key={member.name} className="group p-8 rounded-2xl bg-neutral-card border border-neutral-border hover:border-primary/50 transition-all duration-300 text-center">
                                    <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden relative">
                                        <img src={member.image} alt={member.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-1 text-text">{member.name}</h3>
                                    <p className="text-primary text-sm font-medium mb-4">{member.role}</p>
                                    <p className="text-text-muted text-sm leading-relaxed">{member.bio}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default About;
