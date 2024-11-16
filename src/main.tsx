import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { IntegrationAppProvider } from '@integration-app/react';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <IntegrationAppProvider token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MzIxNTZlMTc2ZTEzZGUyYWE2MjQ5YyIsImlzcyI6IjM4OTk0NzNiLThhMGUtNDZkNC1iZWIzLWVmNmFlZmQ3YzE4NSIsImV4cCI6MTc2Mjk3MDEzNn0.WXaGLVPqavu2PAjTdPlYtdy54E0RyRQt9LRBnRe4ft0">
      <App />
    </IntegrationAppProvider>
  </StrictMode>
);
