import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { validateContentBlockTypographyContract } from "./lib/contract-validation";

if (import.meta.env?.DEV) {
  validateContentBlockTypographyContract();
}

createRoot(document.getElementById("root")!).render(<App />);
  