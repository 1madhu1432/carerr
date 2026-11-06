import React, { useMemo } from 'react';

/**
 * Returns role-specific question definitions based on role title
 */
function getQuestionsForRole(roleTitle = '') {
  const titleLower = (roleTitle || '').toLowerCase();

  // 1. Leadership / Supervisor
  if (titleLower.includes('supervisor') || titleLower.includes('lead') || titleLower.includes('manager')) {
    return {
      category: 'Leadership & Café Operations',
      description: 'Questions tailored to floor supervision, staff coaching, and inventory management.',
      questions: [
        {
          key: 'Leadership Experience',
          label: '1. What prior leadership or supervisory experience do you have?',
          type: 'radio',
          options: [
            '1+ year running café or restaurant shifts',
            '2+ years retail / hospitality leadership',
            'Senior team member looking to step into management',
            'Extensive team coaching and operational experience'
          ]
        },
        {
          key: 'Operations & Inventory',
          label: '2. Which operations areas are you most comfortable managing?',
          type: 'radio',
          options: [
            'Daily cash reconciliation, waste tracking & inventory freshness',
            'Staff rota scheduling and peak speed of service',
            'All of the above — comfortable across full floor operations'
          ]
        },
        {
          key: 'Peak Rush Management',
          label: '3. How do you handle morning queue rushes when the line is out the door?',
          type: 'radio',
          options: [
            'Calm the floor, calibrate bar stations, and support baristas',
            'Jump onto bar or register directly and lead from the front',
            'Ensure smooth customer handoffs while maintaining quality'
          ]
        },
        {
          key: 'Coaching & Culture',
          label: '4. Describe your leadership style or a time you helped a teammate succeed.',
          type: 'text',
          placeholder: 'Share a brief example (optional)'
        }
      ]
    };
  }

  // 2. Roastery / Production
  if (titleLower.includes('roast') || titleLower.includes('production') || titleLower.includes('packaging')) {
    return {
      category: 'Roastery & Green Coffee Production',
      description: 'Questions tailored to drum roasting, green bean grading, sensory cupping, and logistics.',
      questions: [
        {
          key: 'Roasting & Production Experience',
          label: '1. What experience do you have in coffee roasting or warehouse production?',
          type: 'radio',
          options: [
            'Production roasting on drum roasters (Giesen, Probat, etc.)',
            'Sample roasting and green bean moisture/density grading',
            'Packaging, heat-sealing, and inventory fulfillment',
            'No direct roasting experience, eager to learn production craft'
          ]
        },
        {
          key: 'Sensory Calibration',
          label: '2. Are you familiar with sensory cuppings and roast profile logging?',
          type: 'radio',
          options: [
            'Regularly participate in SCA sensory cuppings and defect scoring',
            'Enthusiastic coffee palate, ready for daily team calibration'
          ]
        },
        {
          key: 'Physical Capability',
          label: '3. Roastery operations involve moving green coffee bags. Are you comfortable lifting 20–30 kg safely?',
          type: 'radio',
          options: [
            'Yes, comfortable with physical lifting & safety standards',
            'Prefer light packaging, retail labeling & dispatch duties'
          ]
        },
        {
          key: 'Roast Style & Origins',
          label: '4. What roast style or origin flavor notes do you find most exciting?',
          type: 'text',
          placeholder: 'E.g. Light-roast Ethiopian natural, washed Colombian (optional)'
        }
      ]
    };
  }

  // 3. Barista & Café Hospitality
  if (titleLower.includes('barista') || titleLower.includes('cafe') || titleLower.includes('hospitality')) {
    return {
      category: 'Barista & Coffee Craft',
      description: 'Questions tailored to espresso calibration, textured milk steaming, and hospitality warmth.',
      questions: [
        {
          key: 'Coffee & Hospitality Experience',
          label: '1. What prior experience do you have in specialty coffee or customer hospitality?',
          type: 'radio',
          options: [
            'None — excited to learn coffee craft from scratch!',
            'Under 1 year (retail or cafe)',
            '1–2 years barista experience',
            '3+ years / senior barista'
          ]
        },
        {
          key: 'Food Safety Certification',
          label: '2. Do you currently hold a Food Safety & Hygiene certification?',
          type: 'radio',
          options: [
            'Yes, currently certified',
            'No, but ready to complete company-paid training'
          ]
        },
        {
          key: 'Peak Shift Preference',
          label: '3. Sélon cafés are busiest in the mornings and weekends. Which best describes your schedule?',
          type: 'radio',
          options: [
            'Available for early morning opens (6:30 AM)',
            'Available for busy weekend rushes',
            'Fully open and flexible schedule'
          ]
        },
        {
          key: 'Favorite Drink / Passion',
          label: '4. What coffee drink or hospitality moment makes you happiest?',
          type: 'text',
          placeholder: 'E.g. A silky flat white, or remembering regular customers’ names'
        }
      ]
    };
  }

  // 4. Default / General Role / Custom Zoho Role (like "test")
  return {
    category: roleTitle ? `Role Questionnaire: ${roleTitle}` : 'Candidate Background Questionnaire',
    description: 'Tailored questions to help café leadership evaluate your background for this specific position.',
    questions: [
      {
        key: 'Relevant Experience & Background',
        label: '1. What best describes your primary background for this role?',
        type: 'radio',
        options: [
          'Customer service & hospitality',
          'Retail operations, logistics or store management',
          'Food & beverage craft',
          'Eager learner / looking to build a new career'
        ]
      },
      {
        key: 'Weekly Commitment',
        label: '2. What is your preferred work commitment?',
        type: 'radio',
        options: [
          'Full-time (35–40 hours / week)',
          'Part-time (20–30 hours / week)',
          'Flexible schedule across weekdays and weekends'
        ]
      },
      {
        key: 'Why Sélon Coffee',
        label: '3. What attracts you most to joining Sélon Coffee?',
        type: 'radio',
        options: [
          'Commitment to quality coffee craft & hospitality',
          'Warm, supportive, and inclusive team culture',
          'Opportunity for continuous paid training and career growth'
        ]
      },
      {
        key: 'Key Strengths',
        label: '4. What is a key strength you would bring to the Sélon team?',
        type: 'text',
        placeholder: 'E.g. Punctuality, attention to detail, calm under pressure (optional)'
      }
    ]
  };
}

