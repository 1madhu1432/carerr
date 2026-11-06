import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiUrl } from '../config/api';
import { getAssessmentForJob } from '../config/assessments';
import AssessmentStep from './AssessmentStep';
import ThankYouStep from './ThankYouStep';

export default function JobDetails() {
  const { jobId } = useParams();
  const fileInputRef = useRef(null);

  // Job data state
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Flow stage: 'apply' (Screen 2) -> 'assessment' (Screen 3) -> 'thankyou' (Screen 4)
  const [stage, setStage] = useState('apply');

  // Candidate submission state
  const [candidateId, setCandidateId] = useState(null);
  const [candidateName, setCandidateName] = useState('');
  const [assessmentConfig, setAssessmentConfig] = useState(null);

  // Form inputs
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    start: 'Right away',
    resumeUrl: '',
    about: ''
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Fetch job opening details
  useEffect(() => {
    window.scrollTo(0, 0);
    async function loadJob() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(apiUrl(`/api/jobs/${jobId}`));
        if (!res.ok) throw new Error(`Role not found`);
        const data = await res.json();
        setJob(data.job);
        setAssessmentConfig(getAssessmentForJob(data.job));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadJob();
  }, [jobId]);

  const handleInputChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, resume: 'File exceeds 5MB limit. Please choose a smaller file.' }));
      return;
    }

    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    const isDoc = validTypes.includes(file.type) || /\.(pdf|doc|docx)$/i.test(file.name);

    if (!isDoc) {
      setErrors((prev) => ({ ...prev, resume: 'Please upload a PDF, DOC, or DOCX document.' }));
      return;
    }

    setResumeFile(file);
    setErrors((prev) => ({ ...prev, resume: '' }));
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required.';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please provide a valid email address.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Handle Screen 2 Form Submission
  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const body = new FormData();
      body.append('name', formData.name.trim());
      body.append('email', formData.email.trim());
      body.append('phone', formData.phone.trim());
      body.append('roleId', jobId);
      body.append('start', formData.start);
      body.append('resumeUrl', formData.resumeUrl.trim());
      body.append('about', formData.about.trim());

      if (resumeFile) {
        body.append('resumeFile', resumeFile);
      }

      const res = await fetch(apiUrl('/api/applications'), {
        method: 'POST',
        body
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Submission failed.');
      }

      const createdId = data.candidateId;
      setCandidateId(createdId);
      setCandidateName(formData.name.trim());

      // Wireframe Routing Logic:
      // "Routed to the test only if available in linked Zoho Recruit (jobid), if not directly thank you page"
      const assessment = assessmentConfig || getAssessmentForJob(job);
      if (assessment && assessment.questions && assessment.questions.length > 0) {
        setStage('assessment'); // Screen 3
      } else {
        setStage('thankyou');   // Screen 4
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setSubmitError(err.message || 'Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Screen 3 Assessment Submission
  const handleAssessmentSubmit = async (answers) => {
    setIsSubmitting(true);
    setSubmitError('');

    try {
      if (candidateId) {
        await fetch(apiUrl(`/api/applications/${candidateId}/assessment`), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answers })
        });
      }
      // Move to Screen 4 (Thank You)
      setStage('thankyou');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      // Even if the assessment note call encounters an issue, proceed gracefully to Thank You
      console.warn('[Assessment] Note save notice:', err.message);
      setStage('thankyou');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="section" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--muted)', fontSize: '1.125rem' }}>Loading position details…</p>
      </main>
    );
  }

  if (error || !job) {
    return (
      <main className="section" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ marginBottom: '0.5rem' }}>Role Not Found</h2>
          <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>The role you are looking for may have been filled or expired.</p>
          <Link to="/" className="btn btn-primary btn-sm">Back to all roles</Link>
        </div>
      </main>
    );
  }

  const tags = [job.location, job.type, job.remote ? 'Remote' : ''].filter(Boolean);
  const meta = job.salary || (job.experience ? `${job.experience}` : '');

  return (
    <main className="section" style={{ minHeight: '75vh', paddingTop: '32px' }}>
      <div className="wrap">
        {/* Navigation Breadcrumb */}
        <div style={{ marginBottom: '24px' }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--link)',
              fontWeight: 600,
              fontSize: '0.9375rem',
              textDecoration: 'none'
            }}
          >
            ← Back to all open roles
          </Link>
        </div>

        {/* SCREEN 4: Thank You Step */}
        {stage === 'thankyou' && (
          <ThankYouStep
            candidateName={candidateName}
            candidateId={candidateId}
            roleName={job.title}
          />
        )}

        {/* SCREEN 3: Assessment Step */}
        {stage === 'assessment' && (
          <AssessmentStep
            job={job}
            assessment={assessmentConfig}
            candidateName={candidateName}
            onSubmit={handleAssessmentSubmit}
            isSubmitting={isSubmitting}
            error={submitError}
          />
        )}

        {/* SCREEN 2: Job Description (Left) + Application Form (Right) */}
        {stage === 'apply' && (
          <div>
            {/* Role Header Banner */}
            <div style={{ marginBottom: '2.5rem' }}>
              <h1
                style={{
                  fontFamily: '"Gloock", Georgia, serif',
                  fontSize: 'clamp(2.5rem, 5vw, 3.75rem)',
                  lineHeight: 1.05,
                  margin: '0 0 0.75rem'
                }}
              >
                {job.title}
              </h1>
              <ul className="tags" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', listStyle: 'none', padding: 0, margin: '0 0 0.5rem' }}>
                {tags.map((t, i) => (
                  <li
                    key={i}
                    style={{
                      padding: '4px 12px',
                      borderRadius: '999px',
                      background: 'var(--tag-bg)',
                      fontSize: '0.875rem',
                      fontWeight: 500
                    }}
                  >
                    {t}
                  </li>
                ))}
              </ul>
              {meta && (
                <p style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--ink)', margin: 0 }}>
                  {meta}
                </p>
              )}
            </div>

            {/* Two-Column Side-by-Side Grid */}
            <div
              className="role-side-by-side-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '2.5rem',
                alignItems: 'start'
              }}
            >
              {/* LEFT COLUMN: Job Description */}
              <div
                className="job-description-panel"
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--line)',
                  borderRadius: '16px',
                  padding: '2rem'
                }}
              >
                <h3
                  style={{
                    fontFamily: '"Gloock", Georgia, serif',
                    fontSize: '1.75rem',
                    margin: '0 0 1.25rem',
                    paddingBottom: '0.75rem',
                    borderBottom: '1px solid var(--line)'
                  }}
                >
                  Job Description
                </h3>

                <div
                  className="job-desc"
                  style={{
                    fontSize: '1rem',
                    lineHeight: 1.7,
                    color: 'var(--ink)'
                  }}
                  dangerouslySetInnerHTML={{
                    __html: job.descriptionHtml || '<p>Ask us about this role when you apply.</p>'
                  }}
                />
              </div>

              {/* RIGHT COLUMN: Application Form */}
              <div
                className="job-application-panel"
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--line)',
                  borderRadius: '16px',
                  padding: '2rem',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.04)'
                }}
              >
                <div style={{ marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--line)' }}>
                  <h3
                    style={{
                      fontFamily: '"Gloock", Georgia, serif',
                      fontSize: '1.75rem',
                      margin: '0 0 0.25rem'
                    }}
                  >
                    Application Form
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.9375rem', color: 'var(--muted)' }}>
                    Applying for: <strong style={{ color: 'var(--ink)' }}>{job.title}</strong>
                  </p>
                </div>

                <form onSubmit={handleApplySubmit} noValidate>
                  <div style={{ display: 'grid', gap: '1.125rem' }}>
                    {/* Full Name */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px' }}>
                        Full name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="e.g. Jane Doe"
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          borderRadius: '8px',
                          border: errors.name ? '1px solid var(--error)' : '1px solid var(--line)',
                          background: 'var(--paper)',
                          color: 'var(--ink)',
                          fontSize: '0.9375rem'
                        }}
                      />
                      {errors.name && <span style={{ color: 'var(--error)', fontSize: '0.8125rem' }}>{errors.name}</span>}
                    </div>

                    {/* Email */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px' }}>
                        Email address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="jane@example.com"
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          borderRadius: '8px',
                          border: errors.email ? '1px solid var(--error)' : '1px solid var(--line)',
                          background: 'var(--paper)',
                          color: 'var(--ink)',
                          fontSize: '0.9375rem'
                        }}
                      />
                      {errors.email && <span style={{ color: 'var(--error)', fontSize: '0.8125rem' }}>{errors.email}</span>}
                    </div>

                    {/* Phone */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px' }}>
                        Phone <span style={{ color: 'var(--muted)', fontWeight: 400 }}>(optional)</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+91 98765 43210"
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          borderRadius: '8px',
                          border: '1px solid var(--line)',
                          background: 'var(--paper)',
                          color: 'var(--ink)',
                          fontSize: '0.9375rem'
                        }}
                      />
                    </div>

                    {/* Start Date */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px' }}>
                        When could you start?
                      </label>
                      <select
                        name="start"
                        value={formData.start}
                        onChange={(e) => handleInputChange('start', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          borderRadius: '8px',
                          border: '1px solid var(--line)',
                          background: 'var(--paper)',
                          color: 'var(--ink)',
                          fontSize: '0.9375rem'
                        }}
                      >
                        <option value="Right away">Right away</option>
                        <option value="In 1 week">In 1 week</option>
                        <option value="In 2 weeks">In 2 weeks</option>
                        <option value="In a month">In a month</option>
                      </select>
                    </div>

                    {/* Resume Upload */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px' }}>
                        Upload Resume <span style={{ color: 'var(--muted)', fontWeight: 400 }}>(PDF, DOC, DOCX up to 5MB)</span>
                      </label>
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                          width: '100%',
                          padding: '12px',
                          borderRadius: '8px',
                          border: '1px dashed var(--line-strong)',
                          background: 'var(--paper)',
                          color: 'var(--ink)',
                          fontSize: '0.875rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px'
                        }}
                      >
                        <span>📎</span>
                        <span>{resumeFile ? `Selected: ${resumeFile.name}` : 'Click to attach resume from your device'}</span>
                      </button>
                      {resumeFile && (
                        <div style={{ marginTop: '4px', display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', color: 'var(--muted)' }}>
                          <span>{(resumeFile.size / 1024).toFixed(0)} KB</span>
                          <button
                            type="button"
                            onClick={() => {
                              setResumeFile(null);
                              if (fileInputRef.current) fileInputRef.current.value = '';
                            }}
                            style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', padding: 0 }}
                          >
                            Remove
                          </button>
                        </div>
                      )}
                      {errors.resume && <span style={{ color: 'var(--error)', fontSize: '0.8125rem' }}>{errors.resume}</span>}
                    </div>

                    {/* Resume or LinkedIn URL */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px' }}>
                        LinkedIn or Portfolio link <span style={{ color: 'var(--muted)', fontWeight: 400 }}>(optional)</span>
                      </label>
                      <input
                        type="url"
                        name="resumeUrl"
                        value={formData.resumeUrl}
                        onChange={(e) => handleInputChange('resumeUrl', e.target.value)}
                        placeholder="https://linkedin.com/in/username"
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          borderRadius: '8px',
                          border: '1px solid var(--line)',
                          background: 'var(--paper)',
                          color: 'var(--ink)',
                          fontSize: '0.9375rem'
                        }}
                      />
                    </div>
                  </div>

                  {submitError && (
                    <div
                      style={{
                        marginTop: '1rem',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        background: 'rgba(180, 35, 24, 0.1)',
                        color: 'var(--error)',
                        fontSize: '0.875rem'
                      }}
                    >
                      {submitError}
                    </div>
                  )}

                  {/* Green Apply Now! Button matching wireframe */}
                  <div style={{ marginTop: '1.75rem' }}>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isSubmitting}
                      style={{
                        width: '100%',
                        padding: '14px',
                        fontSize: '1.0625rem',
                        fontWeight: 600,
                        cursor: isSubmitting ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {isSubmitting ? 'Submitting Application…' : 'Apply Now !'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
