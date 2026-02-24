import React from "react";
import "./login.css";

export function Login() {
  return (
    <main className="container">
      <div className="row justify-content-center">
        <div className="col-12">
          <div className="card login-card">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Welcome, Chemist</h2>
              {/* DATABASE: Login credentials will be stored and authenticated via database */}
              <form method="get" action="/quiz">
                <div className="input-group mb-3">
                  <span className="input-group-text">@</span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="username"
                  />
                </div>
                <div className="input-group mb-3">
                  <span className="input-group-text">🔒</span>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="password"
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

          {/* DATABASE: User info displayed after login */}
          <div id="user-display" className="card info-card mt-3">
            <div className="card-body text-center">
              <p className="mb-0">
                Logged in as:{" "}
                <span id="username" className="fw-bold">
                  Guest
                </span>
              </p>
            </div>
          </div>

          {/* WEBSOCKET: Real-time active users count */}
          <div id="active-users" className="card info-card mt-3">
            <div className="card-body text-center">
              <p className="mb-0">
                Chemists online:{" "}
                <span id="online-count" className="badge bg-success">
                  3
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
