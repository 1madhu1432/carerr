import React from 'react';
import { useJobs } from '../context/JobsContext';
import JobCard from './JobCard';

export default function JobListings() {
  const {
    jobs,
    loading,
    error,
    isMock,
    selectedCity,
    selectedType,
    setSelectedCity,
    setSelectedType,
    clearFilters,
    fetchJobs
  } = useJobs();

  // Extract unique filter options
  const uniqueCities = ['All', ...new Set(jobs.map((j) => j.city).filter(Boolean))];
  const uniqueTypes = ['All', ...new Set(jobs.map((j) => j.type).filter(Boolean))];

  const showCityChips = uniqueCities.length > 2;
  const showTypeChips = uniqueTypes.length > 2;
  const showToolbar = showCityChips || showTypeChips;

  // Filter jobs by city and type
  const filteredJobs = jobs.filter((j) => {
    const matchesCity = selectedCity === 'All' || j.city === selectedCity;
    const matchesType = selectedType === 'All' || j.type === selectedType;
    return matchesCity && matchesType;
  });

  return (
    <section className="section" id="roles" aria-labelledby="roles-title">
      <div className="wrap">
        <div className="section-head">
          <h2 id="roles-title">Open roles</h2>
          <p>
            Tap a role to see what the job involves, then apply in a few minutes. No coffee experience? Barista roles are a great place to start.
          </p>
        </div>

        {/* Filters Toolbar */}
        {!loading && !error && showToolbar && (
          <div className="toolbar" role="group" aria-label="Filter roles">
            {showCityChips && (
              <div className="chip-row" aria-label="Filter by location" role="group">
                {uniqueCities.map((city) => (
                  <button
                    key={city}
                    type="button"
                    className={`chip ${selectedCity === city ? 'active' : ''}`}
                    aria-pressed={selectedCity === city}
                    onClick={() => setSelectedCity(city)}
                  >
                    {city === 'All' ? 'All locations' : city}
                  </button>
                ))}
              </div>
            )}

            {showTypeChips && (
              <div className="chip-row" aria-label="Filter by job type" role="group">
                {uniqueTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    className={`chip ${selectedType === type ? 'active' : ''}`}
                    aria-pressed={selectedType === type}
                    onClick={() => setSelectedType(type)}
                  >
                    {type === 'All' ? 'All job types' : type}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Roles count & Status */}
        <p className="roles-count" aria-live="polite">
          {loading
            ? 'Loading open roles…'
            : error
              ? ''
              : filteredJobs.length === 1
                ? '1 open role'
                : `${filteredJobs.length} open roles`}
        </p>

        {/* Job Listings / Empty / Error Views */}
        {loading ? (
          <div style={{ padding: '2rem 0', color: 'var(--muted)' }}>
            Loading live positions from recruitment portal...
          </div>
        ) : error ? (
          <div className="empty">
            <p>{error}</p>
            <div className="empty-actions">
              <button className="btn btn-ghost btn-sm" type="button" onClick={fetchJobs}>
                Try again
              </button>
              <a
                className="btn btn-ghost btn-sm"
                href="https://seloncoffee.zohorecruit.in/jobs/Careers"
                target="_blank"
                rel="noopener noreferrer"
              >
                See roles on our hiring site
              </a>
            </div>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="empty">
            {jobs.length === 0 ? (
              <>
                <p>
                  We don’t have open roles right now. Send a general application and we’ll get in touch when something opens up.
                </p>
                <div className="empty-actions">
                  <a className="btn btn-ghost btn-sm" href="#apply">Send a general application</a>
                </div>
              </>
            ) : (
              <>
                <p>
                  No roles match these filters right now. Try another location, or send us a general application.
                </p>
                <div className="empty-actions">
                  <button className="btn btn-ghost btn-sm" type="button" onClick={clearFilters}>
                    Clear filters
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <div
            className="jobs-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '1.5rem',
              marginTop: '1.5rem'
            }}
          >
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

