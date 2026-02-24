import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, NavLink, Navigate } from "react-router-dom";

import { Login } from "./login/login";
import { Quiz } from "./quiz/quiz";
import { Leaderboard } from "./leaderboard/leaderboard";
import { About } from "./about/about";

export default function App() {
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("userName");
    if (stored) {
      setUserName(stored);
    }
  }, []);

  function handleLogin(name) {
    localStorage.setItem("userName", name);
    setUserName(name);
  }

  function handleLogout() {
    localStorage.removeItem("userName");
    setUserName(null);
  }

  return (
    <BrowserRouter>
      <div className="d-flex flex-column flex-grow-1">
        {/* Navbar */}
        <header>
          <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
              <NavLink className="navbar-brand" to="/">
                Reaction Time
              </NavLink>
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav me-auto">
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/">
                      Home
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/quiz">
                      Quiz
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/leaderboard">
                      Leaderboard
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/about">
                      About
                    </NavLink>
                  </li>
                </ul>
                {userName && (
                  <span className="navbar-text text-light">
                    Welcome, <strong>{userName}</strong>
                  </span>
                )}
              </div>
            </div>
          </nav>
        </header>

        {/* Page Routes */}
        <Routes>
          <Route
            path="/"
            element={
              <Login
                userName={userName}
                onLogin={handleLogin}
                onLogout={handleLogout}
              />
            }
            exact
          />
          <Route
            path="/quiz"
            element={userName ? <Quiz userName={userName} /> : <Navigate to="/" replace />}
          />
          <Route
            path="/leaderboard"
            element={<Leaderboard userName={userName} />}
          />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

        {/* Footer */}
        <footer className="container-fluid">
          <div className="d-flex justify-content-between align-items-center">
            <span className="text-reset">Elijah Thompson</span>
            <a href="https://github.com/wahwah2011/startup">GitHub</a>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

function NotFound() {
  return (
    <main className="container text-center">
      <h2>404 - Page Not Found</h2>
      <p>The page you're looking for doesn't exist.</p>
    </main>
  );
}
