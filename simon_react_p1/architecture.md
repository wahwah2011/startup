# Simon HTML - Architecture Overview

## Project Description

This is a web-based implementation of the classic Simon memory game, where players repeat sequences of colored button flashes. The project is built as a multi-page HTML application and serves as a learning exercise for web development fundamentals.

## Technologies Used

### Core Technologies

- **HTML5** - Semantic markup for structure and content
- **SVG** - Scalable Vector Graphics for the game's colored button interface
- **Bash** - Deployment automation script

### HTML Features Utilized

- **Semantic HTML Elements**: `<header>`, `<main>`, `<footer>`, `<nav>`, `<menu>`
- **Forms**: User authentication interface with input fields
- **Tables**: Displaying high scores and game button layout
- **SVG Graphics**: Custom-drawn colored buttons using SVG paths
- **Meta Tags**: Viewport configuration for responsive behavior

## Code Structure

### Pages

The application consists of four primary HTML pages:

#### 1. **index.html** - Home/Login Page

- Entry point to the application
- Contains login and registration form
- Email and password input fields
- Links to all other pages via navigation menu

#### 2. **play.html** - Game Interface

- Main game page with interactive Simon buttons
- Four colored buttons (green, red, blue, yellow) rendered using SVG
- Score display and reset functionality
- Real-time notification list showing other players' activities
- Player name display

#### 3. **scores.html** - High Scores

- Displays leaderboard with top player scores
- Tabular data showing rank, name, score, and date
- Sample data includes international player names

#### 4. **about.html** - About Page

- Game description and rules
- Educational disclaimer about trademark usage
- Inspirational quote section
- Placeholder for random image

### Common Elements

All pages share consistent structure:

**Header**

- Application title: "Simon®"
- Navigation menu with links to all four pages
- Horizontal rule separator

**Footer**

- Author attribution
- GitHub repository link
- Horizontal rule separator

### File Organization

```
simon-html/
├── index.html          # Home/login page
├── play.html           # Game interface
├── scores.html         # High scores leaderboard
├── about.html          # About page with game info
├── README.md           # Project documentation
├── notes.md            # Development notes
├── deployFiles.sh      # Deployment script
└── LICENSE             # License file
```

## Design Patterns

### Multi-Page Application (MPA)

The application uses a traditional multi-page architecture where each page is a separate HTML document. Navigation between pages uses standard HTML anchor tags (`<a>`).

### Semantic HTML

The codebase emphasizes semantic HTML5 elements to provide meaningful structure:

- `<menu>` for navigation lists (semantic alternative to `<ul>`)
- `<main>` for primary content
- `<header>` and `<footer>` for page sections

### Static Content

Currently, all content is static HTML with hardcoded data. Notable static features:

- Sample high scores in scores.html
- Hardcoded notification list in play.html
- No external CSS or JavaScript files (pure HTML)

## SVG Button Design

The game interface uses inline SVG to create four distinctive colored buttons:

- **Green Button** (top-left): Quadratic curve from top-right
- **Red Button** (top-right): Quadratic curve from top-left
- **Blue Button** (bottom-left): Quadratic curve from bottom-right
- **Yellow Button** (bottom-right): Quadratic curve from bottom-left

Each button is created using SVG `<path>` elements with quadratic curves (Q command) to create rounded corners.

## Deployment

The project includes a deployment script (`deployFiles.sh`) that:

1. Accepts parameters for SSH key, hostname, and service name
2. Clears previous deployment on the target server
3. Copies all files to the remote server via SCP
4. Deploys to an Ubuntu server in a services directory structure

**Usage:**

```bash
./deployFiles.sh -k <pem-key-file> -h <hostname> -s <service-name>
```

## Current Limitations

As an HTML-only deliverable, the application has several limitations:

- **No Styling**: No CSS, relying on old-style HTML formatting (`<hr>`, `<br>`)
- **No Interactivity**: No JavaScript, buttons are non-functional
- **No Backend**: No server-side logic or data persistence
- **Static Data**: All scores and notifications are hardcoded

## Future Enhancements

Based on the README, future iterations will add:

- **CSS**: Styling, color schemes, and responsive design
- **JavaScript**: Game logic, button interactions, and dynamic content
- **Backend Services**: Node.js/Express server for data persistence
- **Database**: Store user accounts and high scores
- **WebSocket**: Real-time multiplayer notifications
- **Authentication**: Working login/registration system
- **React**: Modern frontend framework integration

