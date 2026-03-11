import React, { useState, useEffect } from 'react';
import './about.css';

function decodeHtml(html) {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
}

function useTriviaQuestion() {
  const [trivia, setTrivia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchQuestion() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('https://opentdb.com/api.php?amount=1&category=17&type=multiple');
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        const q = data.results[0];
        const answers = [...q.incorrect_answers, q.correct_answer]
          .map(decodeHtml)
          .sort(() => Math.random() - 0.5);
        setTrivia({
          question: decodeHtml(q.question),
          correctAnswer: decodeHtml(q.correct_answer),
          answers,
          difficulty: q.difficulty,
        });
      }
    } catch {
      setError('Could not load trivia. Try again later.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchQuestion(); }, []);

  return { trivia, loading, error, fetchQuestion };
}

export function About() {
  const { trivia, loading, error, fetchQuestion } = useTriviaQuestion();
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);

  function handleAnswer(answer) {
    if (revealed) return;
    setSelected(answer);
    setRevealed(true);
  }

  function handleNewQuestion() {
    setSelected(null);
    setRevealed(false);
    fetchQuestion();
  }

  return (
    <main className="container">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card about-card">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">About Reaction Time</h2>
              <div className="text-center">
                <p className="lead">
                  Reaction Time is a competitive chemistry study tool that gamifies the memorization of
                  chemical nomenclature and organic structures.
                </p>
                <p>
                  View Lewis structures, guess the compound name,
                  and watch your score update on the live leaderboard in real time.
                </p>
              </div>
              <hr className="my-4" />
              <div className="text-center">
                <p className="mb-1"><strong>Created by</strong></p>
                <p className="author-name">Elijah Thompson</p>
                <p className="text-muted">CS 260 - Web Programming</p>
              </div>
            </div>
          </div>

          <div className="card about-card trivia-card mt-4">
            <div className="card-body">
              <h3 className="card-title text-center mb-3">Science Trivia</h3>
              <p className="text-center text-muted mb-3">
                Powered by <a href="https://opentdb.com/" target="_blank" rel="noreferrer">Open Trivia DB</a>
              </p>

              {loading && <p className="text-center text-muted">Loading question...</p>}
              {error && <p className="text-center text-danger">{error}</p>}

              {!loading && trivia && (
                <>
                  <p className="trivia-question">{trivia.question}</p>
                  <span className={'badge trivia-difficulty mb-3 ' + trivia.difficulty}>
                    {trivia.difficulty}
                  </span>

                  <div className="trivia-answers">
                    {trivia.answers.map((answer) => {
                      let btnClass = 'btn btn-outline-light trivia-btn';
                      if (revealed) {
                        if (answer === trivia.correctAnswer) {
                          btnClass = 'btn trivia-btn trivia-correct';
                        } else if (answer === selected) {
                          btnClass = 'btn trivia-btn trivia-wrong';
                        }
                      }
                      return (
                        <button
                          key={answer}
                          className={btnClass}
                          onClick={() => handleAnswer(answer)}
                          disabled={revealed}
                        >
                          {answer}
                        </button>
                      );
                    })}
                  </div>

                  {revealed && (
                    <div className="text-center mt-3">
                      <p className={selected === trivia.correctAnswer ? 'text-success fw-bold' : 'text-danger fw-bold'}>
                        {selected === trivia.correctAnswer ? 'Correct!' : `Wrong — the answer was "${trivia.correctAnswer}"`}
                      </p>
                      <button className="btn btn-primary btn-sm" onClick={handleNewQuestion}>
                        Next Question
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
