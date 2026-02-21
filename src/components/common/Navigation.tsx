import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import ThemeToggle from './ThemeToggle';

const Navigation: React.FC = () => {

    const links = [
        { name: 'Services', path: '/services' },
        { name: 'Studio', path: '/about' },
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <>
            <div className="fixed top-8 left-8 z-50 mix-blend-difference text-white">
                <Link to="/" className="text-xl font-display font-bold tracking-tighter">
                    BP.
                </Link>
            </div>

            {/* Theme Toggle */}
            <div className="fixed top-8 right-8 z-50 mix-blend-difference">
                <ThemeToggle />
            </div>

            {/* Bottom Floating Dock */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="flex items-center gap-1 p-2 bg-neutral-card/80 backdrop-blur-xl border border-neutral-border rounded-full shadow-2xl"
                >
                    {links.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className="px-6 py-3 rounded-full text-sm font-medium text-text-muted hover:text-text hover:bg-neutral transition-all duration-300"
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link
                        to="/contact"
                        className="ml-2 px-6 py-3 rounded-full bg-text text-surface text-sm font-bold hover:scale-105 transition-transform"
                    >
                        Let's Talk
                    </Link>
                </motion.div>
            </div>
        </>
    );
};

export default Navigation;
