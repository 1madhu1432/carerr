/**
 * Role-specific assessment questions configuration.
 * In accordance with the Figma wireframe:
 * "Routed to the test only if available in linked Zoho Recruit (jobid), if not directly thank you page"
 */

export const ASSESSMENTS = {
  // Assessment for Operations Executive (Live Zoho Job Opening)
  'operations executive': {
    title: 'Operations & Store Leadership Assessment',
    timeEstimate: '3–5 mins',
    description: 'This short assessment helps our leadership team understand your operational mindset, team management style, and problem-solving approach.',
    questions: [
      {
        id: 'ops_experience',
        question: 'How do you approach managing daily store operations and maintaining quality standards during high-volume peak hours?',
        type: 'textarea',
        placeholder: 'Share a brief example of how you organize shifts, handle rush periods, or maintain store excellence...'
      },
      {
        id: 'team_leadership',
        question: 'Describe your method for setting performance goals, mentoring team members, and minimizing store inventory waste.',
        type: 'textarea',
        placeholder: 'Describe your leadership style and practical methods for managing stock variance and targets...'
      },
      {
        id: 'scenario_handling',
        question: 'Scenario: Two key team members call in sick right before a major morning peak rush. What is your immediate action plan?',
        type: 'textarea',
        placeholder: 'Outline the steps you would take to keep service moving and customers happy...'
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
