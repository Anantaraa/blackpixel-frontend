import React from 'react';
import Navigation from '../components/common/Navigation';
import Footer from '../components/common/Footer';
import HeroSection from '../components/home/HeroSection';
import FeaturedProjects from '../components/home/FeaturedProjects';
import ServicesOverview from '../components/home/ServicesOverview';
import PageTransition from '../components/common/PageTransition';

const Home: React.FC = () => {
    return (
        <PageTransition>
            <div className="min-h-screen bg-neutral flex flex-col">
                <Navigation />
                <main className="flex-grow">
                    <HeroSection />
                    <FeaturedProjects />
                    <ServicesOverview />
                </main>
                <Footer />
            </div>
        </PageTransition>
    );
};

export default Home;
