import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GameNotifier, GameEvent } from "../gameNotifier";
import "./login.css";

export function Login({ userName, onLogin, onLogout }) {
  const [nameInput, setNameInput] = useState("");
  const [password, setPassword] = useState("");
  const [onlineCount, setOnlineCount] = useState(GameNotifier.onlineCount || 1);
  const [errorMsg, setErrorMsg] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleEvent(event) {
      if (event.type === GameEvent.OnlineCount) {
        setOnlineCount(event.value);
      }
    }
    GameNotifier.addHandler(handleEvent);
    return () => GameNotifier.removeHandler(handleEvent);
  }, []);

  async function handleLogin(e) {
    e.preventDefault();
    setErrorMsg(null);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: nameInput.trim(),
        password: password,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      onLogin(data.username);
      navigate("/quiz");
    } else {
      const body = await response.json();
      setErrorMsg(body.msg || "Login failed");
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    setErrorMsg(null);
    const response = await fetch("/api/auth/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: nameInput.trim(),
        password: password,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      onLogin(data.username);
      navigate("/quiz");
    } else {
      const body = await response.json();
      setErrorMsg(body.msg || "Registration failed");
    }
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
                {errorMsg && (
                  <div className="alert alert-danger text-center py-2">
                    {errorMsg}
                  </div>
                )}
                <form>
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
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleLogin}
                      disabled={!nameInput.trim() || !password}
                    >
                      Login
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={handleCreate}
                      disabled={!nameInput.trim() || !password}
                    >
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

          <div id="active-users" className="card info-card mt-3">
            <div className="card-body text-center">
              <p className="mb-0">
                Chemists online:{" "}
                <span className="badge bg-success">{onlineCount}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