## HTML Element Critique

This section analyzes the HTML elements used throughout the codebase, highlighting strengths, weaknesses, and suggesting improvements.

### 1. Navigation with `<menu>` Element

**Current Implementation:**

```html
<nav>
  <menu>
    <li><a href="index.html">Home</a></li>
    <li><a href="play.html">Play</a></li>
    <li><a href="scores.html">Scores</a></li>
    <li><a href="about.html">About</a></li>
  </menu>
</nav>
```

**Pros:**

- Semantically attempts to indicate interactive menu items
- Clean and simple structure
- Properly wrapped in `<nav>` element

**Cons:**

- `<menu>` has limited browser support and unclear semantic meaning for navigation
- Historically intended for toolbar-style context menus, not site navigation
- May confuse screen readers compared to standard list elements
- No ARIA attributes for accessibility

**Suggested Alternative:**

```html
<nav aria-label="Main navigation">
  <ul>
    <li><a href="index.html" aria-current="page">Home</a></li>
    <li><a href="play.html">Play</a></li>
    <li><a href="scores.html">Scores</a></li>
    <li><a href="about.html">About</a></li>
  </ul>
</nav>
```

**Improvements:**

- Uses standard `<ul>` which has universal support
- Adds `aria-label` for screen reader context
- Includes `aria-current="page"` to indicate active page

---

### 2. Login Form Structure

**Current Implementation:**

```html
<form method="get" action="play.html">
  <div>
    <span>@</span>
    <input type="text" placeholder="your@email.com" />
  </div>
  <div>
    <span>🔒</span>
    <input type="password" placeholder="password" />
  </div>
  <button type="submit">Login</button>
  <button type="submit">Create</button>
</form>
```

**Pros:**

- Uses semantic `<form>` element
- Correct input types (`password`)
- Visual icons provide user guidance

**Cons:**

