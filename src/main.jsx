import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { JobsProvider } from './context/JobsContext';
import './styles/selon.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <JobsProvider>
        <App />
      </JobsProvider>
    </HashRouter>
  </React.StrictMode>
);

