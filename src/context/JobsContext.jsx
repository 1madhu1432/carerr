import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiUrl } from '../config/api';

const JobsContext = createContext(null);

export function JobsProvider({ children }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMock, setIsMock] = useState(false);
  const [source, setSource] = useState('loading');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [applyFormTrigger, setApplyFormTrigger] = useState(0);
  const [zohoStatus, setZohoStatus] = useState({
    configured: false,
    connected: false,
    mode: 'checking',
    message: 'Checking Zoho connection...'
  });

  const checkZohoStatus = useCallback(async () => {
    try {
      const res = await fetch(apiUrl('/api/zoho/status'));
      if (!res.ok) throw new Error('Status endpoint unavailable');
      const data = await res.json();
      setZohoStatus(data);
    } catch (err) {
      setZohoStatus({
        configured: false,
        connected: false,
        mode: 'unreachable',
        message: 'Could not connect to backend server'
      });
    }
  }, []);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(apiUrl('/api/jobs'));
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setJobs(data.jobs || []);
      setIsMock(Boolean(data.isMock));
      setSource(data.source || 'zoho_recruit');
      if (data.error) setError(data.error);
    } catch (err) {
      console.error('[JobsContext] Could not load jobs:', err);
      setError('Open roles didn’t load. Check your connection or see every role on our hiring site.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
    checkZohoStatus();

    // Listen for OAuth completion window message
    const handleMessage = (e) => {
      if (e.data && e.data.type === 'ZOHO_CONNECTED') {
        checkZohoStatus();
        fetchJobs();
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [fetchJobs, checkZohoStatus]);

  const clearFilters = () => {
    setSelectedCity('All');
    setSelectedType('All');
  };

  const selectRoleAndScroll = (roleId) => {
    if (roleId) {
      setSelectedRoleId(roleId);
    }
    setApplyFormTrigger((prev) => prev + 1);
    const applyEl = document.getElementById('apply');
    if (applyEl) {
      applyEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <JobsContext.Provider
      value={{
        jobs,
        loading,
        error,
        isMock,
        source,
        zohoStatus,
        selectedCity,
        selectedType,
        selectedRoleId,
        applyFormTrigger,
        setSelectedCity,
        setSelectedType,
        setSelectedRoleId,
        setApplyFormTrigger,
        clearFilters,
        selectRoleAndScroll,
        fetchJobs,
        checkZohoStatus
      }}
    >
      {children}
    </JobsContext.Provider>
  );
}

export function useJobs() {
  const context = useContext(JobsContext);
  if (!context) {
    throw new Error('useJobs must be used within a JobsProvider');
  }
  return context;
}

