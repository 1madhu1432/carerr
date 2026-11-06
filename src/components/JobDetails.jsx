import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useJobs } from '../context/JobsContext';
import { apiUrl } from '../config/api';
import ApplicationForm from './ApplicationForm';

export default function JobDetails() {
  const { jobId } = useParams();
  const { selectRoleAndScroll } = useJobs();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    async function loadJob() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(apiUrl(`/api/jobs/${jobId}`));
        if (!res.ok) throw new Error(`Role ${jobId} not found`);
        const data = await res.json();
        setJob(data.job);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadJob();
  }, [jobId]);

  const handleApplyNow = () => {
    selectRoleAndScroll(jobId);
  };

  if (loading) {
    return (
      <main className="section" style={{ minHeight: '60vh' }}>
        <div className="wrap">
          <p style={{ color: 'var(--muted)' }}>Loading role details…</p>
        </div>
      </main>
    );
  }

  if (error || !job) {
    return (
      <main className="section" style={{ minHeight: '60vh' }}>
        <div className="wrap">
          <div className="section-head">
            <h2>Role Not Found</h2>
            <p>The role you are looking for may have been filled or expired.</p>
            <div>
              <Link to="/" className="btn btn-primary btn-sm">Back to all open roles</Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const tags = [job.location, job.type, job.remote && job.location !== 'Remote' ? 'Remote' : ''].filter(Boolean);
  const meta = job.salary || (job.experience ? `${job.experience}` : '');

  return (
    <>
      <main className="section" style={{ minHeight: '60vh', paddingTop: '40px' }}>
        <div className="wrap">
          <div style={{ marginBottom: '24px' }}>
            <Link to="/#roles" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--link)', fontWeight: 600 }}>
              ← Back to all roles
            </Link>
          </div>

          <div className="section-head" style={{ maxWidth: '48rem' }}>
            <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', lineHeight: 1.05 }}>{job.title}</h1>
            <ul className="tags" style={{ marginTop: '0.8rem' }}>
              {tags.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
            {meta && <p style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--ink)' }}>{meta}</p>}
          </div>

          <div style={{ maxWidth: '64ch', margin: '2rem 0', display: 'grid', gap: '1.5rem' }}>
            <div
              className="job-desc"
              style={{ fontSize: '1.0625rem', color: 'var(--ink)' }}
              dangerouslySetInnerHTML={{
                __html: job.descriptionHtml || '<p>Ask us about this role when you apply.</p>'
              }}
            />

            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <button type="button" className="btn btn-primary" onClick={handleApplyNow}>
                Apply for this role
              </button>
              <Link to="/#roles" className="btn btn-ghost">Browse other roles</Link>
            </div>
          </div>
        </div>
      </main>

      {/* Embedded application form for seamless one-click applying */}
      <ApplicationForm initialRoleId={jobId} />
    </>
  );
}

