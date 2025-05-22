// Canvas Setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const tileSize = 20; // Size of each tile in pixels
const tileCountX = canvas.width / tileSize; // Number of tiles horizontally
const tileCountY = canvas.height / tileSize; // Number of tiles vertically

// Game State Variables
let gameStarted = false;
const gameVersion = "0.2.0";
let snake = [{ x: Math.floor(tileCountX / 2), y: Math.floor(tileCountY / 2) }]; // Centered snake
let food = { x: 15, y: 15 }; // Initial food position (will be randomized)
let score = 0;
let dx = 0; // Velocity in x-direction (starts static)
let dy = 0; // Velocity in y-direction (starts static)
let gameLoop;
let currentSpeed; // Set by slider
let isTurboActive = false;

// Combo Variables
let comboMultiplier = 1;
let lastFoodTime = 0;
const comboTimeThreshold = 3000; // 3 seconds for combo

// DOM Elements
const scoreDisplay = document.getElementById('score');
const gameVersionDisplay = document.getElementById('gameVersion');
const startMessage = document.getElementById('startMessage');
const gameSpeedSlider = document.getElementById('gameSpeedSlider');
// const snakeSpeedSlider = document.getElementById('snakeSpeedSlider'); // Not used in this iteration
const turboButton = document.getElementById('turboButton');
const fullscreenButton = document.getElementById('fullscreenButton');
const comboMultiplierDisplay = document.getElementById('comboMultiplier');

// Initial Food Placement
function placeFood() {
    food.x = Math.floor(Math.random() * tileCountX);
    food.y = Math.floor(Math.random() * tileCountY);

    // Ensure food doesn't overlap with snake
    for (let segment of snake) {
        if (segment.x === food.x && segment.y === food.y) {
            placeFood(); // Recursively call if overlap
            return;
        }
    }
}

// Drawing Functions
function drawGame() {
    // Clear canvas
    ctx.fillStyle = 'black'; // Background color
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawSnake();
    drawFood();
}

function drawSnake() {
    ctx.fillStyle = 'lime'; // Snake color
    snake.forEach(segment => {
        ctx.fillRect(segment.x * tileSize, segment.y * tileSize, tileSize - 2, tileSize - 2); // -2 for a small border
    });
}

function drawFood() {
    ctx.fillStyle = 'red'; // Food color
    ctx.fillRect(food.x * tileSize, food.y * tileSize, tileSize, tileSize);
}

// UI Update Functions
function updateScoreDisplay() {
    scoreDisplay.textContent = score;
}

function updateComboDisplay() {
    comboMultiplierDisplay.textContent = comboMultiplier.toFixed(1) + 'x';
}

// Game Loop
function updateGame() {
    if (!gameStarted) return;

    // Update snake position
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head); // Add new head

    // Check for collisions with walls
    if (head.x < 0 || head.x >= tileCountX || head.y < 0 || head.y >= tileCountY) {
        gameOver();
        return;
    }

    // Check for collisions with self
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver();
            return;
        }
    }

    // Check if snake eats food
    if (head.x === food.x && head.y === food.y) {
        const currentTime = Date.now();
        if (currentTime - lastFoodTime < comboTimeThreshold) {
            comboMultiplier += 0.5;
        } else {
            comboMultiplier = 1;
        }
        lastFoodTime = currentTime;
        score += (1 * comboMultiplier); // Base score for food is 1, then multiplied

        updateScoreDisplay();
        updateComboDisplay();
        placeFood();
    } else {
        snake.pop(); // Remove tail if no food eaten
    }

    drawGame();
}

function gameOver() {
    clearInterval(gameLoop);
    gameStarted = false;
    isTurboActive = false; // Ensure turbo is off

    startMessage.textContent = `Game Over! Score: ${score}. Press an arrow key to restart.`;
    startMessage.style.display = 'block';

    comboMultiplier = 1;
    updateComboDisplay();

    // Reset snake, food, score for restart
    snake = [{ x: Math.floor(tileCountX / 2), y: Math.floor(tileCountY / 2) }];
    dx = 0;
    dy = 0;
    score = 0;
    updateScoreDisplay();
    placeFood();
    drawGame(); // Draw reset state
}

