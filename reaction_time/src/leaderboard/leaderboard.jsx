import React, { useState, useEffect } from "react";
import { GameNotifier, GameEvent } from "../gameNotifier";
import "./leaderboard.css";

const RANK_CLASSES = ["rank-gold", "rank-silver", "rank-bronze"];

export function Leaderboard({ userName, players }) {
  const [connected, setConnected] = useState(true);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    function handleEvent(event) {
      if (event.type === GameEvent.System) {
        setConnected(event.value.msg === "connected");
      } else if (event.type === GameEvent.CardMastered && event.from !== userName) {
        setEvents((prev) => [
          ...prev.slice(-4),
          `${event.from} mastered ${event.value.cardName}`,
        ]);
      }
    }
    GameNotifier.addHandler(handleEvent);
    return () => GameNotifier.removeHandler(handleEvent);
  }, [userName]);

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
                <span className={`badge ${connected ? "bg-success" : "bg-danger"}`}>
                  {connected ? "Connected" : "Disconnected"}
                </span>
              </p>
            </div>
          </div>

          {events.length > 0 && (
            <div className="card info-card mb-3">
              <div className="card-body py-2">
                <p className="mb-1 fw-bold text-center">Live Activity</p>
                {events.map((msg, i) => (
                  <p key={i} className="mb-0 text-center small text-muted">
                    {msg}
                  </p>
                ))}
              </div>
            </div>
          )}

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
