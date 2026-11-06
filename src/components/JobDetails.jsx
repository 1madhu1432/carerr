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
    city: '',
    currentJobTitle: '',
    currentEmployer: '',
    experienceInYears: '',
    qualification: '',
    skills: '',
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
        setAssessmentConfig(data.job?.assessment || getAssessmentForJob(data.job));
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
    if (!formData.phone.trim()) {
      errs.phone = 'Phone number is required.';
    }
    if (!formData.city.trim()) {
      errs.city = 'City / current location is required.';
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
      body.append('city', formData.city.trim());
      body.append('currentJobTitle', formData.currentJobTitle.trim());
      body.append('currentEmployer', formData.currentEmployer.trim());
      body.append('experienceInYears', formData.experienceInYears.trim());
      body.append('qualification', formData.qualification.trim());
      body.append('skills', formData.skills.trim());
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

  const tags = [
    `Job ID: #${job.id}`,
    job.location && job.location !== 'Location not specified' ? job.location : (job.city && job.city !== 'Other' ? job.city : ''),
    job.type,
    job.remote ? 'Remote' : '',
    job.experience ? `Experience: ${job.experience}` : ''
  ].filter(Boolean);
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
            jobId={job.id}
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

                {/* Role Details & Skills from Zoho Recruit */}
                {(job.experience || job.skills || job.industry || job.positions) && (
                  <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid var(--line)' }}>
                    <h4 style={{ margin: '0 0 0.875rem', fontSize: '1rem', fontWeight: 600, color: 'var(--ink)' }}>
                      Role Overview & Requirements
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
                      {job.experience && (
                        <div style={{ padding: '10px 12px', background: 'var(--paper)', borderRadius: '8px', border: '1px solid var(--line)' }}>
                          <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Experience</span>
                          <strong style={{ fontSize: '0.9375rem', color: 'var(--ink)' }}>{job.experience}</strong>
                        </div>
                      )}
                      {job.positions && (
                        <div style={{ padding: '10px 12px', background: 'var(--paper)', borderRadius: '8px', border: '1px solid var(--line)' }}>
                          <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Openings</span>
                          <strong style={{ fontSize: '0.9375rem', color: 'var(--ink)' }}>{job.positions} Position{job.positions > 1 ? 's' : ''}</strong>
                        </div>
                      )}
                      {job.type && (
                        <div style={{ padding: '10px 12px', background: 'var(--paper)', borderRadius: '8px', border: '1px solid var(--line)' }}>
                          <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Job Type</span>
                          <strong style={{ fontSize: '0.9375rem', color: 'var(--ink)' }}>{job.type}</strong>
                        </div>
                      )}
                    </div>

                    {job.skills && (
                      <div>
                        <span style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--ink)', marginBottom: '6px' }}>
                          Key Skills & Competencies
                        </span>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                          {job.skills.split(',').map((skill, idx) => (
                            <span
                              key={idx}
                              style={{
                                padding: '4px 10px',
                                background: 'var(--paper)',
                                border: '1px solid var(--line)',
                                borderRadius: '6px',
                                fontSize: '0.8125rem',
                                color: 'var(--ink)'
                              }}
                            >
                              {skill.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
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
                <div style={{ marginBottom: '1.5rem', paddingBottom: '0.75rem', borderTop: 'none', borderBottom: '1px solid var(--line)' }}>
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
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    {/* Row 1: Full Name & Email */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.875rem' }}>
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
                            padding: '10px 12px',
                            borderRadius: '8px',
                            border: errors.name ? '1px solid var(--error)' : '1px solid var(--line)',
                            background: 'var(--paper)',
                            color: 'var(--ink)',
                            fontSize: '0.9375rem'
                          }}
                        />
                        {errors.name && <span style={{ color: 'var(--error)', fontSize: '0.8125rem' }}>{errors.name}</span>}
                      </div>

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
                            padding: '10px 12px',
                            borderRadius: '8px',
                            border: errors.email ? '1px solid var(--error)' : '1px solid var(--line)',
                            background: 'var(--paper)',
                            color: 'var(--ink)',
                            fontSize: '0.9375rem'
                          }}
                        />
                        {errors.email && <span style={{ color: 'var(--error)', fontSize: '0.8125rem' }}>{errors.email}</span>}
                      </div>
                    </div>

                    {/* Row 2: Phone & Current City */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.875rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px' }}>
                          Phone / Mobile *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="+91 98765 43210"
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            borderRadius: '8px',
                            border: errors.phone ? '1px solid var(--error)' : '1px solid var(--line)',
                            background: 'var(--paper)',
                            color: 'var(--ink)',
                            fontSize: '0.9375rem'
                          }}
                        />
                        {errors.phone && <span style={{ color: 'var(--error)', fontSize: '0.8125rem' }}>{errors.phone}</span>}
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px' }}>
                          City / Location *
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          placeholder="e.g. Bangalore, Mumbai"
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            borderRadius: '8px',
                            border: errors.city ? '1px solid var(--error)' : '1px solid var(--line)',
                            background: 'var(--paper)',
                            color: 'var(--ink)',
                            fontSize: '0.9375rem'
                          }}
                        />
                        {errors.city && <span style={{ color: 'var(--error)', fontSize: '0.8125rem' }}>{errors.city}</span>}
                      </div>
                    </div>

                    {/* Row 3: Current Job Title & Employer */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.875rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px' }}>
                          Current Job Title <span style={{ color: 'var(--muted)', fontWeight: 400 }}>(or Fresher)</span>
                        </label>
                        <input
                          type="text"
                          name="currentJobTitle"
                          value={formData.currentJobTitle}
                          onChange={(e) => handleInputChange('currentJobTitle', e.target.value)}
                          placeholder="e.g. Operations Exec, Barista"
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            borderRadius: '8px',
                            border: '1px solid var(--line)',
                            background: 'var(--paper)',
                            color: 'var(--ink)',
                            fontSize: '0.9375rem'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px' }}>
                          Current Employer <span style={{ color: 'var(--muted)', fontWeight: 400 }}>(optional)</span>
                        </label>
                        <input
                          type="text"
                          name="currentEmployer"
                          value={formData.currentEmployer}
                          onChange={(e) => handleInputChange('currentEmployer', e.target.value)}
                          placeholder="e.g. ABC Retail, Freelance"
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            borderRadius: '8px',
                            border: '1px solid var(--line)',
                            background: 'var(--paper)',
                            color: 'var(--ink)',
                            fontSize: '0.9375rem'
                          }}
                        />
                      </div>
                    </div>

                    {/* Row 4: Experience (Years) & Highest Qualification */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.875rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px' }}>
                          Total Experience <span style={{ color: 'var(--muted)', fontWeight: 400 }}>(years)</span>
                        </label>
                        <input
                          type="number"
                          name="experienceInYears"
                          min="0"
                          max="40"
                          step="0.5"
                          value={formData.experienceInYears}
                          onChange={(e) => handleInputChange('experienceInYears', e.target.value)}
                          placeholder="e.g. 2"
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            borderRadius: '8px',
                            border: '1px solid var(--line)',
                            background: 'var(--paper)',
                            color: 'var(--ink)',
                            fontSize: '0.9375rem'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px' }}>
                          Highest Qualification
                        </label>
                        <select
                          name="qualification"
                          value={formData.qualification}
                          onChange={(e) => handleInputChange('qualification', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            borderRadius: '8px',
                            border: '1px solid var(--line)',
                            background: 'var(--paper)',
                            color: 'var(--ink)',
                            fontSize: '0.9375rem'
                          }}
                        >
                          <option value="">Select qualification</option>
                          <option value="B.Tech">B.Tech</option>
                          <option value="B.E.">B.E.</option>
                          <option value="B.SC.">B.SC.</option>
                          <option value="M.C.A.">M.C.A.</option>
                          <option value="M.S.">M.S.</option>
                          <option value="Bachelor's Degree">Bachelor's Degree</option>
                          <option value="Master's Degree (MBA/MS)">Master's Degree (MBA/MS)</option>
                          <option value="Diploma">Diploma</option>
                          <option value="High School">High School</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    {/* Key Skills */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px' }}>
                        Key Skills <span style={{ color: 'var(--muted)', fontWeight: 400 }}>(comma separated)</span>
                      </label>
                      <input
                        type="text"
                        name="skills"
                        value={formData.skills}
                        onChange={(e) => handleInputChange('skills', e.target.value)}
                        placeholder="e.g. Operations, Retail, Team Building, Inventory"
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          border: '1px solid var(--line)',
                          background: 'var(--paper)',
                          color: 'var(--ink)',
                          fontSize: '0.9375rem'
                        }}
                      />
                    </div>

                    {/* Row 5: Start Date & LinkedIn */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.875rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px' }}>
                          Earliest Start Date
                        </label>
                        <select
                          name="start"
                          value={formData.start}
                          onChange={(e) => handleInputChange('start', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
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

                      <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px' }}>
                          LinkedIn Profile <span style={{ color: 'var(--muted)', fontWeight: 400 }}>(optional)</span>
                        </label>
                        <input
                          type="url"
                          name="resumeUrl"
                          value={formData.resumeUrl}
                          onChange={(e) => handleInputChange('resumeUrl', e.target.value)}
                          placeholder="https://linkedin.com/in/username"
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            borderRadius: '8px',
                            border: '1px solid var(--line)',
                            background: 'var(--paper)',
                            color: 'var(--ink)',
                            fontSize: '0.9375rem'
                          }}
                        />
                      </div>
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

                    {/* About / Note */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px' }}>
                        About You / Why Sélon? <span style={{ color: 'var(--muted)', fontWeight: 400 }}>(optional)</span>
                      </label>
                      <textarea
                        name="about"
                        rows={3}
                        value={formData.about}
                        onChange={(e) => handleInputChange('about', e.target.value)}
                        placeholder="Tell us briefly about your background and why you are interested in Sélon Coffee…"
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          border: '1px solid var(--line)',
                          background: 'var(--paper)',
                          color: 'var(--ink)',
                          fontSize: '0.9375rem',
                          fontFamily: 'inherit',
                          resize: 'vertical'
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
