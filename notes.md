# CS 260 Notes

[My startup - Simon](https://simon.cs260.click)

## Helpful links

- [Course instruction](https://github.com/webprogramming260)
- [Canvas](https://byu.instructure.com)
- [MDN](https://developer.mozilla.org)

Here, I am testing to ensure that git commits from VSCode work as they should.

## AWS

My IP address is: 54.81.96.130
Launching my AMI I initially put it on a private subnet. Even though it had a public IP address and the security group was right, I wasn't able to connect to it.

## Caddy

No problems worked just like it said in the [instruction](https://github.com/webprogramming260/.github/blob/main/profile/webServers/https/https.md).

## HTML

HTML works through nodes (parent, child).

Ensure header and footer show (redundantly) on each page.

I am deciding to fetch lewis structure data from the database, rather than connecting to a third-party API (PubChem) and retreiving the structures from there. I'll have to account for screen size/resolution with this, as I will simply be displaying PNGs of lewis structures.

## CSS

I'm going to need to keep track of usernames/consider the need for emails in the future--do I necessarily require email to login, or should I just use a simple username? that would certainly make it easier to display names on the leaderboard.

## React Part 1: Routing

- Bootstrap CSS conflicts: Bootstrap aggressively sets background-color, color, border, etc. on .card, .list-group-item, .card-header, body, and more. When using a custom theme alongside Bootstrap, you need !important on essentially every property that overrides Bootstrap defaults.
- CSS splitting: Broke the monolithic app.css into per-component CSS files (login.css, quiz.css, leaderboard.css, about.css) with shared/global styles remaining in app.css. Each component imports its own CSS.
- Vite + React setup: Need @vitejs/plugin-react for JSX support and hot module replacement. Without it, Vite won't process .jsx files correctly.
- NavLink vs anchor tags: React Router's NavLink automatically adds an active class to the current route's link, replacing the manual class="nav-link active" pattern from the static HTML pages.
- HTML to JSX gotchas: class becomes className, for becomes htmlFor, self-closing tags like <hr /> and <img />, and HTML comments become {/_ JSX comments _/}.
- Google Fonts: Don't forget to add the font link to index.html — it was in every original HTML page's head but easy to miss when consolidating into a single SPA entry point.

## React Part 2: Reactivity

This was a lot of fun to see it all come together. I had to keep remembering to use React state instead of just manipulating the DOM directly.

Handling the toggling of the checkboxes was particularly interesting.

```jsx
<div className="input-group sound-button-container">
  {calmSoundTypes.map((sound, index) => (
    <div key={index} className="form-check form-switch">
      <input
        className="form-check-input"
        type="checkbox"
        value={sound}
        id={sound}
        onChange={() => togglePlay(sound)}
        checked={selectedSounds.includes(sound)}
      ></input>
      <label className="form-check-label" htmlFor={sound}>
        {sound}
      </label>
    </div>
  ))}
</div>
```
