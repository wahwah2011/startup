import React, { useState } from 'react';
import { flashcards } from '../data/flashcards';
import './quiz.css';

export function Quiz({ userName }) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [deckComplete, setDeckComplete] = useState(false);

  const currentCard = deckComplete ? null : flashcards[currentCardIndex];

  function handleSubmit(e) {
    e.preventDefault();
    if (deckComplete || !userAnswer.trim()) return;

    const correct = userAnswer.trim().toLowerCase() === currentCard.name.toLowerCase();

    if (correct) {
      setFeedback('correct');
      setTimeout(() => {
        const nextIndex = currentCardIndex + 1;
        if (nextIndex >= flashcards.length) {
          setDeckComplete(true);
        } else {
          setCurrentCardIndex(nextIndex);
        }
        setUserAnswer('');
        setFeedback(null);
      }, 1000);
    } else {
      setFeedback('incorrect');
      setTimeout(() => setFeedback(null), 1500);
    }
  }

  function handleRestart() {
    setCurrentCardIndex(0);
    setUserAnswer('');
    setFeedback(null);
    setDeckComplete(false);
  }

  function getInputClass() {
    let cls = 'form-control';
    if (feedback === 'correct') cls += ' is-valid';
    if (feedback === 'incorrect') cls += ' is-invalid';
    return cls;
  }

  return (
    <main className="container-fluid">
      <div className="row justify-content-center">
        {/* Main Quiz Area */}
        <div className="col-12 col-lg-8">
          <div className="players card info-card mb-3">
            <div className="card-body">
              Chemist:{' '}
              <span className="player-name fw-bold text-light">{userName}</span>
              <span className="ms-3 text-muted">
                Card {Math.min(currentCardIndex + 1, flashcards.length)} of {flashcards.length}
              </span>
            </div>
          </div>

          <section id="quiz-container" className="card">
            <div className="card-body">
              <div className="quiz-layout">
                {deckComplete ? (
                  <div className="text-center py-4">
                    <h3 className="text-light mb-3">Deck Complete!</h3>
                    <p className="text-muted">You've gone through all {flashcards.length} cards.</p>
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
                          <label htmlFor="compound-input" className="input-group-text">
                            Compound Name:
                          </label>
                          <input
                            type="text"
                            id="compound-input"
                            className={getInputClass()}
                            placeholder="Enter compound name"
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            disabled={feedback === 'correct'}
                          />
                          <button type="submit" className="btn btn-primary" disabled={feedback === 'correct'}>
                            Submit
                          </button>
                        </div>
                        {feedback === 'incorrect' && (
                          <div className="text-danger mt-2 text-center fw-bold">Try again!</div>
                        )}
                        {feedback === 'correct' && (
                          <div className="text-success mt-2 text-center fw-bold">Correct!</div>
                        )}
                      </div>
                    </form>
                  </>
                )}

                <div id="score-display" className="row mt-4">
                  <div className="col-6">
                    <div className="score-card text-center">
                      <p className="score-label mb-1">Your Score</p>
                      <p className="score-value" id="user-score">0</p>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="score-card text-center">
                      <p className="score-label mb-1">Cards Mastered</p>
                      <p className="score-value" id="cards-mastered">0</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Mini Leaderboard Sidebar */}
        <div className="col-12 col-lg-3 mt-3 mt-lg-0">
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
              <li className="list-group-item d-flex justify-content-between active-user">
                <span>3. {userName}</span>
                <span className="badge bg-success">0</span>
              </li>
            </ul>
          </aside>
        </div>
      </div>
    </main>
  );
}
