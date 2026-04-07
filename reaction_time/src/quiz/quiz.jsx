import React, { useState, useEffect, useRef } from "react";
import { flashcards } from "../data/flashcards";
import { GameNotifier, GameEvent } from "../gameNotifier";
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
  const [funFact, setFunFact] = useState(null);
  const [showFact, setShowFact] = useState(false);
  const nextCardRef = useRef(null);

  useEffect(() => {
    function handleEvent(event) {
      if (event.type === GameEvent.CardMastered && event.from !== userName) {
        setNotification(`${event.from} just mastered ${event.value.cardName}!`);
        setTimeout(() => setNotification(null), 3000);
      }
    }
    GameNotifier.addHandler(handleEvent);
    return () => GameNotifier.removeHandler(handleEvent);
  }, [userName]);

  useEffect(() => {
    fetch("/api/progress")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          const restoredMastered = data.masteredIds || [];
          const restoredScore = data.score || 0;
          const restoredCardsMastered = data.cardsMastered || 0;
          setScore(restoredScore);
          setCardsMastered(restoredCardsMastered);
          setMasteredIds(restoredMastered);
          setMissedIds(data.missedIds || []);
          onScoreUpdate(restoredCardsMastered);
          const resumeIndex = findNextUnmastered(
            restoredMastered,
            data.currentCardIndex || 0,
          );
          if (resumeIndex >= 0) {
            setCurrentCardIndex(resumeIndex);
          }
        }
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, [userName]);

  useEffect(() => {
    if (!loaded) return;
    fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        score,
        cardsMastered,
        masteredIds,
        missedIds,
        currentCardIndex,
      }),
    }).catch(() => {});
  }, [score, cardsMastered, masteredIds, missedIds, currentCardIndex, loaded]);

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
      const newMastered = masteredIds.includes(currentCard.id)
        ? masteredIds
        : [...masteredIds, currentCard.id];

      if (!masteredIds.includes(currentCard.id)) {
        const newCardsMastered = cardsMastered + 1;
        setCardsMastered(newCardsMastered);
        setMasteredIds(newMastered);
        onScoreUpdate(newCardsMastered);
        GameNotifier.broadcastEvent(userName, GameEvent.CardMastered, {
          cardName: currentCard.name,
          score: newCardsMastered,
        });
      }
      setMissedIds((prev) => prev.filter((id) => id !== currentCard.id));
      setFeedback("correct");

      const nextIdx = findNextUnmastered(newMastered, currentCardIndex + 1);
      nextCardRef.current = nextIdx < 0 ? 0 : nextIdx;

      fetch("https://uselessfacts.jsph.pl/random.json?language=en")
        .then((res) => res.json())
        .then((data) => setFunFact(data.text))
        .catch(() => setFunFact(null));

      setTimeout(() => setShowFact(true), 800);
    } else {
      if (!missedIds.includes(currentCard.id)) {
        setMissedIds((prev) => [...prev, currentCard.id]);
      }
      setFeedback("incorrect");
      setTimeout(() => setFeedback(null), 1500);
    }
  }

  function handleNextCard() {
    setCurrentCardIndex(nextCardRef.current);
    setUserAnswer("");
    setFeedback(null);
    setFunFact(null);
    setShowFact(false);
  }

  function handleRestart() {
    setCurrentCardIndex(0);
    setUserAnswer("");
    setFeedback(null);
    setScore(0);
    setCardsMastered(0);
    setMasteredIds([]);
    setMissedIds([]);
    setFunFact(null);
    setShowFact(false);
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
                {showFact ? (
                  <div className="fun-fact-interstitial text-center py-4">
                    <h4 className="text-success mb-3">Correct!</h4>
                    {funFact ? (
                      <>
                        <p className="fun-fact-label">Did you know?</p>
                        <p className="fun-fact-text">{funFact}</p>
                      </>
                    ) : (
                      <p className="text-muted">Loading fact...</p>
                    )}
                    <button
                      className="btn btn-primary mt-3"
                      onClick={handleNextCard}
                    >
                      Next Card
                    </button>
                  </div>
                ) : allMastered ? (
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
                      (player.name === userName ? " active-user" : "")
                    }
                  >
                    <span>
                      {index + 1}. {player.name}
                    </span>
                    <span
                      className={
                        "badge " +
                        (player.name === userName ? "bg-success" : "bg-primary")
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
