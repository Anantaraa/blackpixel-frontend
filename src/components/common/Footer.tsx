import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Linkedin, Twitter, Mail, MapPin, Phone } from 'lucide-react';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-secondary text-white pt-16 pb-8">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link to="/" className="text-2xl font-heading font-bold">BLACKPIXEL</Link>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Crafting immersive architectural visualizations that bring unbuilt realities to life. Precision, artistry, and innovation in every pixel.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold mb-6">Explore</h3>
                        <ul className="space-y-3 text-gray-400">
                            <li><Link to="/projects" className="hover:text-primary transition-colors">Portfolio</Link></li>
                            <li><Link to="/services" className="hover:text-primary transition-colors">Services</Link></li>
                            <li><Link to="/about" className="hover:text-primary transition-colors">Studio</Link></li>
                            <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-lg font-bold mb-6">Connect</h3>
                        <ul className="space-y-4 text-gray-400">
                            <li className="flex items-start space-x-3">
                                <MapPin size={20} className="shrink-0 mt-1" />
                                <span>123 Architecture Ave,<br />Design District, NY 10001</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <EmailLink email="hello@blackpixel.com" />
                            </li>
                            <li className="flex items-center space-x-3">
                                <PhoneLink phone="+1 (555) 123-4567" />
                            </li>
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h3 className="text-lg font-bold mb-6">Follow Us</h3>
                        <div className="flex space-x-4">
                            <SocialLink href="#" icon={<Instagram size={20} />} />
                            <SocialLink href="#" icon={<Twitter size={20} />} />
                            <SocialLink href="#" icon={<Linkedin size={20} />} />
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                    <p>© {currentYear} BlackPixel Studio. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

const SocialLink = ({ href, icon }: { href: string; icon: React.ReactNode }) => (
    <a
        href={href}
        className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
        target="_blank"
        rel="noopener noreferrer"
    >
        {icon}
    </a>
);

const EmailLink = ({ email }: { email: string }) => (
    <>
        <Mail size={20} className="shrink-0" />
        <a href={`mailto:${email}`} className="hover:text-primary transition-colors">{email}</a>
    </>
)

const PhoneLink = ({ phone }: { phone: string }) => (
    <>
        <Phone size={20} className="shrink-0" />
        <a href={`tel:${phone}`} className="hover:text-primary transition-colors">{phone}</a>
    </>
)


export default Footer;