export default function ScreeningForm({ roleTitle = '', answers = {}, onChange }) {
  const config = useMemo(() => getQuestionsForRole(roleTitle), [roleTitle]);

  const updateAnswer = (questionKey, value) => {
    onChange({
      ...answers,
      [questionKey]: value
    });
  };

  return (
    <div className="screening-section">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div className="screening-title">Pre-Screening Questionnaire</div>
        {roleTitle && (
          <span style={{
            fontSize: '0.8rem',
            padding: '3px 8px',
            borderRadius: '6px',
            background: 'var(--tag-bg)',
            color: 'var(--ink)',
            border: '1px solid var(--line)',
            fontWeight: 500
          }}>
            🎯 Tailored for: {roleTitle}
          </span>
        )}
      </div>

      <p className="screening-desc">
        {config.description}
      </p>

      {config.questions.map((q, idx) => {
        const currentValue = answers[q.key] !== undefined 
          ? answers[q.key] 
          : (q.type === 'radio' ? q.options[0] : '');

        return (
          <div key={q.key} className="screening-group">
            <label className="screening-question" htmlFor={`f-q-${idx}`}>
              {q.label}
            </label>

            {q.type === 'radio' ? (
              <div className="screening-options">
                {q.options.map((option) => (
                  <label key={option} className="screening-option-label">
                    <input
                      type="radio"
                      name={`screening_${idx}`}
                      value={option}
                      checked={currentValue === option}
                      onChange={() => updateAnswer(q.key, option)}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            ) : (
              <input
                id={`f-q-${idx}`}
                type="text"
                placeholder={q.placeholder || ''}
                value={currentValue}
                onChange={(e) => updateAnswer(q.key, e.target.value)}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
