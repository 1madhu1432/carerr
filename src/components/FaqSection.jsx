import React from 'react';

export default function FaqSection() {
  return (
    <section className="section" id="faq" aria-labelledby="faq-title">
      <div className="wrap">
        <div className="section-head">
          <h2 id="faq-title">Questions</h2>
        </div>
        <div className="faq">
          <details>
            <summary>Do I need coffee experience?</summary>
            <p>No. Most of our baristas joined with none. Being friendly and reliable matters more. We teach the rest.</p>
          </details>
          <details>
            <summary>Can I work around school or another job?</summary>
            <p>Yes. Tell us when you can work in the form, and we’ll match you with shifts that fit.</p>
          </details>
          <details>
            <summary>Is the trial shift paid?</summary>
            <p>Yes. Every trial shift is paid at the normal hourly rate for the role.</p>
          </details>
          <details>
            <summary>When will I hear back?</summary>
            <p>Within 5 working days of applying, even if it isn’t a match this time.</p>
          </details>
          <details>
            <summary>Can I apply for more than one role?</summary>
            <p>Yes. Open each role you’re interested in and apply to it separately.</p>
          </details>
        </div>
      </div>
    </section>
  );
}

