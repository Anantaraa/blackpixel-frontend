import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Instagram, Linkedin, ArrowUpRight } from 'lucide-react';
import { staggerContainer, staggerItem, wordReveal } from '../../utils/animations';

const Footer: React.FC = () => {
    const { pathname } = useLocation();
    if (pathname.startsWith('/me')) return null;

    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-neutral text-text pt-32 pb-8">
            <div className="container mx-auto px-6 md:px-12">

                {/* Monumental CTA — word-by-word reveal from behind the line */}
                <div className="mb-32 flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
                    <div className="max-w-3xl overflow-hidden">
                        <motion.h2
                            className="text-6xl md:text-9xl font-display font-medium tracking-tighter leading-[0.85]"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-60px' }}
                            variants={{
                                hidden: {},
                                visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
                            }}
                        >
                            {/* Line 1 */}
                            <span className="block overflow-hidden">
                                {["Let's", 'build', 'your'].map((word) => (
                                    <motion.span
                                        key={word}
                                        variants={wordReveal}
                                        className="inline-block mr-[0.22em]"
                                    >
                                        {word}
                                    </motion.span>
                                ))}
                            </span>
                            {/* Line 2 */}
                            <span className="block overflow-hidden">
                                {['unbuilt', 'reality.'].map((word) => (
                                    <motion.span
                                        key={word}
                                        variants={wordReveal}
                                        className="inline-block mr-[0.22em] text-text-muted"
                                    >
                                        {word}
                                    </motion.span>
                                ))}
                            </span>
                        </motion.h2>
                    </div>

                    {/* CTA circle — spring scale on hover, amber on hover */}
                    <motion.div
                        whileHover={{ scale: 1.06 }}
                        whileTap={{ scale: 0.96 }}
                        transition={{ type: 'spring', stiffness: 350, damping: 22 }}
                        className="shrink-0"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        <Link
                            to="/contact"
                            className="group flex items-center justify-center w-32 h-32 md:w-48 md:h-48 rounded-full border border-neutral-border bg-text text-surface hover:bg-primary hover:border-primary hover:text-white transition-colors duration-500"
                        >
                            <span className="text-base md:text-lg font-medium">Let's Talk</span>
                        </Link>
                    </motion.div>
                </div>

                {/* Links Grid */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20 border-t border-neutral-border pt-16"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-60px' }}
                >
                    {/* Brand Column */}
                    <motion.div variants={staggerItem} className="space-y-6">
                        <Link to="/" className="text-2xl font-display font-bold tracking-tighter">BP.</Link>
                        <p className="text-text-muted text-sm max-w-xs">
                            Crafting digital atmospheres that blur the line between the imagined and the real.
                        </p>
                    </motion.div>

                    {/* Sitemap */}
                    <motion.div variants={staggerItem}>
                        <h3 className="text-sm font-mono text-text-muted mb-6 uppercase tracking-wider">Sitemap</h3>
                        <ul className="space-y-4">
                            <li><Link to="/#projects" className="block text-lg hover:text-primary transition-colors duration-200">Projects</Link></li>
                            <li><Link to="/services" className="block text-lg hover:text-primary transition-colors duration-200">Services</Link></li>
                            <li><Link to="/about" className="block text-lg hover:text-primary transition-colors duration-200">Studio</Link></li>
                            <li><Link to="/contact" className="block text-lg hover:text-primary transition-colors duration-200">Contact</Link></li>
                        </ul>
                    </motion.div>

                    {/* Socials */}
                    <motion.div variants={staggerItem}>
                        <h3 className="text-sm font-mono text-text-muted mb-6 uppercase tracking-wider">Socials</h3>
                        <ul className="space-y-4">
                            <li>
                                <a href="https://www.instagram.com/blackpixel_3d" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 group hover:text-primary transition-colors duration-200">
                                    <Instagram size={20} />
                                    <span>Instagram</span>
                                    <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                </a>
                            </li>
                            <li>
                                <a href="https://www.linkedin.com/in/jenulvachhani-blackpixel3d" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 group hover:text-primary transition-colors duration-200">
                                    <Linkedin size={20} />
                                    <span>LinkedIn</span>
                                    <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                </a>
                            </li>
                        </ul>
                    </motion.div>

                    {/* Contact Info */}
                    <motion.div variants={staggerItem}>
                        <h3 className="text-sm font-mono text-text-muted mb-6 uppercase tracking-wider">Contact</h3>
                        <div className="space-y-4">
                            <a href="mailto:studio@blackpixel3d.com" className="block text-2xl font-light hover:text-primary transition-colors duration-200">
                                studio@blackpixel3d.com
                            </a>
                            <p className="text-text-muted">
                                Surat Digital Valley,<br />
                                Mota Varachha, Surat, Gujarat, 394101
                            </p>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-neutral-border text-sm text-text-muted">
                    <p>© {currentYear} BlackPixel Studio.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
