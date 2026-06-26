import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Services from './pages/Services';
import Admin from './pages/Admin';
import Login from './pages/Login';
import MeCard from './pages/MeCard';
import ProtectedRoute from './components/common/ProtectedRoute';
import { ThemeProvider } from './context/ThemeContext';
import SiteLoader from './components/common/SiteLoader';
import { useSitePreloader } from './hooks/useSitePreloader';

function AppRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.key}>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route path="/me/:slug" element={<MeCard />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const { progress, ready } = useSitePreloader();

  // Lock scroll while loading so nothing jumps underneath the loader
  useEffect(() => {
    if (!ready) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [ready]);

  useEffect(() => {
    const lenis = new Lenis();
    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <ThemeProvider>
      <SiteLoader progress={progress} visible={!ready} />
      <Router>
        <div className="min-h-screen bg-neutral">
          <AppRoutes />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
