import React from 'react';
import Navigation from '../components/common/Navigation';
import Footer from '../components/common/Footer';


const Contact: React.FC = () => {
    // ... logic ...

    return (
        <div className="min-h-screen bg-neutral flex flex-col">
            <Navigation />

            <main className="flex-grow pt-48 pb-24">
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
                        <div>
                            <h1 className="text-6xl md:text-8xl font-display font-bold text-text mb-8 tracking-tighter">
                                Let's<br />Work<br />Together
                            </h1>
                            <p className="text-xl text-text-muted font-light leading-relaxed max-w-sm">
                                We help architects and developers visualize the future. Tell us about your project.
                            </p>

                            <div className="mt-16 space-y-6">
                                <a href="mailto:hello@blackpixel.com" className="block text-2xl text-text hover:text-primary transition-colors">hello@blackpixel.com</a>
                                <a href="tel:+15551234567" className="block text-2xl text-text hover:text-primary transition-colors">+1 (555) 123 4567</a>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-purple-500/20 blur-3xl rounded-full opacity-50" />
                            <form className="relative bg-neutral-card border border-neutral-border p-8 md:p-12 rounded-3xl space-y-8 shadow-2xl">
                                <div className="space-y-2">
                                    <label className="text-sm text-text-muted font-medium ml-2">What's your name?</label>
                                    <input className="w-full bg-neutral border border-neutral-border rounded-xl px-6 py-4 text-text placeholder:text-text-muted/50 focus:outline-none focus:border-primary transition-colors" placeholder="John Doe" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-text-muted font-medium ml-2">Your email?</label>
                                    <input className="w-full bg-neutral border border-neutral-border rounded-xl px-6 py-4 text-text placeholder:text-text-muted/50 focus:outline-none focus:border-primary transition-colors" placeholder="john@example.com" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-text-muted font-medium ml-2">Tell us about the project</label>
                                    <textarea rows={4} className="w-full bg-neutral border border-neutral-border rounded-xl px-6 py-4 text-text placeholder:text-text-muted/50 focus:outline-none focus:border-primary transition-colors resize-none" placeholder="We need..."></textarea>
                                </div>

                                <button className="w-full bg-text text-neutral hover:bg-primary hover:text-white transition-colors rounded-xl py-4 font-bold text-lg">
                                    Send Inquiry
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Contact;
