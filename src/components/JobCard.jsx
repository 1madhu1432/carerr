import React from 'react';
import { Link } from 'react-router-dom';
import { useJobs } from '../context/JobsContext';

export default function JobCard({ job }) {
  const { selectRoleAndScroll } = useJobs();
  const tags = [job.location, job.type, job.remote && job.location !== 'Remote' ? 'Remote' : ''].filter(Boolean);
  const meta = job.salary || (job.experience ? `${job.experience}` : '');

  return (
    <details className="job" id={`job-${job.id}`}>
      <summary>
        <div className="job-main">
          <h3 className="job-title">{job.title}</h3>
          <ul className="tags">
            {tags.map((t, idx) => (
              <li key={idx}>{t}</li>
            ))}
          </ul>
        </div>
        <span className="job-pay">{meta}</span>
        <span className="job-toggle" aria-hidden="true"></span>
      </summary>

      <div className="job-body">
        <div
          className="job-desc"
          dangerouslySetInnerHTML={{
            __html: job.descriptionHtml || '<p>Ask us about this role when you apply.</p>'
          }}
        />

        <div className="apply-row">
          {job.applyUrl ? (
            <>
              <a className="btn btn-primary" href={job.applyUrl} target="_blank" rel="noopener noreferrer">
                Apply for this role
              </a>
              <span className="hint">Opens our application form in a new tab.</span>
            </>
          ) : (
            <>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => selectRoleAndScroll(job.id)}
              >
                Apply for this role
              </button>
              <Link
                to={`/jobs/${job.id}`}
                className="hint"
                style={{ textDecoration: 'underline', color: 'var(--link)', cursor: 'pointer' }}
              >
                Open full page
              </Link>
            </>
          )}
        </div>
      </div>
    </details>
  );
}

