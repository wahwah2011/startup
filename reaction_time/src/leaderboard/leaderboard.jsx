import React, { useState, useEffect } from 'react';
import { MOCK_PLAYERS, RANK_CLASSES, buildLeaderboard } from '../data/players';
import './leaderboard.css';

export function Leaderboard({ userName }) {
  const [players, setPlayers] = useState([]);
  const [notification, setNotification] = useState(null);

  function getUserScore() {
    const saved = localStorage.getItem('quizProgress');
    if (saved) {
      const data = JSON.parse(saved);
      if (data.userName === userName) {
        return data.score || 0;
      }
    }
    return 0;
  }

  useEffect(() => {
    setPlayers(buildLeaderboard(userName, getUserScore(), MOCK_PLAYERS));
  }, [userName]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlayers((prev) => {
        const updated = prev.map((p) => ({ ...p }));
        const nonUserPlayers = updated.filter((p) => !p.isUser);
        if (nonUserPlayers.length === 0) return prev;

        const target = nonUserPlayers[Math.floor(Math.random() * nonUserPlayers.length)];
        target.score += 1;

        setNotification(target.name + ' just mastered a card!');
        setTimeout(() => setNotification(null), 2500);

        updated.sort((a, b) => b.score - a.score);
        return updated;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const userEntry = players.find((p) => p.isUser);
  const userRank = userEntry ? players.indexOf(userEntry) + 1 : '-';

  return (
    <main className="container">
      <div className="row justify-content-center">
        <div className="col-12">
          <h2 className="page-title text-center mb-4">Leaderboard</h2>

          <div id="connection-status" className="card info-card mb-3">
            <div className="card-body d-flex align-items-center justify-content-center gap-2">
              <span className="status-indicator"></span>
              <p className="mb-0">Live Updates: <span className="badge bg-success">Connected</span></p>
            </div>
          </div>

          {notification && (
            <div className="alert alert-info text-center py-2 mb-3" role="alert">
              {notification}
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
                  <tr key={player.name} className={RANK_CLASSES[index] || ''}>
                    <td>{index + 1}</td>
                    <td>{player.isUser ? player.name + ' (You)' : player.name}</td>
                    <td>{player.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <section id="user-stats" className="card mt-4">
            <div className="card-header">
              <h3 className="mb-0 text-center fw-bold">{userName ? userName + "'s Stats" : "Your Stats"}</h3>
            </div>
            <div className="card-body">
              <div className="row text-center">
                <div className="col-6">
                  <p className="stat-label">Your Rank</p>
                  <p className="stat-value">{userRank}</p>
                </div>
                <div className="col-6">
                  <p className="stat-label">Cards Mastered</p>
                  <p className="stat-value">{userEntry ? userEntry.score : 0}</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
