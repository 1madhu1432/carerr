import React, { useState, useRef, useEffect } from 'react';
import { useJobs } from '../context/JobsContext';
import { apiUrl } from '../config/api';
import ScreeningForm from './ScreeningForm';
import ApplicationSuccess from './ApplicationSuccess';

export default function ApplicationForm({ initialRoleId }) {
  const { jobs, selectedRoleId, setSelectedRoleId, applyFormTrigger } = useJobs();
  const fileInputRef = useRef(null);

  const activeRole = initialRoleId || selectedRoleId || '';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    roleId: activeRole,
    availability: [],
    start: 'Right away',
    resumeUrl: '',
    about: ''
  });

  const [screeningAnswers, setScreeningAnswers] = useState({
    'Coffee & Hospitality Experience': 'None — excited to learn coffee craft!',
    'Food Safety Certification': 'No, but ready to complete company-paid training',
    'Peak Shift Preference': 'Available for early morning opens',
    'Favorite Drink / Hospitality Passion': ''
  });

  const [resumeFile, setResumeFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);

  // Sync selectedRoleId from context and reset success screen so the form is always visible
  useEffect(() => {
    if (applyFormTrigger > 0 || selectedRoleId || initialRoleId) {
      setSubmissionResult(null);
      setSubmitError('');

      const targetId = initialRoleId || selectedRoleId;
      if (targetId) {
        setFormData((prev) => ({ ...prev, roleId: targetId }));
        setErrors((prev) => ({ ...prev, role: '' }));
      }

      setTimeout(() => {
        const nameEl = document.getElementById('f-name');
        if (nameEl && document.activeElement !== nameEl) {
          nameEl.focus({ preventScroll: true });
        }
      }, 200);
    }
  }, [selectedRoleId, applyFormTrigger, initialRoleId]);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Enter your full name.';
    if (!formData.email.trim()) {
      errs.email = 'Enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Check your email address. It should look like name@example.com.';
    }
    if (!formData.roleId) {
      errs.role = 'Choose a role, or pick “Not sure yet”.';
    }
    if (formData.resumeUrl && !/^https?:\/\/\S+\.\S+/i.test(formData.resumeUrl.trim())) {
      errs.resumeUrl = 'Enter the full link starting with https://';
    }
    if (resumeFile && resumeFile.size > 5 * 1024 * 1024) {
      errs.resumeFile = 'File size exceeds 5MB limit.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (submitError) setSubmitError('');
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleAvailabilityToggle = (option) => {
    setFormData((prev) => {
      const exists = prev.availability.includes(option);
      return {
        ...prev,
        availability: exists
          ? prev.availability.filter((a) => a !== option)
          : [...prev.availability, option]
      };
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, resumeFile: 'File exceeds 5MB limit.' }));
        return;
      }
      setResumeFile(file);
      setErrors((prev) => ({ ...prev, resumeFile: '' }));
    }
  };

  const removeFile = () => {
    setResumeFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      const firstKey = Object.keys(errors)[0];
      const el = document.getElementById(`f-${firstKey}`);
      if (el) el.focus();
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');
    try {
      const body = new FormData();
      body.append('name', formData.name);
      body.append('email', formData.email);
      body.append('phone', formData.phone);
      body.append('roleId', formData.roleId);
      body.append('availability', JSON.stringify(formData.availability));
      body.append('start', formData.start);
      body.append('resumeUrl', formData.resumeUrl);
      body.append('about', formData.about);
      body.append('screening', JSON.stringify(screeningAnswers));

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

      const matchedJob = jobs.find((j) => j.id === formData.roleId);
      setSubmissionResult({
        candidateId: data.candidateId,
        isMock: data.isMock,
        candidateName: formData.name,
        roleName: matchedJob ? matchedJob.title : 'General Application'
      });
    } catch (err) {
      setSubmitError(err.message || 'Application could not be sent. Please check your details and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      roleId: '',
      availability: [],
      start: 'Right away',
      resumeUrl: '',
      about: ''
    });
    setResumeFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setSelectedRoleId('');
    setErrors({});
    setSubmitError('');
    setSubmissionResult(null);
  };

  return (
    <section className="section section-alt" id="apply" aria-labelledby="apply-title">
      <div className="wrap apply-grid">
        <div className="section-head">
          <h2 id="apply-title">Send your application</h2>
          <p>
            Ready to join the Sélon team? Apply directly for any open role, or submit a general application.
            We review every candidate carefully and reply within 5 working days.
          </p>
          <p className="contact-note">
            Prefer to write to us yourself? Email{' '}
            <a href="mailto:careers@seloncoffee.com">careers@seloncoffee.com</a>.
          </p>
        </div>

        <div className="form-card">
          {submissionResult ? (
            <ApplicationSuccess
              candidateId={submissionResult.candidateId}
              isMock={submissionResult.isMock}
              roleName={submissionResult.roleName}
              candidateName={submissionResult.candidateName}
              onReset={handleReset}
            />
          ) : (
            <form id="apply-form" noValidate onSubmit={handleSubmit}>
              <div className="fields">
                {/* Full name */}
                <div className="field">
                  <label htmlFor="f-name">Full name</label>
                  <input
                    id="f-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    aria-invalid={!!errors.name}
                  />
                  <span className="error">{errors.name}</span>
                </div>

                {/* Email */}
                <div className="field">
                  <label htmlFor="f-email">Email</label>
                  <input
                    id="f-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    aria-invalid={!!errors.email}
                  />
                  <span className="error">{errors.email}</span>
                </div>

                {/* Phone */}
                <div className="field">
                  <label htmlFor="f-phone">
                    Phone <span className="optional">(optional)</span>
                  </label>
                  <input
                    id="f-phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                  />
                </div>

                {/* Role select */}
                <div className="field">
                  <label htmlFor="f-role">Role</label>
                  <select
                    id="f-role"
                    name="roleId"
                    value={formData.roleId}
                    onChange={(e) => handleChange('roleId', e.target.value)}
                    aria-invalid={!!errors.role}
                  >
                    <option value="">Choose a role</option>
                    {jobs.map((j) => (
                      <option key={j.id} value={j.id}>
                        {j.title} {j.location ? `(${j.location})` : ''}
                      </option>
                    ))}
                    <option value="any">Not sure yet / General application</option>
                  </select>
                  <span className="error">{errors.role}</span>
                </div>

                {/* Availability checkboxes */}
                <fieldset className="field field-full">
                  <legend>
                    When can you work? <span className="optional">(pick any)</span>
                  </legend>
                  <div className="checks">
                    {[
                      'Weekday mornings',
                      'Weekday afternoons',
                      'Evenings',
                      'Weekends'
                    ].map((time) => (
                      <label key={time} className="check">
                        <input
                          type="checkbox"
                          name="availability"
                          value={time}
                          checked={formData.availability.includes(time)}
                          onChange={() => handleAvailabilityToggle(time)}
                        />
                        <span>{time}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                {/* Earliest start date */}
                <div className="field">
                  <label htmlFor="f-start">When could you start?</label>
                  <select
                    id="f-start"
                    name="start"
                    value={formData.start}
                    onChange={(e) => handleChange('start', e.target.value)}
                  >
                    <option value="Right away">Right away</option>
                    <option value="In 2 weeks">In 2 weeks</option>
                    <option value="In a month or more">In a month or more</option>
                  </select>
                </div>

                {/* Resume URL */}
                <div className="field">
                  <label htmlFor="f-resumeUrl">
                    Resume or LinkedIn link <span className="optional">(optional)</span>
                  </label>
                  <input
                    id="f-resumeUrl"
                    name="resumeUrl"
                    type="url"
                    inputMode="url"
                    placeholder="https://"
                    value={formData.resumeUrl}
                    onChange={(e) => handleChange('resumeUrl', e.target.value)}
                    aria-invalid={!!errors.resumeUrl}
                  />
                  <span className="error">{errors.resumeUrl}</span>
                </div>

                {/* Resume File Upload (Integrated with Zoho Attachments API) */}
                <div className="field field-full">
                  <label>
                    Upload Resume <span className="optional">(PDF, DOC, DOCX up to 5MB)</span>
                  </label>
                  {!resumeFile ? (
                    <div
                      className="file-upload-box"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={handleFileChange}
                      />
                      <div className="file-upload-label">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="17 8 12 3 7 8" />
                          <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                        <span>Click to attach resume from your device</span>
                      </div>
                    </div>
                  ) : (
                    <div className="file-selected-info">
                      <span>📄 {resumeFile.name} ({(resumeFile.size / 1024).toFixed(0)} KB)</span>
                      <button type="button" className="file-remove-btn" onClick={removeFile}>
                        Remove
                      </button>
                    </div>
                  )}
                  <span className="error">{errors.resumeFile}</span>
                </div>

                {/* Integrated Role-Specific Pre-Screening Questionnaire */}
                <ScreeningForm
                  roleTitle={jobs.find((j) => j.id === formData.roleId)?.title || ''}
                  answers={screeningAnswers}
                  onChange={setScreeningAnswers}
                />

                {/* About me */}
                <div className="field field-full">
                  <label htmlFor="f-about">
                    Tell us a bit about you <span className="optional">(optional)</span>
                  </label>
                  <span className="hint" id="h-about">
                    Past jobs, what you enjoy, or why Sélon. A few sentences is plenty.
                  </span>
                  <textarea
                    id="f-about"
                    name="about"
                    aria-describedby="h-about"
                    value={formData.about}
                    onChange={(e) => handleChange('about', e.target.value)}
                  />
                </div>
              </div>

              <div className="form-foot">
                {submitError && (
                  <div
                    style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.4)',
                      color: '#f87171',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      marginBottom: '16px',
                      fontSize: '0.9rem',
                      lineHeight: '1.4'
                    }}
                  >
                    ⚠️ {submitError}
                  </div>
                )}
                <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending application…' : 'Send application'}
                </button>
                <p className="form-note">
                  Your information is submitted directly to Sélon Coffee recruitment operations.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

