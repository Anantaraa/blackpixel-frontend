import React, { useState } from 'react';
import Navigation from '../components/common/Navigation';
import Footer from '../components/common/Footer';
import { motion } from 'framer-motion';
import { supabase } from '../utils/supabase';
import PageTransition from '../components/common/PageTransition';
import TextReveal from '../components/common/TextReveal';
import { staggerContainer, staggerItem, fadeUp } from '../utils/animations';

interface FormData {
    name: string;
    email: string;
    mobile: string;
    message: string;
}

interface FormErrors {
    name?: string;
    contact?: string;
    email?: string;
    mobile?: string;
    message?: string;
}

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error';

const Contact: React.FC = () => {
    const [form, setForm] = useState<FormData>({ name: '', email: '', mobile: '', message: '' });
    const [errors, setErrors] = useState<FormErrors>({});
    const [status, setStatus] = useState<SubmitStatus>('idle');

    const validate = (): boolean => {
        const next: FormErrors = {};
        if (!form.name.trim()) next.name = 'Name is required.';

        const hasEmail = form.email.trim().length > 0;
        const hasMobile = form.mobile.trim().length > 0;

        if (!hasEmail && !hasMobile) {
            next.contact = 'Please provide at least an email or a mobile number.';
        } else {
            if (hasEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email address.';
            if (hasMobile && !/^\+?[\d\s\-().]{7,15}$/.test(form.mobile)) next.mobile = 'Enter a valid mobile number.';
        }

        if (!form.message.trim()) next.message = 'Please tell us about your project.';

        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        setErrors(prev => {
            const next = { ...prev };
            delete next[name as keyof FormErrors];
            if (name === 'email' || name === 'mobile') delete next.contact;
            return next;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setStatus('loading');
        try {
            const { error } = await supabase.functions.invoke('send-contact-email', {
                body: {
                    name: form.name.trim(),
                    email: form.email.trim(),
                    mobile: form.mobile.trim(),
                    message: form.message.trim(),
                },
            });
            if (error) throw error;
            setStatus('success');
            setForm({ name: '', email: '', mobile: '', message: '' });
        } catch {
            setStatus('error');
        }
    };

    const inputClass = (hasError: boolean) =>
        `w-full bg-neutral border ${hasError ? 'border-red-400' : 'border-neutral-border'} rounded-xl px-6 py-4 text-text placeholder:text-text-muted/40 focus:outline-none focus:border-primary transition-colors`;

    return (
        <PageTransition>
            <div className="min-h-screen bg-neutral flex flex-col">
                <Navigation />

                <main className="flex-grow pt-48 pb-24">
                    <div className="container mx-auto px-6 max-w-5xl">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">

                            {/* Left — copy + contact info */}
                            <div>
                                <h1 className="text-6xl md:text-8xl font-display font-bold text-text mb-8 tracking-tighter leading-[0.9]">
                                    <TextReveal text="Let's" delay={0.1} stagger={0.08} />
                                    <br />
                                    <TextReveal text="Work" delay={0.4} stagger={0.08} />
                                    <br />
                                    <TextReveal text="Together" delay={0.65} stagger={0.06} />
                                </h1>

                                <motion.p
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                                    className="text-xl text-text-muted font-light leading-relaxed max-w-sm"
                                >
                                    We help architects and developers visualize the future. Tell us about your project.
                                </motion.p>

                                <motion.div
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                                    className="mt-16 space-y-6"
                                >
                                    <a href="mailto:studio@blackpixel3d.com" className="block text-2xl text-text hover:text-primary transition-colors duration-200">studio@blackpixel3d.com</a>
                                    <a href="tel:+919106990329" className="block text-2xl text-text hover:text-primary transition-colors duration-200">+91 91069 90329</a>
                                </motion.div>
                            </div>

                            {/* Right — form */}
                            <motion.div
                                className="relative"
                                variants={fadeUp}
                                initial="hidden"
                                animate="visible"
                            >
                                {/* Brand-color glow */}
                                <div className="absolute -inset-4 bg-gradient-to-br from-primary/15 to-primary/5 blur-3xl rounded-full opacity-60 pointer-events-none" />

                                {status === 'success' ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.96 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                        className="relative bg-neutral-card border border-neutral-border p-8 md:p-12 rounded-2xl shadow-2xl flex flex-col items-center justify-center text-center min-h-[420px] space-y-4"
                                    >
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.2, type: 'spring', stiffness: 250, damping: 18 }}
                                            className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-light"
                                        >
                                            ✓
                                        </motion.div>
                                        <h3 className="text-2xl font-display font-bold text-text">Message sent.</h3>
                                        <p className="text-text-muted">We'll get back to you shortly.</p>
                                        <button
                                            onClick={() => setStatus('idle')}
                                            className="mt-4 text-sm text-text-muted hover:text-primary transition-colors underline underline-offset-4"
                                        >
                                            Send another message
                                        </button>
                                    </motion.div>
                                ) : (
                                    <motion.form
                                        onSubmit={handleSubmit}
                                        noValidate
                                        className="relative bg-neutral-card border border-neutral-border p-8 md:p-12 rounded-2xl shadow-2xl"
                                        variants={staggerContainer}
                                        initial="hidden"
                                        animate="visible"
                                    >
                                        {/* Name */}
                                        <motion.div variants={staggerItem} className="space-y-2 mb-6">
                                            <label className="text-sm text-text-muted font-medium ml-2">Your name</label>
                                            <input
                                                name="name"
                                                value={form.name}
                                                onChange={handleChange}
                                                className={inputClass(!!errors.name)}
                                                placeholder="e.g. Rahul Sharma"
                                            />
                                            {errors.name && <p className="text-red-400 text-xs ml-2">{errors.name}</p>}
                                        </motion.div>

                                        {/* Email */}
                                        <motion.div variants={staggerItem} className="space-y-2 mb-6">
                                            <label className="text-sm text-text-muted font-medium ml-2">
                                                Email{' '}
                                                <span className="text-text-muted/50">(email or mobile required)</span>
                                            </label>
                                            <input
                                                name="email"
                                                type="email"
                                                value={form.email}
                                                onChange={handleChange}
                                                className={inputClass(!!errors.email || !!errors.contact)}
                                                placeholder="you@example.com"
                                            />
                                            {errors.email && <p className="text-red-400 text-xs ml-2">{errors.email}</p>}
                                        </motion.div>

                                        {/* Mobile */}
                                        <motion.div variants={staggerItem} className="space-y-2 mb-6">
                                            <label className="text-sm text-text-muted font-medium ml-2">Mobile number</label>
                                            <input
                                                name="mobile"
                                                type="tel"
                                                value={form.mobile}
                                                onChange={handleChange}
                                                className={inputClass(!!errors.mobile || !!errors.contact)}
                                                placeholder="+91 98765 43210"
                                            />
                                            {errors.mobile && <p className="text-red-400 text-xs ml-2">{errors.mobile}</p>}
                                            {errors.contact && <p className="text-red-400 text-xs ml-2">{errors.contact}</p>}
                                        </motion.div>

                                        {/* Message */}
                                        <motion.div variants={staggerItem} className="space-y-2 mb-6">
                                            <label className="text-sm text-text-muted font-medium ml-2">About the project</label>
                                            <textarea
                                                name="message"
                                                rows={4}
                                                value={form.message}
                                                onChange={handleChange}
                                                className={`${inputClass(!!errors.message)} resize-none`}
                                                placeholder="e.g. A residential villa in Surat — we need exterior renders and a walkthrough animation."
                                            />
                                            {errors.message && <p className="text-red-400 text-xs ml-2">{errors.message}</p>}
                                        </motion.div>

                                        {status === 'error' && (
                                            <p className="text-red-400 text-sm text-center mb-4">
                                                Something went wrong. Please try again or email us directly.
                                            </p>
                                        )}

                                        <motion.div variants={staggerItem}>
                                            <motion.button
                                                type="submit"
                                                disabled={status === 'loading'}
                                                className="w-full bg-text text-neutral hover:bg-primary hover:text-white transition-colors rounded-xl py-4 font-bold text-lg disabled:opacity-60 disabled:cursor-not-allowed"
                                                whileHover={{ scale: 1.01 }}
                                                whileTap={{ scale: 0.99 }}
                                                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                                            >
                                                {status === 'loading' ? 'Sending…' : 'Start a project'}
                                            </motion.button>
                                        </motion.div>
                                    </motion.form>
                                )}
                            </motion.div>
                        </div>
                    </div>
                </main>

                <Footer />
            </div>
        </PageTransition>
    );
};

export default Contact;
