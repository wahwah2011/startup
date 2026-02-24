import React from "react";
import "./quiz.css";

export function Quiz() {
  return (
    <main className="container-fluid">
      <div className="row justify-content-center">
        {/* Main Quiz Area */}
        <div className="col-12 col-lg-8">
          {/* DATABASE: Current user info from database */}
          <div className="players card info-card mb-3">
            <div className="card-body">
              Chemist:{" "}
              <span className="player-name fw-bold text-light">Pasteur</span>
            </div>
          </div>

          <section id="quiz-container" className="card">
            <div className="card-body">
              <div className="quiz-layout">
                {/* 3RD PARTY API: PubChem API will fetch molecular structure images */}
                <div className="structure-container text-center">
                  <img
                    id="lewis-structure"
                    src="/images/acetic_acid.png"
                    alt="Lewis Structure"
                    className="lewis-image"
                  />
                </div>

                <div id="answer-section" className="mt-4">
                  <div className="input-group">
                    <label
                      htmlFor="compound-input"
                      className="input-group-text"
                    >
                      Compound Name:
                    </label>
                    <input
                      type="text"
                      id="compound-input"
                      name="compound-input"
                      className="form-control"
                      placeholder="Enter compound name"
                    />
                    <button type="submit" className="btn btn-primary">
                      Submit
                    </button>
                  </div>
                </div>

                {/* DATABASE: User score saved to database */}
                <div id="score-display" className="row mt-4">
                  <div className="col-6">
                    <div className="score-card text-center">
                      <p className="score-label mb-1">Your Score</p>
                      <p className="score-value" id="user-score">
                        0
                      </p>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="score-card text-center">
                      <p className="score-label mb-1">Cards Mastered</p>
                      <p className="score-value" id="cards-mastered">
                        0
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Mini Leaderboard Sidebar */}
        <div className="col-12 col-lg-3 mt-3 mt-lg-0">
          {/* WEBSOCKET: Live mini-leaderboard updated in real-time */}
          <aside id="mini-leaderboard" className="card">
            <div className="card-header">
              <h3 className="mb-0">Top Chemists</h3>
            </div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item d-flex justify-content-between">
                <span>1. Lavosier</span>
                <span className="badge bg-primary">34</span>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span>2. Curie</span>
                <span className="badge bg-primary">29</span>
              </li>
              {/* going to need to update this to dynamically determine current user's standing and display it with the correct badge color */}
              <li className="list-group-item d-flex justify-content-between active-user">
                <span>3. You</span>
                <span className="badge bg-success">0</span>
              </li>
            </ul>
          </aside>
        </div>
      </div>
    </main>
  );
}
