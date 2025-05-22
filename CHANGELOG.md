# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] 
<!-- Future changes will go here -->

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
