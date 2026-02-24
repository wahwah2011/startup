import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

export function Login({ userName, onLogin, onLogout }) {
  const [nameInput, setNameInput] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    onLogin(nameInput.trim());
    navigate("/quiz");
  }

  return (
    <main className="container">
      <div className="row justify-content-center">
        <div className="col-12">
          {userName ? (
            <div className="card login-card">
              <div className="card-body text-center">
                <h2 className="card-title mb-4">Welcome back, {userName}!</h2>
                <div className="d-flex gap-2 justify-content-center">
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate("/quiz")}
                  >
                    Start Quiz
                  </button>
                  <button
                    className="btn btn-outline-secondary"
                    onClick={onLogout}
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="card login-card">
              <div className="card-body">
                <h2 className="card-title text-center mb-4">
                  Welcome, Chemist
                </h2>
                <form onSubmit={handleSubmit}>
                  <div className="input-group mb-3">
                    <span className="input-group-text">&#x1F9EA;</span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Username"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      required
                    />
                  </div>
                  <div className="input-group mb-3">
                    <span className="input-group-text">&#x1F512;</span>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="d-flex gap-2 justify-content-center">
                    <button type="submit" className="btn btn-primary">
                      Login
                    </button>
                    <button type="submit" className="btn btn-outline-secondary">
                      Create
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div id="user-display" className="card info-card mt-3">
            <div className="card-body text-center">
              <p className="mb-0">
                Logged in as:{" "}
                <span className="fw-bold">{userName || "Guest"}</span>
              </p>
            </div>
          </div>

          {/* WEBSOCKET: Real-time active users count */}
          <div id="active-users" className="card info-card mt-3">
            <div className="card-body text-center">
              <p className="mb-0">
                Chemists online: <span className="badge bg-success">5</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
