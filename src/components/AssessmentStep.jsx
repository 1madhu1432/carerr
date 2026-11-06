import React, { useState } from 'react';

export default function AssessmentStep({
  job,
  assessment,
  candidateName,
  onSubmit,
  isSubmitting,
  error
}) {
  const [answers, setAnswers] = useState(() => {
    const initial = {};
    if (assessment && assessment.questions) {
      assessment.questions.forEach((q) => {
        initial[q.question] = q.type === 'choice' && q.options?.length ? q.options[0] : '';
      });
    }
    return initial;
  });

  const [validationError, setValidationError] = useState('');

  const handleChange = (question, val) => {
    setAnswers((prev) => ({ ...prev, [question]: val }));
    setValidationError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check that at least one question is answered
    const unanswered = assessment.questions.find((q) => {
      const val = answers[q.question];
      return !val || !val.trim();
    });

    if (unanswered) {
      setValidationError(`Please answer: "${unanswered.question}"`);
      return;
    }

    onSubmit(answers);
  };

  return (
    <div className="assessment-card" style={{ maxWidth: '44rem', margin: '0 auto', width: '100%' }}>
      <div className="assessment-header" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
        <span
          style={{
            display: 'inline-block',
            padding: '4px 12px',
            borderRadius: '999px',
            fontSize: '0.8125rem',
            fontWeight: 600,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            background: 'var(--tag-bg)',
            color: 'var(--ink)',
            marginBottom: '0.75rem'
          }}
        >
          Step 2 of 2 · Role Assessment · Job ID: #{job?.id}
        </span>
        <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', margin: '0 0 0.5rem', lineHeight: 1.15 }}>
          {assessment.title}
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: '1rem', maxWidth: '38rem', margin: '0 auto' }}>
          {assessment.description}
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {assessment.questions.map((q, idx) => (
            <div
              key={q.id || idx}
              className="assessment-field"
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                borderRadius: '12px',
                padding: '1.25rem'
              }}
            >
              <label
                style={{
                  display: 'block',
                  fontWeight: 600,
                  fontSize: '1rem',
                  marginBottom: '0.625rem',
                  color: 'var(--ink)'
                }}
              >
                <span style={{ color: 'var(--muted)', marginRight: '6px' }}>{idx + 1}.</span>
                {q.question}
              </label>

              {q.type === 'choice' ? (
                <div style={{ display: 'grid', gap: '0.5rem' }}>
                  {q.options.map((opt, optIdx) => (
                    <label
                      key={optIdx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 14px',
                        background: answers[q.question] === opt ? 'rgba(3, 64, 5, 0.08)' : 'var(--paper)',
                        border: `1px solid ${answers[q.question] === opt ? 'var(--btn)' : 'var(--line)'}`,
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '0.9375rem',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <input
                        type="radio"
                        name={`q_${idx}`}
                        value={opt}
                        checked={answers[q.question] === opt}
                        onChange={() => handleChange(q.question, opt)}
                        style={{ accentColor: 'var(--btn)', cursor: 'pointer' }}
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <textarea
                  rows={4}
                  value={answers[q.question] || ''}
                  onChange={(e) => handleChange(q.question, e.target.value)}
                  placeholder={q.placeholder || 'Type your response here...'}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    border: '1px solid var(--line)',
                    background: 'var(--paper)',
                    color: 'var(--ink)',
                    fontFamily: 'inherit',
                    fontSize: '0.9375rem',
                    lineHeight: '1.5',
                    resize: 'vertical'
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {(validationError || error) && (
          <div
            style={{
              marginTop: '1.25rem',
              padding: '10px 14px',
              borderRadius: '8px',
              background: 'rgba(180, 35, 24, 0.1)',
              color: 'var(--error)',
              fontSize: '0.9375rem'
            }}
          >
            {validationError || error}
          </div>
        )}

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
            style={{
              minWidth: '220px',
              fontSize: '1.0625rem',
              padding: '14px 28px',
              cursor: isSubmitting ? 'not-allowed' : 'pointer'
            }}
          >
            {isSubmitting ? 'Submitting Assessment…' : 'Apply Now !'}
          </button>
        </div>
      </form>
    </div>
  );
}

