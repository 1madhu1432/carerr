import React from 'react';
import { Link } from 'react-router-dom';

export default function JobCard({ job }) {
  const tags = [job.location, job.type, job.remote ? 'Remote' : ''].filter(Boolean);
  const meta = job.salary || (job.experience ? `${job.experience}` : '');

  return (
    <div
      className="role-wireframe-card"
      id={`job-${job.id}`}
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--line)',
        borderRadius: '16px',
        padding: '1.75rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '1.25rem',
        transition: 'transform 0.15s ease, border-color 0.15s ease'
      }}
    >
      <div>
        <h3
          style={{
            fontFamily: '"Gloock", Georgia, serif',
            fontSize: '1.5rem',
            margin: '0 0 0.5rem',
            color: 'var(--ink)'
          }}
        >
          {job.title}
        </h3>

        {tags.length > 0 && (
          <ul className="tags" style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', listStyle: 'none', padding: 0, margin: '0 0 0.75rem' }}>
            {tags.map((t, idx) => (
              <li
                key={idx}
                style={{
                  padding: '3px 10px',
                  borderRadius: '999px',
                  background: 'var(--tag-bg)',
                  fontSize: '0.8125rem',
                  fontWeight: 500
                }}
              >
                {t}
              </li>
            ))}
          </ul>
        )}

        {meta && (
          <p style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 600, color: 'var(--ink)' }}>
            {meta}
          </p>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid var(--line)' }}>
        <Link
          to={`/jobs/${job.id}`}
          className="btn btn-primary"
          style={{
            padding: '10px 20px',
            fontSize: '0.9375rem',
            fontWeight: 600,
            textDecoration: 'none'
          }}
        >
          Apply Now
        </Link>

        <Link
          to={`/jobs/${job.id}`}
          style={{
            fontSize: '0.875rem',
            color: 'var(--muted)',
            textDecoration: 'underline'
          }}
        >
          View details
        </Link>
      </div>
    </div>
  );
}
