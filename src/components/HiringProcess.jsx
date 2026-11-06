import React from 'react';

export default function HiringProcess() {
  return (
    <section className="section" id="process" aria-labelledby="process-title">
      <div className="wrap">
        <div className="section-head">
          <h2 id="process-title">How hiring works</h2>
          <p>Four steps, usually done within two weeks.</p>
        </div>
        <ol className="steps">
          <li>
            <h3>Apply</h3>
            <p>Pick a role above and fill in the short application. Tell us when you can work and what you’re looking for.</p>
            <span className="step-time">About 5 minutes</span>
          </li>
          <li>
            <h3>Quick call</h3>
            <p>A friendly chat with a café manager about shifts, pay and any questions you have.</p>
            <span className="step-time">About 15 minutes</span>
          </li>
          <li>
            <h3>Paid trial shift</h3>
            <p>Spend a couple of hours behind the bar with the team, so you can see if it feels right too.</p>
            <span className="step-time">About 2 hours, paid</span>
          </li>
          <li>
            <h3>Offer</h3>
            <p>We’ll let you know either way. If it’s a yes, we’ll plan your first week together.</p>
            <span className="step-time">Within a week of your trial</span>
          </li>
        </ol>
      </div>
    </section>
  );
}

