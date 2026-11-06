import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import HeroSection from './HeroSection';
import JobListings from './JobListings';
import CompanyCulture from './CompanyCulture';
import HiringProcess from './HiringProcess';
import ApplicationForm from './ApplicationForm';
import FaqSection from './FaqSection';

export default function CareersSection() {
  const location = useLocation();

  // Support hash anchor smooth scrolling with React Router
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 80);
      }
    }
  }, [location]);

  return (
    <main id="top">
      <HeroSection />
      <JobListings />
      <CompanyCulture />
      <HiringProcess />
      <ApplicationForm />
      <FaqSection />
    </main>
  );
}

