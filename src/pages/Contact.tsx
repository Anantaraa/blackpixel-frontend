import React, { useState } from 'react';
import Navigation from '../components/common/Navigation';
import Footer from '../components/common/Footer';
import { supabase } from '../utils/supabase';

interface FormData {
    name: string;
    email: string;
    mobile: string;
    message: string;
}

interface FormErrors {
    name?: string;
    contact?: string; // shared error: email OR mobile required
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

        if (!form.name.trim()) {
            next.name = 'Name is required.';
        }

        const hasEmail = form.email.trim().length > 0;
        const hasMobile = form.mobile.trim().length > 0;

        if (!hasEmail && !hasMobile) {
            next.contact = 'Please provide at least an email or a mobile number.';
        } else {
            if (hasEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
                next.email = 'Enter a valid email address.';
            }
            if (hasMobile && !/^\+?[\d\s\-().]{7,15}$/.test(form.mobile)) {
                next.mobile = 'Enter a valid mobile number.';
            }
        }

        if (!form.message.trim()) {
            next.message = 'Please tell us about your project.';
        }

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
        `w-full bg-neutral border ${hasError ? 'border-red-400' : 'border-neutral-border'} rounded-xl px-6 py-4 text-text placeholder:text-text-muted/50 focus:outline-none focus:border-primary transition-colors`;

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
                                <a href="mailto:studio@blackpixel3d.com" className="block text-2xl text-text hover:text-primary transition-colors">studio@blackpixel3d.com</a>
                                <a href="tel:+919106990329" className="block text-2xl text-text hover:text-primary transition-colors">+91 91069 90329</a>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-purple-500/20 blur-3xl rounded-full opacity-50" />

                            {status === 'success' ? (
                                <div className="relative bg-neutral-card border border-neutral-border p-8 md:p-12 rounded-3xl shadow-2xl flex flex-col items-center justify-center text-center min-h-[420px] space-y-4">
                                    <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 text-3xl">✓</div>
                                    <h3 className="text-2xl font-display font-bold text-text">Inquiry Sent!</h3>
                                    <p className="text-text-muted">We'll get back to you shortly.</p>
                                    <button
                                        onClick={() => setStatus('idle')}
                                        className="mt-4 text-sm text-text-muted hover:text-text transition-colors underline underline-offset-4"
                                    >
                                        Send another inquiry
                                    </button>
                                </div>
                            ) : (
                                <form
                                    onSubmit={handleSubmit}
                                    noValidate
                                    className="relative bg-neutral-card border border-neutral-border p-8 md:p-12 rounded-3xl space-y-6 shadow-2xl"
                                >
                                    {/* Name */}
                                    <div className="space-y-2">
                                        <label className="text-sm text-text-muted font-medium ml-2">What's your name?</label>
                                        <input
                                            name="name"
                                            value={form.name}
                                            onChange={handleChange}
                                            className={inputClass(!!errors.name)}
                                            placeholder="John Doe"
                                        />
                                        {errors.name && <p className="text-red-400 text-xs ml-2">{errors.name}</p>}
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-2">
                                        <label className="text-sm text-text-muted font-medium ml-2">
                                            Your email?{' '}
                                            <span className="text-text-muted/50">(email or mobile required)</span>
                                        </label>
                                        <input
                                            name="email"
                                            type="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            className={inputClass(!!errors.email || !!errors.contact)}
                                            placeholder="john@example.com"
                                        />
                                        {errors.email && <p className="text-red-400 text-xs ml-2">{errors.email}</p>}
                                    </div>

                                    {/* Mobile */}
                                    <div className="space-y-2">
                                        <label className="text-sm text-text-muted font-medium ml-2">Your mobile number?</label>
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
                                    </div>

                                    {/* Message */}
                                    <div className="space-y-2">
                                        <label className="text-sm text-text-muted font-medium ml-2">Tell us about the project</label>
                                        <textarea
                                            name="message"
                                            rows={4}
                                            value={form.message}
                                            onChange={handleChange}
                                            className={`${inputClass(!!errors.message)} resize-none`}
                                            placeholder="We need..."
                                        />
                                        {errors.message && <p className="text-red-400 text-xs ml-2">{errors.message}</p>}
                                    </div>

                                    {status === 'error' && (
                                        <p className="text-red-400 text-sm text-center">
                                            Something went wrong. Please try again or email us directly.
                                        </p>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={status === 'loading'}
                                        className="w-full bg-text text-neutral hover:bg-primary hover:text-white transition-colors rounded-xl py-4 font-bold text-lg disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        {status === 'loading' ? 'Sending…' : 'Send Inquiry'}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Contact;
