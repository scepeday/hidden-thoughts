import React from "react";
import ReactDOM from "react-dom/client";
import faviconUrl from "../assets/brand/favicon.png";
import App from "./App.jsx";
import "./styles/global.css";

const favicon = document.querySelector("link[rel='icon']") ?? document.createElement("link");
favicon.rel = "icon";
favicon.type = "image/png";
favicon.href = faviconUrl;
document.head.append(favicon);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
