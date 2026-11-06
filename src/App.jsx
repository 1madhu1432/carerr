import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import CareersSection from './components/CareersSection';
import JobDetails from './components/JobDetails';
import Footer from './components/Footer';

export default function App() {
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Check for SPA fallback redirect from 404.html
    const redirectPath = sessionStorage.getItem('spa_redirect');
    if (redirectPath) {
      sessionStorage.removeItem('spa_redirect');
      if (redirectPath !== '/' && redirectPath !== '') {
        navigate(redirectPath, { replace: true });
        return;
      }
    }

    // 2. Handle legacy or direct hash-router links like #/jobs/123
    if (window.location.hash && window.location.hash.startsWith('#/')) {
      const target = window.location.hash.slice(1);
      navigate(target, { replace: true });
    }
  }, [navigate]);

  return (
    <>
      <a className="skip" href="#roles">Skip to open roles</a>
      <Navbar />
      <Routes>
        <Route path="/" element={<CareersSection />} />
        <Route path="/roles" element={<CareersSection />} />
        <Route path="/culture" element={<CareersSection />} />
        <Route path="/jobs/:jobId" element={<JobDetails />} />
        <Route path="/roles/:jobId" element={<JobDetails />} />
        <Route path="*" element={<CareersSection />} />
      </Routes>
      <Footer />
    </>
  );
}

