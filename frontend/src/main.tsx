
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import { API_ORIGIN } from "./config/api";
  import "./styles/index.css";

  if (API_ORIGIN) {
    const preconnect = document.createElement("link");
    preconnect.rel = "preconnect";
    preconnect.href = API_ORIGIN;
    preconnect.crossOrigin = "anonymous";
    document.head.appendChild(preconnect);
  }

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      void navigator.serviceWorker.register("/sw.js");
    });
  }

  createRoot(document.getElementById("root")!).render(<App />);
  
