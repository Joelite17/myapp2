import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { AccountsProvider } from './context/AccountsContext.jsx'; // import provider

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AccountsProvider>
      <App />
    </AccountsProvider>
  </StrictMode>
);
