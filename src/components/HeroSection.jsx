import React from 'react';

export default function HeroSection() {
  return (
    <section className="hero">
      <svg className="ring" viewBox="0 0 400 400" aria-hidden="true">
        <defs>
          <filter id="rough" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="2" seed="7" />
            <feDisplacementMap in="SourceGraphic" scale="16" />
          </filter>
        </defs>
        <g filter="url(#rough)" fill="none" stroke="currentColor" strokeLinecap="round">
          <circle
            className="ring-a"
            cx="200"
            cy="200"
            r="150"
            strokeWidth="10"
            pathLength="100"
            transform="rotate(-80 200 200)"
          />
          <circle
            className="ring-b"
            cx="207"
            cy="194"
            r="136"
            strokeWidth="2.5"
            pathLength="100"
            strokeDasharray="58 42"
            transform="rotate(30 200 200)"
          />
        </g>
      </svg>
      <div className="wrap">
        <h1>Join our team—bring a new vision to customers.</h1>
        <p className="hero-lede">
          We are a growing team shaping the future of retail. Our innovative format sets us apart in the market. Join us as we redefine the coffee experience.
        </p>
        <div className="hero-actions">
          <a className="btn btn-primary" href="#roles">See open roles</a>
        </div>
      </div>
    </section>
  );
}

