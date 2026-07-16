import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import App from "./App.jsx";
import "./styles.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/resco-landing-page" element={<App />} />
        <Route path="*" element={<Navigate to="/resco-landing-page" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
