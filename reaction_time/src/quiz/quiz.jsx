import React, { useState, useEffect, useRef } from "react";
import { flashcards } from "../data/flashcards";
import "./quiz.css";

function findNextUnmastered(masteredIds, startIndex) {
  for (let i = 0; i < flashcards.length; i++) {
    const idx = (startIndex + i) % flashcards.length;
    if (!masteredIds.includes(flashcards[idx].id)) {
      return idx;
    }
  }
  return -1;
}

export function Quiz({ userName, players, onScoreUpdate }) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [cardsMastered, setCardsMastered] = useState(0);
  const [masteredIds, setMasteredIds] = useState([]);
  const [missedIds, setMissedIds] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [notification, setNotification] = useState(null);
  const prevPlayersRef = useRef(players);

  useEffect(() => {
    const prev = prevPlayersRef.current;
    prevPlayersRef.current = players;

    if (prev.length === 0) return;
    for (let i = 0; i < players.length; i++) {
      const p = players[i];
      if (p.isUser) continue;
      const old = prev.find((o) => o.name === p.name);
      if (old && p.score > old.score) {
        setNotification(p.name + " just mastered a card!");
        setTimeout(() => setNotification(null), 2500);
        break;
      }
    }
  }, [players]);

  useEffect(() => {
    const saved = localStorage.getItem("quizProgress");
    if (saved) {
      const data = JSON.parse(saved);
      if (data.userName === userName) {
        const restoredMastered = data.masteredIds || [];
        const restoredScore = data.score || 0;
        setScore(restoredScore);
        setCardsMastered(data.cardsMastered || 0);
        setMasteredIds(restoredMastered);
        setMissedIds(data.missedIds || []);
        onScoreUpdate(restoredScore);
        const resumeIndex = findNextUnmastered(
          restoredMastered,
          data.currentCardIndex || 0,
        );
        if (resumeIndex >= 0) {
          setCurrentCardIndex(resumeIndex);
        }
      }
    }
    setLoaded(true);
  }, [userName]);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(
      "quizProgress",
      JSON.stringify({
        userName,
        score,
        cardsMastered,
        masteredIds,
        missedIds,
        currentCardIndex,
      }),
    );
  }, [
    score,
    cardsMastered,
    masteredIds,
    missedIds,
    currentCardIndex,
    userName,
    loaded,
  ]);

  const allMastered = masteredIds.length >= flashcards.length;
  const currentCard = allMastered ? null : flashcards[currentCardIndex];
  const miniBoard = players.slice(0, 3);

  function handleSubmit(e) {
    e.preventDefault();
    if (allMastered || !userAnswer.trim()) return;

    const correct =
      userAnswer.trim().toLowerCase() === currentCard.name.toLowerCase();

    if (correct) {
      const newScore = score + 1;
      setScore(newScore);
      onScoreUpdate(newScore);
      const newMastered = masteredIds.includes(currentCard.id)
        ? masteredIds
        : [...masteredIds, currentCard.id];

      if (!masteredIds.includes(currentCard.id)) {
        setCardsMastered((c) => c + 1);
        setMasteredIds(newMastered);
      }
      setMissedIds((prev) => prev.filter((id) => id !== currentCard.id));
      setFeedback("correct");

      setTimeout(() => {
        const nextIdx = findNextUnmastered(newMastered, currentCardIndex + 1);
        if (nextIdx < 0) {
          setCurrentCardIndex(0);
        } else {
          setCurrentCardIndex(nextIdx);
        }
        setUserAnswer("");
        setFeedback(null);
      }, 1000);
    } else {
      if (!missedIds.includes(currentCard.id)) {
        setMissedIds((prev) => [...prev, currentCard.id]);
      }
      setFeedback("incorrect");
      setTimeout(() => setFeedback(null), 1500);
    }
  }

  function handleRestart() {
    setCurrentCardIndex(0);
    setUserAnswer("");
    setFeedback(null);
    setScore(0);
    setCardsMastered(0);
    setMasteredIds([]);
    setMissedIds([]);
    onScoreUpdate(0);
  }

  function getInputClass() {
    let cls = "form-control";
    if (feedback === "correct") cls += " is-valid";
    if (feedback === "incorrect") cls += " is-invalid";
    return cls;
  }

  const needsReview = missedIds.filter(
    (id) => !masteredIds.includes(id),
  ).length;

  return (
    <main className="container-fluid">
      <div className="row justify-content-center">
        {/* Main Quiz Area */}
        <div className="col-12 col-lg-8">
          <div className="players card info-card mb-3">
            <div className="card-body">
              Chemist:{" "}
              <span className="player-name fw-bold text-light">{userName}</span>
            </div>
          </div>

          <section id="quiz-container" className="card">
            <div className="card-body">
              <div className="quiz-layout">
                {allMastered ? (
                  <div className="text-center py-4">
                    <h3 className="text-light mb-3">All Cards Mastered!</h3>
                    <p className="text-muted">
                      You've mastered all {flashcards.length} compounds.
                    </p>
                    <button className="btn btn-primary" onClick={handleRestart}>
                      Restart Deck
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="structure-container text-center">
                      <img
                        id="lewis-structure"
                        src={currentCard.image}
                        alt="Lewis Structure"
                        className="lewis-image"
                      />
                    </div>

                    <form onSubmit={handleSubmit}>
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
                            className={getInputClass()}
                            placeholder="Enter compound name"
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            disabled={feedback === "correct"}
                          />
                          <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={feedback === "correct"}
                          >
                            Submit
                          </button>
                        </div>
                        {feedback === "incorrect" && (
                          <div className="text-danger mt-2 text-center fw-bold">
                            Try again!
                          </div>
                        )}
                        {feedback === "correct" && (
                          <div className="text-success mt-2 text-center fw-bold">
                            Correct!
                          </div>
                        )}
                      </div>
                    </form>
                  </>
                )}

                <div id="score-display" className="row mt-4">
                  <div className="col-4">
                    <div className="score-card text-center">
                      <p className="score-label mb-1">Your Score</p>
                      <p className="score-value">{score}</p>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="score-card text-center">
                      <p className="score-label mb-1">Mastered</p>
                      <p className="score-value">{cardsMastered}</p>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="score-card text-center">
                      <p className="score-label mb-1">Needs Review</p>
                      <p
                        className="score-value"
                        style={{
                          color: needsReview > 0 ? "#e74c3c" : undefined,
                        }}
                      >
                        {needsReview}
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
          <div className="sidebar-wrapper">
            <aside id="mini-leaderboard" className="card">
              <div className="card-header">
                <h3 className="mb-0">Top Chemists</h3>
              </div>
              <ul className="list-group list-group-flush">
                {miniBoard.map((player, index) => (
                  <li
                    key={player.name}
                    className={
                      "list-group-item d-flex justify-content-between" +
                      (player.isUser ? " active-user" : "")
                    }
                  >
                    <span>
                      {index + 1}. {player.isUser ? userName : player.name}
                    </span>
                    <span
                      className={
                        "badge " + (player.isUser ? "bg-success" : "bg-primary")
                      }
                    >
                      {player.score}
                    </span>
                  </li>
                ))}
              </ul>
            </aside>

            {notification && (
              <div
                className="sidebar-notification alert alert-info text-center py-2 mb-0"
                role="alert"
              >
                {notification}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
