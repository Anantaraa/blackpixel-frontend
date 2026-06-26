import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

import ThemeToggle from './ThemeToggle';

const Navigation: React.FC = () => {
    const { pathname } = useLocation();
    if (pathname.startsWith('/me')) return null;

    const links = [
        { name: 'Projects', path: '/#projects' },
        { name: 'Services', path: '/services' },
        { name: 'Studio', path: '/about' },
        { name: 'Contact', path: '/contact' },
    ];

    const isActive = (path: string) => {
        if (path === '/#projects') return pathname === '/';
        return pathname === path || pathname.startsWith(path + '/');
    };

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
                            className={`px-3 py-2 md:px-6 md:py-3 rounded-full text-xs md:text-sm font-medium transition-all duration-300 ${
                                isActive(link.path)
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-text-muted hover:text-text hover:bg-neutral'
                            }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link
                        to="/contact"
                        className="ml-1 md:ml-2 px-4 py-2 md:px-6 md:py-3 rounded-full bg-text text-surface text-xs md:text-sm font-bold whitespace-nowrap hover:bg-primary hover:text-white transition-all duration-300"
                    >
                        Let's Talk
                    </Link>
                </motion.div>
            </div>
        </>
    );
};

export default Navigation;
