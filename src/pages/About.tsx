import React, { useRef, useEffect } from 'react';
import Navigation from '../components/common/Navigation';
import Footer from '../components/common/Footer';
import { motion, useInView, animate } from 'framer-motion';
import PageTransition from '../components/common/PageTransition';
import TextReveal from '../components/common/TextReveal';
import { scaleReveal, slideRight, staggerContainer, staggerItem, fadeUp } from '../utils/animations';

const STATS = [
    { value: 50, suffix: '+', label: 'Projects Completed' },
    { value: 5,  suffix: '+', label: 'Years of Experience' },
    { value: 30, suffix: '+', label: 'Satisfied Clients' },
    { value: 3,  suffix: '',  label: 'Core Services' },
];

const TEAM = [
    {
        name: 'Jenul Vachhani',
        role: 'Architect & Founder',
        image: 'http://res.cloudinary.com/dksko3kxs/image/upload/v1774598297/file_gchsqm.jpg',
        bio: 'Visionary leader with 5+ years in architectural visualization.',
    },
    {
        name: 'Harkishan Kumbhani',
        role: 'Architect',
        image: 'http://res.cloudinary.com/dksko3kxs/image/upload/v1774598838/photo_60_2025-02-16_15-14-19_czdwp8.jpg',
        bio: 'Expert in structure and design philosophy.',
    },
    {
        name: 'Nikhil Dodiya',
        role: 'Project Manager',
        image: null,
        bio: 'Ensures seamless delivery and client satisfaction.',
    },
];

function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true, margin: '-60px' });

    useEffect(() => {
        if (!inView || !ref.current) return;
        const controls = animate(0, target, {
            duration: 1.6,
            ease: [0.16, 1, 0.3, 1],
            onUpdate(value) {
                if (ref.current) ref.current.textContent = Math.round(value) + suffix;
            },
        });
        return () => controls.stop();
    }, [inView, target, suffix]);

    return <span ref={ref}>0{suffix}</span>;
}

const About: React.FC = () => {
    return (
        <PageTransition>
            <div className="min-h-screen bg-neutral flex flex-col">
                <Navigation />

                <main className="flex-grow pt-32 pb-0">
                    <div className="container mx-auto px-6">

                        {/* Hero */}
                        <div className="max-w-4xl mb-16">
                            <motion.p
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1, duration: 0.6 }}
                                className="text-xs uppercase tracking-widest text-primary mb-4 font-medium"
                            >
                                The Studio
                            </motion.p>
                            <h1 className="text-5xl md:text-7xl font-display font-medium text-text tracking-tighter leading-[0.9] mb-8">
                                <TextReveal text="Crafting Reality" delay={0.2} stagger={0.04} />
                                <br />
                                <TextReveal text="Before It Exists" delay={0.65} stagger={0.04} />
                            </h1>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                className="text-xl text-text-muted leading-relaxed max-w-2xl"
                            >
                                BlackPixel is a creative studio dedicated to the art of architectural visualization.
                                We bridge the gap between imagination and reality, helping architects and developers
                                communicate their vision with clarity and emotion.
                            </motion.p>
                        </div>

                        {/* Count-up Stats */}
                        <motion.div
                            className="grid grid-cols-2 md:grid-cols-4 gap-8 border-y border-neutral-border py-16 mb-24"
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                        >
                            {STATS.map((stat) => (
                                <motion.div key={stat.label} variants={staggerItem}>
                                    <p className="text-5xl md:text-6xl font-display font-medium tracking-tight text-text">
                                        <Counter target={stat.value} suffix={stat.suffix} />
                                    </p>
                                    <p className="text-text-muted text-sm mt-2">{stat.label}</p>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Philosophy */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-24">
                            <motion.img
                                variants={scaleReveal}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: '-60px' }}
                                src="https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=2700&auto=format&fit=crop"
                                alt="Architectural render — precision in light and shadow"
                                className="rounded-xl shadow-lg w-full h-auto"
                            />
                            <motion.div
                                variants={slideRight}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: '-60px' }}
                            >
                                <h2 className="text-3xl md:text-4xl font-display font-medium text-text mb-6 tracking-tight">Our Philosophy</h2>
                                <p className="text-text-muted mb-6 leading-relaxed">
                                    We believe that every project has a story. Our role is not just to produce images,
                                    but to be storytellers. By combining cutting-edge technology with artistic sensitivity,
                                    we create visuals that resonate on an emotional level.
                                </p>
                                <p className="text-text-muted leading-relaxed">
                                    Precision is our language, and atmosphere is our medium. From the way light falls
                                    on a material to the composition of a shot, every detail is curated to support the narrative.
                                </p>
                                <div className="mt-10 border-l-2 border-primary/40 pl-6">
                                    <p className="text-text font-light text-lg italic">
                                        "We don't render buildings. We render the feeling of being inside them."
                                    </p>
                                </div>
                            </motion.div>
                        </div>

                        {/* Team */}
                        <div className="mb-0">
                            <motion.div
                                variants={fadeUp}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                className="flex items-end justify-between border-b border-neutral-border pb-6 mb-12"
                            >
                                <div>
                                    <p className="text-xs uppercase tracking-widest text-primary mb-3 font-medium">People</p>
                                    <h2 className="text-4xl md:text-5xl font-display font-medium text-text tracking-tight">The Team</h2>
                                </div>
                            </motion.div>

                            <motion.div
                                className="grid grid-cols-1 md:grid-cols-3 gap-8"
                                variants={staggerContainer}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: '-60px' }}
                            >
                                {TEAM.map((member) => (
                                    <motion.div
                                        key={member.name}
                                        variants={staggerItem}
                                        whileHover={{ y: -6, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
                                        className="group p-8 rounded-2xl bg-neutral-card border border-neutral-border hover:border-primary/40 hover:shadow-lg transition-shadow duration-500 text-center cursor-default"
                                    >
                                        <div className="w-28 h-28 mx-auto mb-6 rounded-full overflow-hidden relative border border-neutral-border">
                                            {member.image ? (
                                                <img
                                                    src={member.image}
                                                    alt={member.name}
                                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-neutral flex items-center justify-center text-3xl font-display font-medium text-text-muted group-hover:text-primary transition-colors duration-300">
                                                    {member.name.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                        <h3 className="text-xl font-display font-medium mb-1 text-text">{member.name}</h3>
                                        <p className="text-primary text-sm font-medium mb-4">{member.role}</p>
                                        <p className="text-text-muted text-sm leading-relaxed">{member.bio}</p>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>
                    </div>
                </main>

                <Footer />
            </div>
        </PageTransition>
    );
};

export default About;
