import React from 'react';

export default function CompanyCulture() {
  return (
    <section className="section section-inv" id="perks" aria-labelledby="perks-title">
      <div className="wrap">
        <div className="section-head">
          <h2 id="perks-title">What you get</h2>
          <p>The basics every Sélon team member gets, from your first shift.</p>
        </div>
        <ul className="perks">
          <li>
            <h3>Paid training</h3>
            <p>Every new hire learns the bar with our head trainer, on paid time, before working a solo shift.</p>
          </li>
          <li>
            <h3>Free coffee and food</h3>
            <p>Drinks on every shift, a meal on longer shifts, and a bag of our beans to take home each month.</p>
          </li>
          <li>
            <h3>Shifts that fit your life</h3>
            <p>Schedules go out two weeks ahead, and you can swap shifts with teammates in our app.</p>
          </li>
          <li>
            <h3>Tips shared fairly</h3>
            <p>Tips are pooled and split by hours worked, so the whole team shares in a busy day.</p>
          </li>
          <li>
            <h3>Room to grow</h3>
            <p>Most of our shift leads and managers started behind the bar. We’ll show you what the next step takes.</p>
          </li>
          <li>
            <h3>Time off that’s paid</h3>
            <p>Everyone earns paid time off, and full-time staff get health cover.</p>
          </li>
        </ul>
      </div>
    </section>
  );
}

