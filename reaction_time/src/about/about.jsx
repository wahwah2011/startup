import React from 'react';
import './about.css';

export function About() {
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
        </div>
      </div>
    </main>
  );
}
