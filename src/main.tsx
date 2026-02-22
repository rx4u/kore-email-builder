import React from 'react';
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from "./App.tsx";
import "./index.css";
import { validateContentBlockTypographyContract } from "./lib/contract-validation";
import { AuthGate } from "./components/AuthGate";
import { PreviewPage } from "./pages/PreviewPage";

if (import.meta.env?.DEV) {
  validateContentBlockTypographyContract();
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/preview/:token" element={<PreviewPage />} />
        <Route path="/*" element={
          <AuthGate>
            <App />
          </AuthGate>
        } />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
