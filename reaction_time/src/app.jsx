import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, NavLink, Navigate } from "react-router-dom";

import { Login } from "./login/login";
import { Quiz } from "./quiz/quiz";
import { Leaderboard } from "./leaderboard/leaderboard";
import { About } from "./about/about";
import { MOCK_PLAYERS, buildLeaderboard } from "./data/players";

export default function App() {
  const [userName, setUserName] = useState(null);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("userName");
    if (stored) {
      setUserName(stored);
    }
  }, []);

  useEffect(() => {
    if (!userName) return;
    let userScore = 0;
    const saved = localStorage.getItem('quizProgress');
    if (saved) {
      const data = JSON.parse(saved);
      if (data.userName === userName) {
        userScore = data.score || 0;
      }
    }
    setPlayers(buildLeaderboard(userName, userScore, MOCK_PLAYERS));
  }, [userName]);

  useEffect(() => {
    if (!userName) return;
    const interval = setInterval(() => {
      setPlayers((prev) => {
        const updated = prev.map((p) => ({ ...p }));
        const nonUserPlayers = updated.filter((p) => !p.isUser);
        if (nonUserPlayers.length === 0) return prev;

        const target = nonUserPlayers[Math.floor(Math.random() * nonUserPlayers.length)];
        target.score += 1;

        updated.sort((a, b) => b.score - a.score);
        return updated;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [userName]);

  function handleLogin(name) {
    localStorage.setItem("userName", name);
    setUserName(name);
  }

  function handleLogout() {
    localStorage.removeItem("userName");
    setUserName(null);
    setPlayers([]);
  }

  function handleScoreUpdate(newScore) {
    setPlayers((prev) => {
      const updated = prev.map((p) =>
        p.isUser ? { ...p, score: newScore } : { ...p }
      );
      updated.sort((a, b) => b.score - a.score);
      return updated;
    });
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
                  {userName && (
                    <>
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
                    </>
                  )}
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
            element={
              userName
                ? <Quiz userName={userName} players={players} onScoreUpdate={handleScoreUpdate} />
                : <Navigate to="/" replace />
            }
          />
          <Route
            path="/leaderboard"
            element={
              userName
                ? <Leaderboard userName={userName} players={players} />
                : <Navigate to="/" replace />
            }
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
