import React from 'react';

export default function ApplicationSuccess({ candidateId, isMock, roleName, candidateName, onReset }) {
  return (
    <div className="success">
      <h3 id="success-title" tabIndex="-1">
        Application received, {candidateName}!
      </h3>
      <p>
        Thank you for applying {roleName ? `for the ${roleName} role` : 'to Sélon Coffee'}. 
        We have received your application in our recruitment portal.
      </p>

      <div style={{
        padding: '16px',
        borderRadius: '12px',
        background: 'var(--surface)',
        border: '1px solid var(--line)',
        width: '100%',
        display: 'grid',
        gap: '6px',
        fontSize: '0.95rem'
      }}>
        {candidateId && (
          <div>
            <strong>Application Reference:</strong> <code>{candidateId}</code>
          </div>
        )}
        <div>
          <strong>Status:</strong> Under Review by Café Management
        </div>
        <div>
          <strong>Response Time:</strong> Within 5 working days
        </div>
      </div>

      <p>
        Our team will review your shift availability and qualifications. If there’s a match, we’ll reach out for a 15-minute introductory call.
      </p>

      <div className="success-actions">
        <button className="btn btn-ghost" type="button" onClick={onReset}>
          Start a new application
        </button>
        <a className="btn btn-primary" href="#roles">
          Explore more roles
        </a>
      </div>
    </div>
  );
}

