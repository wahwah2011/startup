import React from "react";
import "./leaderboard.css";

export function Leaderboard({ userName }) {
  return (
    <main className="container">
      <div className="row justify-content-center">
        <div className="col-12">
          <h2 className="page-title text-center mb-4">Leaderboard</h2>

          {/* WEBSOCKET: Real-time connection status */}
          <div id="connection-status" className="card info-card mb-3">
            <div className="card-body d-flex align-items-center justify-content-center gap-2">
              <span className="status-indicator"></span>
              <p className="mb-0">
                Live Updates:{" "}
                <span id="ws-status" className="badge bg-success">
                  Connected
                </span>
              </p>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-dark table-striped table-hover">
              <thead>
                <tr>
                  <th scope="col">Rank</th>
                  <th scope="col">Chemist</th>
                  <th scope="col">Cards Memorized</th>
                </tr>
              </thead>
              <tbody>
                <tr className="rank-gold">
                  <td>1</td>
                  <td>Lavosier</td>
                  <td>34</td>
                </tr>
                <tr className="rank-silver">
                  <td>2</td>
                  <td>Curie</td>
                  <td>29</td>
                </tr>
                <tr className="rank-bronze">
                  <td>3</td>
                  <td>{userName || "You"}</td>
                  <td>0</td>
                </tr>
              </tbody>
            </table>
          </div>

          <section id="user-stats" className="card mt-4">
            <div className="card-header">
              <h3 className="mb-0 text-center fw-bold">
                {userName ? userName + "'s Stats" : "Your Stats"}
              </h3>
            </div>
            <div className="card-body">
              <div className="row text-center">
                <div className="col-6">
                  <p className="stat-label">Your Rank</p>
                  <p className="stat-value" id="user-rank">
                    3
                  </p>
                </div>
                <div className="col-6">
                  <p className="stat-label">Cards Mastered</p>
                  <p className="stat-value" id="total-cards">
                    0
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
