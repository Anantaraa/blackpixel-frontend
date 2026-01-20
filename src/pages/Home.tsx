import React from 'react';
import Navigation from '../components/common/Navigation';
import Footer from '../components/common/Footer';
import HeroSection from '../components/home/HeroSection';
import FeaturedProjects from '../components/home/FeaturedProjects';
import ServicesOverview from '../components/home/ServicesOverview';

const Home: React.FC = () => {
    return (
        <div className="min-h-screen bg-neutral flex flex-col">
            <Navigation />

            <main className="flex-grow">
                <HeroSection />
                <ServicesOverview />
                <FeaturedProjects />
            </main>

            <Footer />
        </div>
    );
};

export default Home;
