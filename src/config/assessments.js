/**
 * Role-specific assessment questions configuration.
 * In accordance with the Figma wireframe:
 * "Routed to the test only if available in linked Zoho Recruit (jobid), if not directly thank you page"
 */

export const ASSESSMENTS = {
  // Assessment for Operations Executive (Live Zoho Job Opening)
  'operations executive': {
    title: 'Operations Executive Pre-Screening',
    timeEstimate: '3–5 mins',
    description: 'Please answer these questions to help our leadership team understand your interest, management approach, and availability for this role.',
    questions: [
      {
        id: 'ops_why_job',
        question: 'Why did you like this JOB ?',
        type: 'textarea',
        placeholder: 'Tell us what attracted you to this Operations Executive role at Sélon Coffee...'
      },
      {
        id: 'ops_manage_chaos',
        question: 'How can mange a chaos',
        type: 'textarea',
        placeholder: 'Describe how you maintain structure, calm, and performance during chaotic or fast-paced situations...'
      },
      {
        id: 'ops_relocate',
        question: 'Are to ready to relocate',
        type: 'choice',
        options: [
          'Yes — ready to relocate as required',
          'Open to relocate with company support',
          'Prefer remote / current location only'
        ]
      },
      {
        id: 'ops_salary',
        question: 'sALARY EXPECTIONS',
        type: 'textarea',
        placeholder: 'Share your current and expected CTC / compensation expectations...'
      }
    ]
  },

  // Assessment for HR Analytics Intern (Live Zoho Job Opening)
  'hr analytics intern': {
    title: 'HR Analytics & Data Insights Assessment',
    timeEstimate: '3–5 mins',
    description: 'Help us understand your familiarity with data analysis tools, reporting, and problem-solving in People Operations.',
    questions: [
      {
        id: 'tools_proficiency',
        question: 'Which tools and platforms are you most comfortable using for data analysis and visualization?',
        type: 'choice',
        options: [
          'Excel / Google Sheets (Advanced formulas, VLOOKUP, Pivot Tables)',
          'SQL (Queries, Joins, Aggregations)',
          'Python / R (Pandas, NumPy, data cleaning)',
          'Power BI / Tableau / Looker Studio'
        ]
      },
      {
        id: 'metrics_design',
        question: 'How would you measure and report key HR metrics such as employee retention, time-to-hire, and department attrition?',
        type: 'textarea',
        placeholder: 'Briefly describe your approach to structuring an insightful HR dashboard or report...'
      },
      {
        id: 'problem_solving',
        question: 'Given employee survey feedback and exit interview notes, what framework would you use to pinpoint the root cause of team turnover?',
        type: 'textarea',
        placeholder: 'Describe how you turn qualitative feedback into actionable recommendations...'
      }
    ]
  },

  // Assessment for Barista roles
  'barista': {
    title: 'Coffee Craft & Hospitality Assessment',
    timeEstimate: '2 mins',
    description: 'We believe genuine hospitality makes great coffee unforgettable.',
    questions: [
      {
        id: 'coffee_passion',
        question: 'What does warm, memorable hospitality mean to you behind the bar?',
        type: 'textarea',
        placeholder: 'Tell us about a time you made someone’s morning special or why you love café culture...'
      },
      {
        id: 'shift_availability',
        question: 'Are you comfortable working early morning opens (e.g. 6:30 AM) and busy weekend shifts?',
        type: 'choice',
        options: [
          'Yes — fully available for early opens and weekend rushes',
          'Available for mornings only',
          'Available for afternoons and evenings',
          'Flexible with advance notice'
        ]
      }
    ]
  },

  // Assessment for Shift Supervisor
  'shift supervisor': {
    title: 'Shift Leadership Assessment',
    timeEstimate: '3 mins',
    description: 'Evaluate your ability to lead floor operations and resolve customer situations calmly.',
    questions: [
      {
        id: 'floor_leadership',
        question: 'How do you keep baristas energized and service smooth during unpredictable rush hours?',
        type: 'textarea',
        placeholder: 'Describe your approach on the café floor...'
      },
      {
        id: 'cash_stock_control',
        question: 'What is your process for daily register reconciliation and inventory logging at shift close?',
        type: 'textarea',
        placeholder: 'Briefly describe your close-out routine...'
      }
    ]
  }
};

/**
 * Returns assessment configuration for a given job object or title.
 * Returns null if no assessment is configured (wireframe rule: bypass to thank you).
 */
export function getAssessmentForJob(job) {
  if (!job) return null;
  const title = (job.title || '').toLowerCase().trim();

  for (const [key, config] of Object.entries(ASSESSMENTS)) {
    if (title.includes(key)) {
      return config;
    }
  }

  // If the job explicitly provides custom assessment questions from Zoho
  if (Array.isArray(job.assessmentQuestions) && job.assessmentQuestions.length > 0) {
    return {
      title: `${job.title} Assessment`,
      timeEstimate: '3–5 mins',
      description: 'Please complete these role-specific questions for our recruitment team.',
      questions: job.assessmentQuestions
    };
  }

  return null;
}

