import React from 'react';

export default function CompanyCulture() {
  return (
    <section className="section section-inv" id="culture" aria-labelledby="culture-title">
      <div className="wrap">
        <div className="section-head">
          <h2 id="culture-title">Our Culture</h2>
          <p>How we take care of our team and work together every day.</p>
        </div>
        <ul className="perks" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          <li>
            <h3>1. Sunday is Off</h3>
            <p>While others serve on weekends, we care about employees well being.</p>
          </li>
          <li>
            <h3>2. Shifts that fit your life</h3>
            <p>Schedules go out two weeks ahead, and you can swap shifts with teammates in our app.</p>
          </li>
          <li>
            <h3>3. We are purpose-driven</h3>
            <p>We model our Purpose every day, and support each other’ efforts to be good stewards who create a positive impact.</p>
          </li>
        </ul>
      </div>
    </section>
  );
}