- **CRITICAL**: Uses `method="get"` which exposes passwords in URL
- No `<label>` elements - fails accessibility requirements
- Inputs lack `name` attributes (won't submit data)
- No `id` attributes for input association
- Two submit buttons with same action - ambiguous behavior
- Icons are decorative but not marked as such for screen readers
- No validation attributes (`required`, `type="email"`)

**Suggested Alternative:**

```html
<form method="post" action="/api/login">
  <div>
    <label for="email">
      <span aria-hidden="true">@</span>
      Email
    </label>
    <input type="email" id="email" name="email" placeholder="your@email.com" required autocomplete="email" aria-describedby="email-hint" />
    <span id="email-hint" class="visually-hidden">Enter your registered email address</span>
  </div>
  <div>
    <label for="password">
      <span aria-hidden="true">🔒</span>
      Password
    </label>
    <input type="password" id="password" name="password" placeholder="password" required minlength="8" autocomplete="current-password" />
  </div>
  <button type="submit" name="action" value="login">Login</button>
  <button type="button" onclick="location.href='/register'">Create Account</button>
</form>
```

**Improvements:**

- Uses `method="post"` for security
- Proper `<label>` elements for accessibility
- Adds `name` attributes for form submission
- Distinguishes between login and registration actions
- Includes validation attributes
- Adds autocomplete for password managers
- Marks decorative icons with `aria-hidden`

---

### 3. Horizontal Rules for Visual Separation

**Current Implementation:**

```html
<header>
  <h1>Simon<sup>&reg;</sup></h1>
  <nav>...</nav>
  <hr />
</header>
```

**Pros:**

- Simple and works without CSS
- Creates visual separation
- Semantic element for thematic breaks

**Cons:**

- Relies on presentational HTML instead of CSS
- Creates unnecessary DOM elements
- Hard to style consistently across browsers
- The comment "old style HTML" acknowledges this is not best practice
- Not truly a thematic break in content, just visual styling

**Suggested Alternative:**

```html
<!-- With CSS -->
<header class="header">
  <h1>Simon<sup>&reg;</sup></h1>
  <nav>...</nav>
</header>

<style>
  .header {
    border-bottom: 1px solid #ccc;
    padding-bottom: 1rem;
    margin-bottom: 1rem;
  }
</style>
```

**Improvements:**

- Separates presentation from structure
- Easier to maintain and update styling
- Better browser consistency
- Reduces HTML clutter

---

### 4. Line Breaks for Spacing

**Current Implementation:**

```html
<ul class="notification">
  ...
</ul>
<br />
<div>
  <label for="count">Score</label>
  <input type="text" id="count" value="--" readonly />
</div>
<br />
<div>
  <button>Reset</button>
</div>
```

**Pros:**

- Works immediately without CSS
- Simple to implement

**Cons:**

- **Anti-pattern**: Using `<br>` for layout instead of spacing
- Not responsive - fixed spacing regardless of screen size
- Difficult to maintain consistent spacing
- Mixes presentation with structure
- Screen readers announce line breaks, creating noise

**Suggested Alternative:**

```html
<ul class="notification">
  ...
</ul>

<div class="score-section">
  <label for="count">Score</label>
  <input type="text" id="count" value="--" readonly />
</div>

<div class="controls">
  <button>Reset</button>
</div>

<style>
  .score-section {
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .controls {
    margin-top: 1.5rem;
  }
</style>
```

**Improvements:**

- Responsive spacing with CSS units
- Semantic structure without presentational elements
- Consistent spacing that can be adjusted globally
- Better accessibility - no unnecessary line break announcements

---

### 5. Table Layout for Game Buttons

**Current Implementation:**

```html
<table>
  <tr>
    <td>
      <button>
        <svg>...</svg>
      </button>
    </td>
    <td>
      <button>
        <svg>...</svg>
      </button>
    </td>
  </tr>
  <tr>
    ...
  </tr>
</table>
```

**Pros:**

- Creates a 2x2 grid layout without CSS
- Familiar structure

**Cons:**

- **Misuse of semantic HTML**: Tables should be for tabular data, not layout
- Fails accessibility - screen readers announce as data table
- Not responsive - difficult to adapt for mobile
- Verbose markup
- Against modern best practices

**Suggested Alternative (CSS Grid):**

```html
<div class="game-board" role="group" aria-label="Simon game buttons">
  <button aria-label="Green button" class="game-button game-button--green">
    <svg aria-hidden="true" viewBox="0 0 100 100" height="100" width="100">
      <path d="M 95,5 95,95 5,95 Q 5,5 95,5" fill="green" />
    </svg>
  </button>
  <button aria-label="Red button" class="game-button game-button--red">
    <svg aria-hidden="true" viewBox="0 0 100 100" height="100" width="100">
      <path d="M5,5 5,95 95,95 Q 95,5 5,5" fill="red" />
    </svg>
  </button>
  <button aria-label="Blue button" class="game-button game-button--blue">
    <svg aria-hidden="true" viewBox="0 0 100 100" height="100" width="100">
      <path d="M5,5 95,5 95,95 Q 5,95 5,5" fill="blue" />
    </svg>
  </button>
  <button aria-label="Yellow button" class="game-button game-button--yellow">
    <svg aria-hidden="true" viewBox="0 0 100 100" height="100" width="100">
      <path d="M95,5 5,5 5,95 Q 95,95 95,5" fill="yellow" />
    </svg>
  </button>
</div>

<style>
  .game-board {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
    max-width: 400px;
    margin: 0 auto;
  }

  @media (max-width: 480px) {
    .game-board {
      grid-template-columns: 1fr;
    }
  }
</style>
```

**Improvements:**

- Semantic: Uses `<div>` for layout, not table elements
- Responsive: Easy to change grid on mobile
- Accessible: Proper ARIA labels and roles
- Modern: Uses CSS Grid
- Cleaner markup

---

### 6. Score Input as Display

**Current Implementation:**

```html
<div>
  <label for="count">Score</label>
  <input type="text" id="count" value="--" readonly />
</div>
```

**Pros:**

- Proper label association with `for` attribute
- Readonly prevents user modification
- Familiar input styling

**Cons:**

- Semantic misuse: `<input>` implies user input, even when readonly
- Screen readers may confuse users ("editable" announcement despite readonly)
- Not the most appropriate element for display-only data
- `type="text"` is too generic

**Suggested Alternatives:**

**Option 1: Output Element (Best for Calculated Values)**

```html
<div class="score-display">
  <span id="score-label">Score</span>
  <output id="count" for="game-board" aria-labelledby="score-label">0</output>
</div>
```

**Option 2: Simple Span/Div (Best for Simple Display)**

```html
<div class="score-display">
  <span class="score-label">Score</span>
  <span class="score-value" id="count" aria-live="polite">0</span>
</div>
```

**Option 3: Meter Element (Best for Progress Indication)**

```html
<div class="score-display">
  <label for="count">Score</label>
  <meter id="count" min="0" max="100" value="0" title="Current score">0</meter>
  <span id="count-value">0</span>
</div>
```

**Improvements:**

- `<output>` semantically indicates calculated result
- `aria-live="polite"` announces score updates to screen readers
- More appropriate semantics for read-only display
- Meter shows visual progress bar

---

### 7. SVG Button Implementation

**Current Implementation:**

```html
<button>
  <svg aria-hidden="true" viewBox="0 0 100 100" height="100" width="100">
    <path d="M 95,5 95,95 5,95 Q 5,5 95,5" fill="green" />
  </svg>
</button>
```

**Pros:**

- SVG properly hidden from screen readers with `aria-hidden="true"`
- Scalable graphics
- Inline SVG for immediate rendering
- Creative use of paths for unique button shapes

**Cons:**

- Button has no accessible label
- No text alternative for color-blind users
- Fixed dimensions (100x100) not responsive
- Inline SVG repeated 4 times (code duplication)
- No visual feedback for interactions

**Suggested Alternative:**

```html
<button class="game-button" data-color="green" aria-label="Green button - Top left" data-position="1">
  <svg aria-hidden="true" viewBox="0 0 100 100" width="100%" height="100%">
    <path d="M 95,5 95,95 5,95 Q 5,5 95,5" fill="currentColor" />
  </svg>
  <span class="visually-hidden">Green</span>
</button>

<style>
  .game-button {
    position: relative;
    padding: 0;
    border: 2px solid #333;
    background: transparent;
    cursor: pointer;
    transition:
      transform 0.1s,
      filter 0.1s;
  }

  .game-button[data-color='green'] {
    color: green;
  }

  .game-button:hover,
  .game-button:focus {
    transform: scale(1.05);
    filter: brightness(1.2);
  }

  .game-button:active {
    transform: scale(0.95);
  }

  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
</style>
```

**Improvements:**

- Accessible labels for screen readers
- Hidden text provides context
- Responsive SVG with percentage dimensions
- Color abstracted with `currentColor` and data attributes
- Visual feedback for interactions
- Better keyboard navigation support

---

### 8. Notification List

**Current Implementation:**

```html
<ul class="notification">
  <li class="player-name">Tim started a new game</li>
  <li class="player-name">Ada started a new game</li>
  <li class="player-name">Tim scored 337</li>
</ul>
```

**Pros:**

- Semantic use of `<ul>` for list
- Simple structure

**Cons:**

- Class name mismatch: `class="player-name"` on `<li>` instead of span
- No ARIA live region for dynamic updates
- No timestamps or additional context
- Static hardcoded data
- No visual distinction between notification types

**Suggested Alternative:**

```html
<section class="notifications" aria-labelledby="notifications-heading">
  <h2 id="notifications-heading" class="visually-hidden">Player Activity</h2>
  <ul class="notification-list" role="feed" aria-live="polite" aria-atomic="false">
    <li class="notification-item" role="article">
      <span class="player-name">Tim</span>
      <span class="notification-text">started a new game</span>
      <time datetime="2026-01-19T10:30:00" class="notification-time">2 min ago</time>
    </li>
    <li class="notification-item" role="article">
      <span class="player-name">Ada</span>
      <span class="notification-text">started a new game</span>
      <time datetime="2026-01-19T10:28:00" class="notification-time">4 min ago</time>
    </li>
    <li class="notification-item notification-item--score" role="article">
      <span class="player-name">Tim</span>
      <span class="notification-text">scored</span>
      <strong class="score">337</strong>
      <time datetime="2026-01-19T10:25:00" class="notification-time">7 min ago</time>
    </li>
  </ul>
</section>
```

**Improvements:**

- `aria-live="polite"` announces new notifications
- Semantic `<time>` elements with machine-readable dates
- Better structure separating player names from actions
- Roles indicate feed of articles
- Section with accessible heading
- Classes match semantic meaning

---

### 9. Scores Table

**Current Implementation:**

```html
<table>
  <thead>
    <tr>
      <th>#</th>
      <th>Name</th>
      <th>Score</th>
      <th>Date</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td>도윤 이</td>
      <td>34</td>
      <td>May 20, 2021</td>
    </tr>
    <!-- more rows -->
  </tbody>
</table>
```

**Pros:**

- **Excellent use case for tables** - truly tabular data
- Proper `<thead>` and `<tbody>` structure
- Headers are concise and clear
- Good semantic HTML

**Cons:**

- Missing `<caption>` for table description
- No `scope` attributes on headers
- Inconsistent date format (text vs. machine-readable)
- No sorting capabilities indicated
- Missing ARIA attributes for enhanced accessibility

**Suggested Alternative:**

```html
<table class="scores-table">
  <caption>
    Top Player High Scores
  </caption>
  <thead>
    <tr>
      <th scope="col" aria-sort="none">Rank</th>
      <th scope="col" aria-sort="none">Player Name</th>
      <th scope="col" aria-sort="descending">Score</th>
      <th scope="col" aria-sort="none">Date Achieved</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td>도윤 이</td>
      <td data-value="34">34</td>
      <td>
        <time datetime="2021-05-20">May 20, 2021</time>
      </td>
    </tr>
    <tr>
      <td>2</td>
      <td>Annie James</td>
      <td data-value="29">29</td>
      <td>
        <time datetime="2021-06-02">June 2, 2021</time>
      </td>
    </tr>
    <tr>
      <td>3</td>
      <td>Gunter Spears</td>
      <td data-value="7">7</td>
      <td>
        <time datetime="2020-07-03">July 3, 2020</time>
      </td>
    </tr>
  </tbody>
</table>
```

**Improvements:**

- `<caption>` provides table context
- `scope="col"` clarifies header relationships
- `aria-sort` indicates current sort state
- `<time>` elements with `datetime` attribute
- `data-value` attributes enable easier sorting

---

### 10. Image Placeholder

**Current Implementation:**

```html
<div id="picture" class="picture-box">
  <img width="400px" src="placeholder.jpg" alt="random" />
</div>
```

**Pros:**

- Includes `alt` attribute
- Sets explicit width

**Cons:**

- Uses `px` in HTML attribute (should be CSS)
- Alt text "random" is not descriptive
- No height attribute (causes layout shift)
- No loading optimization
- No responsive image handling
- Missing error handling for broken image

**Suggested Alternative:**

```html
<figure class="picture-box">
  <img src="placeholder.jpg" alt="A random inspirational image to motivate Simon players" width="400" height="300" loading="lazy" decoding="async" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';" />
  <div class="image-fallback" style="display: none;">
    <p>Image not available</p>
  </div>
  <figcaption class="visually-hidden">Inspirational image</figcaption>
</figure>

<style>
  .picture-box img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  @media (max-width: 768px) {
    .picture-box img {
      width: 100%;
    }
  }
</style>
```

**Improvements:**

- Semantic `<figure>` and `<figcaption>` elements
- Descriptive alt text
- Both width and height prevent layout shift
- `loading="lazy"` defers offscreen images
- Responsive sizing with CSS
- Error handling with fallback
- Remove `px` units from HTML attributes

---

## Summary of Key Issues

1. **Security**: Form uses GET instead of POST for password submission
2. **Accessibility**: Missing labels, ARIA attributes, and semantic structure in many places
3. **Semantics**: Misuse of tables for layout, inappropriate use of `<menu>`
4. **Presentation in HTML**: Over-reliance on `<hr>` and `<br>` for styling
5. **Validation**: Missing form validation and input attributes
6. **Responsiveness**: Fixed dimensions and table layouts don't adapt well to mobile

## General Recommendations

1. **Separate Concerns**: Move all styling to CSS
2. **Enhance Accessibility**: Add ARIA labels, roles, and live regions
3. **Use Semantic HTML**: Choose elements based on meaning, not appearance
4. **Add Validation**: Include HTML5 form validation attributes
5. **Plan for Interactivity**: Structure HTML to support future JavaScript enhancement
6. **Consider Performance**: Add lazy loading, async decoding, and optimize assets

## Educational Context

This project is part of a progressive web development course (CS 260) where functionality is incrementally added as new technologies are learned. The current HTML-only version represents the foundational deliverable, with subsequent iterations planned to incorporate CSS, JavaScript, backend services, and modern frameworks.
