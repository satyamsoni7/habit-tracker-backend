# Habit Tracker Backend

A tiny Express server that saves each person's habit data as a JSON file on
disk, so it's kept online instead of only inside a browser.

## Run locally

```
npm install
npm start
```

Runs on `http://localhost:3001` by default (or the `PORT` environment
variable, if your host sets one).

## API

- `GET /api/tracker/:id` — returns the saved data for tracker `A` or `B`
  (404 if nothing saved yet).
- `POST /api/tracker/:id` — saves the full tracker data (send the entire
  object as JSON in the body; it overwrites the previous save).

## Data storage

Saved to `data/tracker-A.json` and `data/tracker-B.json`. These are plain
JSON files — open them any time to see or back up the raw data.

## Deploying

Any Node.js host works (Render, Railway, Fly.io, a VPS, etc.). Point the
start command at `npm start`. Note that on hosts with an ephemeral/read-only
filesystem, files written to `data/` may not persist across restarts —
check your host's docs for a persistent disk/volume option if so.
