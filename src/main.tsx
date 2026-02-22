import React from 'react';
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { validateContentBlockTypographyContract } from "./lib/contract-validation";
import { AuthGate } from "./components/AuthGate";

if (import.meta.env?.DEV) {
  validateContentBlockTypographyContract();
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthGate>
      <App />
    </AuthGate>
  </React.StrictMode>
);
