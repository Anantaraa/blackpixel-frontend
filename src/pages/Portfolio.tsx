import React, { useState, useMemo } from 'react';
import Navigation from '../components/common/Navigation';
import Footer from '../components/common/Footer';
import FilterBar from '../components/portfolio/FilterBar';
import SearchBar from '../components/portfolio/SearchBar';
import ProjectGrid from '../components/portfolio/ProjectGrid';
import { PROJECTS } from '../data/mockData';

const CATEGORIES = ['Residential', 'Commercial', 'Cultural', 'Landscape'];

const Portfolio: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredProjects = useMemo(() => {
        return PROJECTS.filter(project => {
            const matchesCategory = activeCategory === 'All' || project.category === activeCategory;
            const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                project.location.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [activeCategory, searchQuery]);

    return (
        <div className="min-h-screen bg-neutral flex flex-col">
            <Navigation />

            <main className="flex-grow pt-32 pb-24">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold font-heading text-secondary mb-4">Portfolio</h1>
                            <p className="text-gray-500 max-w-xl">
                                Explore a curated selection of our work, ranging from intimate residential spaces to large-scale cultural landmarks.
                            </p>
                        </div>

                        <div className="w-full md:w-auto flex flex-col gap-6">
                            <SearchBar
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full md:w-80"
                            />
                        </div>
                    </div>

                    <div className="mb-12">
                        <FilterBar
                            categories={CATEGORIES}
                            activeCategory={activeCategory}
                            onCategoryChange={setActiveCategory}
                        />
                    </div>

                    <ProjectGrid projects={filteredProjects} />
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Portfolio;
