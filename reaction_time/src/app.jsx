import React from "react";
import ReactDOM from "react-dom/client";
import "./app.css";

import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";

export default function App() {
  return (
    <div
      className="container-fluid bg-secondary text-center"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <main>
        <h1>Reaction Time App</h1>
        <p>Welcome! This is a placeholder page. Content coming soon.</p>
      </main>
    </div>
  );
}