// Event Listener for Input
document.addEventListener('keydown', (event) => {
    if (!gameStarted) {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
            gameStarted = true;
            startMessage.style.display = 'none';
            switch (event.key) {
                case 'ArrowUp': if (dy === 0) { dx = 0; dy = -1; } break; // Initial move
                case 'ArrowDown': if (dy === 0) { dx = 0; dy = 1; } break;
                case 'ArrowLeft': if (dx === 0) { dx = -1; dy = 0; } break;
                case 'ArrowRight': if (dx === 0) { dx = 1; dy = 0; } break;
            }
            // Ensure initial direction is set before first game loop runs if snake starts moving immediately
            if (dx !== 0 || dy !== 0) { // Check if a direction was successfully set
                 gameLoop = setInterval(updateGame, currentSpeed);
            } else { // If initial key didn't set a direction (e.g. trying to reverse into nothing)
                gameStarted = false; // Revert gameStarted
                startMessage.style.display = 'block'; // Show message again
            }
        }
    } else {
        const goingUp = dy === -1;
        const goingDown = dy === 1;
        const goingLeft = dx === -1;
        const goingRight = dx === 1;

        switch (event.key) {
            case 'ArrowUp':
                if (!goingDown) { dx = 0; dy = -1; }
                break;
            case 'ArrowDown':
                if (!goingUp) { dx = 0; dy = 1; }
                break;
            case 'ArrowLeft':
                if (!goingRight) { dx = -1; dy = 0; }
                break;
            case 'ArrowRight':
                if (!goingLeft) { dx = 1; dy = 0; }
                break;
        }
    }
});

// DOMContentLoaded to ensure elements are loaded before manipulation
document.addEventListener('DOMContentLoaded', () => {
    if(gameVersionDisplay) gameVersionDisplay.textContent = gameVersion;
    if(startMessage) startMessage.style.display = 'block'; // Show start message
    if(gameSpeedSlider) currentSpeed = parseInt(gameSpeedSlider.value); // Initialize speed

    placeFood();
    updateScoreDisplay();
    updateComboDisplay(); // Initialize combo display
    drawGame(); // Draw initial centered snake and food
});

// Game Speed Slider
if(gameSpeedSlider) {
    gameSpeedSlider.addEventListener('input', () => {
        currentSpeed = parseInt(gameSpeedSlider.value);
        if (gameStarted && !isTurboActive) {
            clearInterval(gameLoop);
            gameLoop = setInterval(updateGame, currentSpeed);
        }
    });
}

// Turbo Button
if(turboButton) {
    turboButton.addEventListener('mousedown', () => {
        if (!gameStarted || isTurboActive) return; // Only if game is running and turbo not already active
        isTurboActive = true;
        clearInterval(gameLoop);
        gameLoop = setInterval(updateGame, currentSpeed / 2); // Turbo speed
    });

    turboButton.addEventListener('mouseup', () => {
        if (!gameStarted || !isTurboActive) return; // Only if game is running and turbo was active
        isTurboActive = false;
        clearInterval(gameLoop);
        gameLoop = setInterval(updateGame, currentSpeed); // Back to normal speed
    });
    // Add mouseleave as well, in case mouse is released outside button
    turboButton.addEventListener('mouseleave', () => {
        if (!gameStarted || !isTurboActive) return;
        isTurboActive = false;
        clearInterval(gameLoop);
        gameLoop = setInterval(updateGame, currentSpeed);
    });
}

// Fullscreen Button
if(fullscreenButton) {
    fullscreenButton.addEventListener('click', toggleFullScreen);
}

function toggleFullScreen() {
    if (!document.fullscreenElement) {
        canvas.requestFullscreen().catch(err => {
            alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}
// REMOVE OLD GAME START:
// gameLoop = setInterval(updateGame, 100);
