import React from "react";
import ReactDOM from "react-dom/client";
import "./app.css";

export default function App() {
  return (
    <div className="body bg-dark text-light">
      <header className="container-fluid">
        <nav className="navbar fixed-top navbar-dark">
          <a className="navbar-brand" href="#">
            Simon<sup>&reg;</sup>
          </a>
          <menu className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link active" href="index.html">
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="play.html">
                Play
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="scores.html">
                Scores
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="about.html">
                About
              </a>
            </li>
          </menu>
        </nav>
      </header>

      <main className="container-fluid bg-secondary text-center">
        App Components Go Here{" "}
      </main>

      <footer className="bg-dark text-white-50">
        <div className="container-fluid">
          <span className="text-reset">Author Name(s)</span>
          <a
            className="text-reset"
            href="https://github.com/webprogramming260/simon-css"
          >
            Source
          </a>
        </div>
      </footer>
    </div>
  );
}
