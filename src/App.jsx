import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import CareersSection from './components/CareersSection';
import JobDetails from './components/JobDetails';
import Footer from './components/Footer';

export default function App() {
  return (
    <>
      <a className="skip" href="#roles">Skip to open roles</a>
      <Navbar />
      <Routes>
        <Route path="/" element={<CareersSection />} />
        <Route path="/jobs/:jobId" element={<JobDetails />} />
        <Route path="/roles/:jobId" element={<JobDetails />} />
      </Routes>
      <Footer />
    </>
  );
}

