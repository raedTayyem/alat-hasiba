import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/index.css';
import { initDateInputRTL } from './utils/dateInputRTL';

// Initialize RTL support for date inputs - single optimized call using requestIdleCallback
if (typeof window !== 'undefined') {
  const initRTL = () => {
    try {
      initDateInputRTL();
    } catch {
      // Silently fail in production
    }
  };

  // Use requestIdleCallback for non-blocking initialization, fallback to load event
  if (typeof (window as Window & { requestIdleCallback?: typeof requestIdleCallback }).requestIdleCallback === 'function') {
    (window as Window & { requestIdleCallback: typeof requestIdleCallback }).requestIdleCallback(initRTL, { timeout: 1000 });
  } else {
    window.addEventListener('load', initRTL, { once: true });
  }
}

// Use BrowserRouter with future flags to resolve React Router v7 warnings
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter future={{ v7_startTransition: true }}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// HMR for development
if (import.meta.hot) {
  import.meta.hot.accept();
}

// Unregister any existing service workers (run once, non-blocking)
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(registration => registration.unregister());
  }).catch(() => {});
} 