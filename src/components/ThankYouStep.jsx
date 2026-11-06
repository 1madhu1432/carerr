import React from 'react';
import { Link } from 'react-router-dom';

export default function ThankYouStep({ candidateName, candidateId, roleName, isMock }) {
  return (
    <div
      className="thankyou-card"
      style={{
        maxWidth: '38rem',
        margin: '2rem auto',
        padding: '3rem 2rem',
        background: 'var(--surface)',
        border: '1px solid var(--line)',
        borderRadius: '20px',
        textAlign: 'center',
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.08)'
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'var(--btn)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem',
          fontSize: '1.75rem'
        }}
      >
        ✓
      </div>

      <h1
        style={{
          fontFamily: '"Gloock", Georgia, serif',
          fontSize: 'clamp(2.5rem, 6vw, 3.5rem)',
          lineHeight: 1.05,
          margin: '0 0 0.75rem',
          color: 'var(--ink)'
        }}
      >
        Thank You
      </h1>

      <p
        style={{
          fontSize: '1.25rem',
          fontWeight: 600,
          color: 'var(--btn)',
          margin: '0 0 1.5rem',
          letterSpacing: '-0.01em'
        }}
      >
        We will get back to you
      </p>

      <div
        style={{
          background: 'var(--paper)',
          border: '1px solid var(--line)',
          borderRadius: '12px',
          padding: '1.25rem',
          maxWidth: '28rem',
          margin: '0 auto 2rem',
          fontSize: '0.9375rem',
          color: 'var(--muted)',
          lineHeight: 1.6
        }}
      >
        {candidateName && (
          <p style={{ margin: '0 0 0.25rem', fontWeight: 600, color: 'var(--ink)' }}>
            Applicant: {candidateName}
          </p>
        )}
        <p style={{ margin: '0 0 0.25rem' }}>
          Role: <strong style={{ color: 'var(--ink)' }}>{roleName || 'General Application'}</strong>
        </p>
        {candidateId && (
          <p style={{ margin: '0', fontSize: '0.8125rem' }}>
            Reference ID: <code>#{candidateId}</code>
          </p>
        )}
      </div>

      <p style={{ color: 'var(--muted)', fontSize: '0.9375rem', maxWidth: '30rem', margin: '0 auto 2rem' }}>
        Our recruitment team reviews every application carefully. If your background aligns with our requirements, we’ll reach out directly via email or phone.
      </p>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to="/" className="btn btn-primary" style={{ minWidth: '180px' }}>
          Browse open roles
        </Link>
      </div>
    </div>
  );
}

