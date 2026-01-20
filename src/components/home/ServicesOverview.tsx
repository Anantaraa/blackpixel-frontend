import React from 'react';
import { SERVICES } from '../../data/mockData';

const ServicesOverview: React.FC = () => {
    return (
        <section className="py-32 bg-secondary text-white">
            <div className="container mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    <div>
                        <h2 className="text-6xl md:text-8xl font-black font-display uppercase leading-[0.85] tracking-tighter mb-12 text-primary">
                            Our <br />Expertise
                        </h2>
                    </div>

                    <div className="space-y-16">
                        {SERVICES.map((service, index) => (
                            <div key={index} className="group border-t border-white/20 pt-8 hover:border-primary transition-colors duration-500">
                                <div className="flex items-baseline justify-between mb-4">
                                    <h3 className="text-3xl font-bold font-display uppercase group-hover:text-primary transition-colors">{service.title}</h3>
                                    <span className="font-mono text-sm opacity-50">0{index + 1}</span>
                                </div>
                                <p className="text-gray-400 max-w-md group-hover:text-white transition-colors">{service.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ServicesOverview;
