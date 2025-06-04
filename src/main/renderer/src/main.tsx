// import React from 'react'
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import App from "./App";

window.addEventListener('error', e => console.error("Global error:", e.error));
window.addEventListener('unhandledrejection', e => console.error("Unhandled rejection:", e.reason));


document.addEventListener("DOMContentLoaded", () => {
  const rootElement = document.getElementById("root");
  if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
      <BrowserRouter>
        <RecoilRoot>
          <App />
        </RecoilRoot>
      </BrowserRouter>
    );
  } else {
    console.error("Root element not found");
  }
})

