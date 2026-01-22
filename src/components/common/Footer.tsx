import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Linkedin, Twitter, ArrowUpRight } from 'lucide-react';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-neutral text-white pt-32 pb-8">
            <div className="container mx-auto px-6 md:px-12">

                {/* Large CTA Section */}
                <div className="mb-32 flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
                    <div className="max-w-3xl">
                        <h2 className="text-6xl md:text-9xl font-display font-medium tracking-tighter leading-[0.8]">
                            Let's build your <br />
                            <span className="text-text-muted">unbuilt reality.</span>
                        </h2>
                    </div>
                    <Link
                        to="/contact"
                        className="group flex items-center justify-center w-32 h-32 md:w-48 md:h-48 rounded-full border border-white/20 hover:bg-white hover:text-black hover:border-white transition-all duration-500"
                    >
                        <span className="text-lg font-medium">Let's Talk</span>
                    </Link>
                </div>

                {/* Links Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20 border-t border-white/10 pt-16">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <Link to="/" className="text-2xl font-display font-bold tracking-tighter">BP.</Link>
                        <p className="text-text-muted text-sm max-w-xs">
                            Crafting digital atmospheres that blur the line between the imagined and the real.
                        </p>
                    </div>

                    {/* Sitemap */}
                    <div>
                        <h3 className="text-sm font-mono text-text-muted mb-6 uppercase tracking-wider">Sitemap</h3>
                        <ul className="space-y-4">
                            <li><Link to="/projects" className="block text-lg hover:text-primary transition-colors">Projects</Link></li>
                            <li><Link to="/services" className="block text-lg hover:text-primary transition-colors">Services</Link></li>
                            <li><Link to="/about" className="block text-lg hover:text-primary transition-colors">Studio</Link></li>
                            <li><Link to="/contact" className="block text-lg hover:text-primary transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Socials */}
                    <div>
                        <h3 className="text-sm font-mono text-text-muted mb-6 uppercase tracking-wider">Socials</h3>
                        <ul className="space-y-4">
                            <li>
                                <a href="#" className="flex items-center gap-2 group hover:text-primary transition-colors">
                                    <Instagram size={20} />
                                    <span>Instagram</span>
                                    <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                </a>
                            </li>
                            <li>
                                <a href="#" className="flex items-center gap-2 group hover:text-primary transition-colors">
                                    <Twitter size={20} />
                                    <span>Twitter</span>
                                    <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                </a>
                            </li>
                            <li>
                                <a href="#" className="flex items-center gap-2 group hover:text-primary transition-colors">
                                    <Linkedin size={20} />
                                    <span>LinkedIn</span>
                                    <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-sm font-mono text-text-muted mb-6 uppercase tracking-wider">Contact</h3>
                        <div className="space-y-4">
                            <a href="mailto:hello@blackpixel.com" className="block text-2xl font-light hover:text-primary transition-colors">
                                hello@blackpixel.com
                            </a>
                            <p className="text-text-muted">
                                123 Architecture Ave,<br />
                                Design District, NY 10001
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10 text-sm text-text-muted">
                    <p>© {currentYear} BlackPixel Studio.</p>
                    <div className="flex gap-8 mt-4 md:mt-0">
                        <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
