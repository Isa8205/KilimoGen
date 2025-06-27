// import React from 'react'
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import App from "./App";
import {QueryClient, QueryClientProvider}  from "@tanstack/react-query";

window.addEventListener('error', e => console.error("Global error:", e.error));
window.addEventListener('unhandledrejection', e => console.error("Unhandled rejection:", e.reason));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

document.addEventListener("DOMContentLoaded", () => {
  const rootElement = document.getElementById("root");
  if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
      <BrowserRouter>
        <RecoilRoot>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </RecoilRoot>
      </BrowserRouter>
    );
  } else {
    console.error("Root element not found");
  }
})

