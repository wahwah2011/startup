import React from "react";
import "./leaderboard.css";

const RANK_CLASSES = ["rank-gold", "rank-silver", "rank-bronze"];

export function Leaderboard({ userName, players }) {
  const userIndex = players.findIndex((p) => p.name === userName);
  const userRank = userIndex >= 0 ? userIndex + 1 : "-";
  const userEntry = userIndex >= 0 ? players[userIndex] : null;

  return (
    <main className="container">
      <div className="row justify-content-center">
        <div className="col-12">
          <h2 className="page-title text-center mb-4">Leaderboard</h2>

          <div id="connection-status" className="card info-card mb-3">
            <div className="card-body d-flex align-items-center justify-content-center gap-2">
              <span className="status-indicator"></span>
              <p className="mb-0">
                Live Updates:{" "}
                <span className="badge bg-success">Connected</span>
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
                {players.map((player, index) => (
                  <tr key={player.name} className={RANK_CLASSES[index] || ""}>
                    <td>{index + 1}</td>
                    <td>
                      {player.name === userName
                        ? player.name + " (You)"
                        : player.name}
                    </td>
                    <td>{player.score}</td>
                  </tr>
                ))}
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
                  <p className="stat-value">{userRank}</p>
                </div>
                <div className="col-6">
                  <p className="stat-label">Cards Mastered</p>
                  <p className="stat-value">
                    {userEntry ? userEntry.score : 0}
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
