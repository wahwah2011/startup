import React from "react";
import ReactDOM from "react-dom/client";
import App from "../src/app";

// Global styles
import "bootstrap/dist/css/bootstrap.min.css";
import "../src/app.css";

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
