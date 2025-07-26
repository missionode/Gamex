

# # GameX A Cosmic Attraction Game

## Overview

This is a single-page web game built with HTML, CSS, and JavaScript, designed to teach skills like attraction (focusing on desirable items), ignoring distractions, concentration, interaction via clicking, and improving response times. The game is set in a cosmic environment where players attract selected icons (e.g., coins) while ignoring others (e.g., trash), with progressive difficulty and energy level unlocks.

The game uses a gravity-like mechanic: Icons float in space, and clicking attract icons pulls them toward a central orb for absorption and scoring. Ignore icons are non-interactive. Speed increases over time, with bulk accelerations at energy milestones for a pulsing challenge effect.

## Features

- **Cosmic Theme:** Immersive space background with a glowing orb that pulses and radiates flares.
- **Pair Selection:** Choose "attract" and "ignore" icons from a JSON-configured list at startup.
- **Physics Simulation:** Icons drift randomly without colliding; guided trajectories on click using GSAP for smooth animations.
- **Progression:** Score-based speed increases; energy levels unlock at thresholds (e.g., 10, 20, 50 points) with orb pulsing and bulk speed-ups.
- **UI Elements:** Thin header for score, chosen icons, and restart; auto-hides for immersion.
- **Responsiveness:** Mobile-friendly with Tailwind CSS; larger icons on desktop.
- **No Interaction on Ignore:** Clicks on ignore icons do nothing, reinforcing the skill.
- **Infinite Play:** No end screen; restart reloads the page.

## Tech Stack

- **HTML/CSS/JS:** Core structure and logic.
- **Tailwind CSS:** Via CDN for styling and responsiveness (`<script src="https://cdn.tailwindcss.com"></script>`).
- **GSAP:** Via CDN for animations (`<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>`).
- **No External Physics Library:** Simplified to DOM-based movement for lightness (Matter.js was planned but omitted for simplicity; can be added later).
- **JSON Config:** Hardcoded in JS for icons, percentages, and upgrades (can be fetched from a file if needed).

## How to Run

1. Save the provided code as `index.html`.
2. Open `index.html` in a modern browser (Chrome, Firefox, etc.).
3. The setup modal appears: Select attract and ignore icons from dropdowns.
4. Click "Start Game" to begin.
5. Click floating attract icons to pull them to the orb; absorb for points.
6. Restart via the header icon (🔄) to reload.

## Configuration

Edit the `config` object in the `<script>` tag:
- `attractPercent` / `ignorePercent`: Ratio of icon spawns (e.g., 90/10).
- `speedIncrement`: Multiplier for progressive speed (1.1) and bulk unlocks (x1.2).
- `energyLevels`: Array of score thresholds for unlocks (e.g., [10, 20, 50]).
- `icons`: Array of objects with `name` and `url` (using Flaticon placeholders; replace with your images).

## Known Limitations & Improvements

- **Physics:** Current implementation uses simple velocity updates; add Matter.js CDN for true non-colliding physics if needed.
- **Icons:** Uses external Flaticon URLs; host locally for offline play.
- **Sounds/Particles:** Not implemented; add Web Audio API or canvas particles for enhanced feedback.
- **Tutorial/Summary:** Basic; expand with modals for onboarding and post-session stats.
- **Testing:** Manually tested in browser; ensure GSAP/Tailwind CDNs load. No automated tests included.
- **Performance:** Limits icons to avoid lag; monitor on low-end devices.

## License

MIT License - Free to use and modify.
