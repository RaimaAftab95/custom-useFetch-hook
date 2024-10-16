import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./app.tsx";
import "./main.css";
import "@picocss/pico/css/pico.css";

createRoot(document.getElementById("root")!).render(
  <HashRouter>
    <App />
  </HashRouter>,
);