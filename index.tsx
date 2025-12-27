import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import dataMigrationService from './services/dataMigration';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Expose utility functions to window for admin use
(window as any).__adminTools = {
  cleanupDuplicates: async () => {
    console.log('Starting cleanup of duplicate project-client relationships...');
    const result = await dataMigrationService.cleanupDuplicateProjectClients();
    console.log('Cleanup result:', result);
    return result;
  },
};
