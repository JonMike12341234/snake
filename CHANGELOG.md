# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
<!-- Future changes will go here -->

## [0.3.0] - YYYY-MM-DD <!-- Replace with today's date -->
### Added
- Game attempts to start in fullscreen with UI elements visible.
- Turbo mode activated by `Shift` key:
    - Provides a 3-second speed boost.
    - Consumes one "Turbo Unit".
    - Initial turbo units provided to player.
- Special Bonus Food:
    - Appears occasionally after normal food is eaten.
    - Grants one random effect upon consumption:
        - Increase available Turbo Units.
        - Increase Turbo power/speed multiplier.
        - Reduce snake length by 25%.
        - Add 1 Shield.
- Shield System:
    - Player can collect shields.
    - Active shield allows passing through own tail (consumes 1 shield).
    - Active shield allows warping to opposite side on wall collision (consumes 1 shield).
- UI updates for new stats: Shields, Turbo Units, Turbo Power.
- Informational messages for turbo activation and bonus effects.
- Debugging console logs for bonus food and turbo features (temporary).

### Changed
- Game speed slider direction inverted: right on slider now means faster game speed.
- Turbo functionality moved from a button to `Shift` key press.
- `gameVersion` variable in `script.js` updated to "0.3.0".
- `index.html` updated with new UI elements for shields, turbo stats, and messages.
- `style.css` updated to style new UI elements and handle fullscreen UI visibility.

### Removed
- Turbo button from UI and corresponding event listeners.

### Fixed
- (Once bugs are fixed, list them here. e.g., "Ensured bonus food spawns correctly according to its probability.")
- (e.g., "Corrected conditions for Shift key to activate turbo mode.")

## [0.2.0] - 2025-05-22
### Added
- Snake starts centered and static; game initiated by first arrow key press.
- "Press an arrow key to start!" message.
- Game version display (`0.2.0`) in UI.
- Link to `CHANGELOG.md` in UI.
- Game speed adjustment slider.
- Turbo button for momentary speed boost.
- Full-screen mode for game canvas.
- Combo score multiplier for consecutive food collection.
- Game over message shows final score and prompts for restart.
- Created this `CHANGELOG.md` to track project changes.

### Changed
- Game loop initiation now tied to first key press.
- Score calculation incorporates combo multiplier.
- Game over sequence resets state for immediate restart.

### Removed
- Automatic game start on page load.

## [0.1.0] - (Assumed Previous Version / Initial Setup)
### Added
- Basic Snake game functionality.
- Score tracking.
- Wall collision detection.
- Food mechanism.