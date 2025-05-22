// Canvas Setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const tileSize = 20;
let tileCountX = canvas.width / tileSize;
let tileCountY = canvas.height / tileSize;

// Game State Variables
let gameStarted = false;
const gameVersion = "0.3.0"; // MODIFIED: Update version
let snake = [];
let food = { x: 0, y: 0, active: false };
let score = 0;
let dx = 0;
let dy = 0;
let gameLoop;
let currentSpeedInterval; // MODIFIED: Represents the setInterval delay
let baseSpeedInterval; // MODIFIED: Speed set by slider, before turbo

// NEW: Turbo Variables
let isTurboActive = false;
let turboTimer = null;
let turboDurationUnits = 3; // Start with some turbo units
let turboPowerMultiplier = 2.0; // Turbo doubles speed by default
const TURBO_DURATION_MS = 3000; // Turbo lasts 3 seconds per use

// NEW: Shield Variables
let shields = 0;

// NEW: Bonus Food Variables
const BONUS_FOOD_COLOR = 'gold';
const BONUS_FOOD_SPAWN_CHANCE = 0.2; // 20% chance to spawn after normal food
let bonusFood = { x: 0, y: 0, active: false };
const BonusEffect = {
    TURBO_UNITS: 'turbo_units',
    TURBO_POWER: 'turbo_power',
    REDUCE_LENGTH: 'reduce_length',
    ADD_SHIELD: 'add_shield'
};

// Combo Variables
let comboMultiplier = 1;
let lastFoodTime = 0;
const comboTimeThreshold = 3000;

// DOM Elements
const scoreDisplay = document.getElementById('score');
const gameVersionDisplay = document.getElementById('gameVersion');
const startMessage = document.getElementById('startMessage');
const gameSpeedSlider = document.getElementById('gameSpeedSlider');
const fullscreenButton = document.getElementById('fullscreenButton');
const comboMultiplierDisplay = document.getElementById('comboMultiplier');
// NEW: UI ElementS
const shieldCountDisplay = document.getElementById('shieldCount');
const turboUnitsDisplay = document.getElementById('turboUnitsDisplay');
const turboPowerDisplay = document.getElementById('turboPowerDisplay');
const bonusMessageDisplay = document.getElementById('bonusMessage');
let bonusMessageTimeout;


// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', initializeGame);

function initializeGame() {
    // Ensure canvas dimensions are set based on its current size in DOM
    tileCountX = canvas.width / tileSize;
    tileCountY = canvas.height / tileSize;

    if(gameVersionDisplay) gameVersionDisplay.textContent = gameVersion;
    if(startMessage) startMessage.style.display = 'block';

    // MODIFIED: Slider setup
    if(gameSpeedSlider) {
        gameSpeedSlider.addEventListener('input', handleSpeedSliderChange);
        // Set initial speed from slider (applying inversion)
        baseSpeedInterval = calculateIntervalFromSlider(gameSpeedSlider.value);
        currentSpeedInterval = baseSpeedInterval;
    } else {
        baseSpeedInterval = 100; // Default if slider not found
        currentSpeedInterval = baseSpeedInterval;
    }
    
    resetGameState(); // Sets up snake, food, score etc. for the very first draw
    updateUIDisplay();
    drawGame(); // Draw initial state

    // Fullscreen button listener
    if(fullscreenButton) {
        fullscreenButton.addEventListener('click', toggleFullScreen);
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    // Keyboard input listener
    document.addEventListener('keydown', handleKeyDown);
}

function resetGameState() {
    snake = [{ x: Math.floor(tileCountX / 2), y: Math.floor(tileCountY / 2) }];
    dx = 0;
    dy = 0;
    score = 0;
    comboMultiplier = 1;
    lastFoodTime = 0;
    
    // Reset new stats
    shields = 0;
    turboDurationUnits = 3; // Reset to initial turbo units
    turboPowerMultiplier = 2.0; // Reset turbo power
    isTurboActive = false;
    if (turboTimer) clearTimeout(turboTimer);

    placeFood();
    bonusFood.active = false; // No bonus food at start of game/reset

    if (gameStarted) { // If reset is due to game over, clear loop
        clearInterval(gameLoop);
        gameLoop = null;
    }
    gameStarted = false; // Ensure gameStarted is false after reset
}


// --- FULLSCREEN ---
function requestGameFullscreen() {
    // Try to make the whole document fullscreen to keep UI visible
    if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(err => {
            console.warn(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
    } else if (document.documentElement.mozRequestFullScreen) { /* Firefox */
        document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
        document.documentElement.webkitRequestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) { /* IE/Edge */
        document.documentElement.msRequestFullscreen();
    }
}

function exitGameFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) { /* Firefox */
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) { /* Chrome, Safari & Opera */
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE/Edge */
        document.msExitFullscreen();
    }
}

function toggleFullScreen() {
    if (!document.fullscreenElement &&
        !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
        requestGameFullscreen();
    } else {
        exitGameFullscreen();
    }
}

function handleFullscreenChange() {
    // Optional: Adjust canvas size or re-draw if needed when fullscreen state changes
    // For now, CSS handles canvas scaling within the fullscreen document.
    // We might need to recalculate tileCountX/Y if canvas dimensions change significantly AND
    // the game logic depends on fixed pixel sizes rather than relative tile counts.
    // However, if CSS just scales the visual output, tile counts remain valid.
    // Let's assume for now that the canvas's internal resolution (width/height attributes)
    // doesn't change, only its display size via CSS.
    drawGame(); // Redraw to ensure crispness if scaling happened
}

// --- SPEED SLIDER ---
// MODIFIED: Slider value conversion
function calculateIntervalFromSlider(sliderValue) {
    const minInterval = 50; // Fastest game speed (ms)
    const maxInterval = 200; // Slowest game speed (ms)
    const sliderMin = parseInt(gameSpeedSlider.min);
    const sliderMax = parseInt(gameSpeedSlider.max);

    // Value from slider (e.g., 50 to 200). We want value 50 (left) to be slow (maxInterval)
    // and value 200 (right) to be fast (minInterval).
    let normalizedValue = (parseInt(sliderValue) - sliderMin) / (sliderMax - sliderMin); // 0 (left) to 1 (right)
    
    // Inverted: Higher normalized value (right on slider) means smaller interval (faster game)
    return Math.round(maxInterval - normalizedValue * (maxInterval - minInterval));
}

function handleSpeedSliderChange() {
    baseSpeedInterval = calculateIntervalFromSlider(gameSpeedSlider.value);
    if (gameStarted && !isTurboActive) {
        currentSpeedInterval = baseSpeedInterval;
        clearInterval(gameLoop);
        gameLoop = setInterval(updateGame, currentSpeedInterval);
    } else if (!isTurboActive) { // Game not started, just update the interval for when it does
        currentSpeedInterval = baseSpeedInterval;
    }
}

// --- DRAWING ---
function drawGame() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawSnake();
    if (food.active) drawFood();
    if (bonusFood.active) drawBonusFood();
}

function drawSnake() {
    ctx.fillStyle = 'lime';
    snake.forEach(segment => {
        ctx.fillRect(segment.x * tileSize, segment.y * tileSize, tileSize - 1, tileSize - 1); // -1 for a small grid effect
    });
    // Draw snake head slightly different if shielded
    if (shields > 0 && snake.length > 0) {
        ctx.fillStyle = 'cyan'; // Shielded head color
        ctx.fillRect(snake[0].x * tileSize, snake[0].y * tileSize, tileSize - 1, tileSize - 1);
    }
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * tileSize, food.y * tileSize, tileSize, tileSize);
}

function drawBonusFood() { // NEW
    ctx.fillStyle = BONUS_FOOD_COLOR;
    ctx.beginPath();
    ctx.arc(bonusFood.x * tileSize + tileSize / 2, bonusFood.y * tileSize + tileSize / 2, tileSize / 2, 0, 2 * Math.PI);
    ctx.fill();
    // Add a little sparkle effect
    ctx.fillStyle = 'white';
    for(let i=0; i<3; i++){
        ctx.fillRect(
            bonusFood.x * tileSize + Math.random() * (tileSize -4) + 2,
            bonusFood.y * tileSize + Math.random() * (tileSize -4) + 2,
            2, 2
        );
    }
}

// --- UI UPDATES ---
function updateUIDisplay() {
    if(scoreDisplay) scoreDisplay.textContent = score;
    if(comboMultiplierDisplay) comboMultiplierDisplay.textContent = comboMultiplier.toFixed(1) + 'x';
    if(shieldCountDisplay) shieldCountDisplay.textContent = shields;
    if(turboUnitsDisplay) turboUnitsDisplay.textContent = turboDurationUnits;
    if(turboPowerDisplay) turboPowerDisplay.textContent = turboPowerMultiplier.toFixed(1) + 'x';
}

function showBonusMessage(message) { // NEW
    if (bonusMessageDisplay) {
        bonusMessageDisplay.textContent = message;
        if (bonusMessageTimeout) clearTimeout(bonusMessageTimeout);
        bonusMessageTimeout = setTimeout(() => {
            bonusMessageDisplay.textContent = '';
        }, 2500); // Message displayed for 2.5 seconds
    }
}

// --- FOOD PLACEMENT ---
function placeFood() {
    food.x = Math.floor(Math.random() * tileCountX);
    food.y = Math.floor(Math.random() * tileCountY);
    food.active = true;

    if (isOverlappingSnake(food.x, food.y) || (bonusFood.active && food.x === bonusFood.x && food.y === bonusFood.y)) {
        placeFood(); // Recursively call if overlap
    }
}

function placeBonusFood() { // NEW
    if (bonusFood.active) return; // Only one bonus food at a time

    bonusFood.x = Math.floor(Math.random() * tileCountX);
    bonusFood.y = Math.floor(Math.random() * tileCountY);
    
    if (isOverlappingSnake(bonusFood.x, bonusFood.y) || (food.active && food.x === bonusFood.x && food.y === bonusFood.y)) {
        placeBonusFood();
        return;
    }
    bonusFood.active = true;
}

function isOverlappingSnake(x, y) {
    for (let segment of snake) {
        if (segment.x === x && segment.y === y) {
            return true;
        }
    }
    return false;
}

// --- TURBO ---
function activateTurbo() { // NEW
    if (!gameStarted || isTurboActive || turboDurationUnits <= 0) return;

    isTurboActive = true;
    turboDurationUnits--;
    updateUIDisplay(); // Update units count

    // Store current interval to revert, then apply turbo
    // currentSpeedInterval is already the base speed if turbo wasn't active
    const actualTurboSpeedInterval = Math.max(20, Math.round(baseSpeedInterval / turboPowerMultiplier)); // Ensure not too fast (min 20ms)

    clearInterval(gameLoop);
    gameLoop = setInterval(updateGame, actualTurboSpeedInterval);

    showBonusMessage(`Turbo Activated! (${turboPowerMultiplier.toFixed(1)}x)`);

    turboTimer = setTimeout(() => {
        deactivateTurbo();
    }, TURBO_DURATION_MS);
}

function deactivateTurbo() { // NEW
    if (!isTurboActive) return;
    isTurboActive = false;
    clearTimeout(turboTimer);
    turboTimer = null;
    
    // Revert to base speed
    currentSpeedInterval = baseSpeedInterval;
    if (gameStarted) { // Only restart loop if game is still running
        clearInterval(gameLoop);
        gameLoop = setInterval(updateGame, currentSpeedInterval);
    }
    // showBonusMessage("Turbo Finished"); // Optional message
}

// --- GAME LOGIC ---
function updateGame() {
    if (!gameStarted || dx === 0 && dy === 0 && snake.length === 1) { // If started but not moving (initial state)
        drawGame(); // Keep drawing but don't update snake position
        return;
    }

    let head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Wall Collision
    let wallCollision = false;
    if (head.x < 0 || head.x >= tileCountX || head.y < 0 || head.y >= tileCountY) {
        if (shields > 0) {
            shields--;
            showBonusMessage("Shield Used! Wall Warp!");
            // Wrap around:
            if (head.x < 0) head.x = tileCountX - 1;
            else if (head.x >= tileCountX) head.x = 0;
            if (head.y < 0) head.y = tileCountY - 1;
            else if (head.y >= tileCountY) head.y = 0;
            updateUIDisplay();
        } else {
            wallCollision = true;
        }
    }

    if (wallCollision) {
        gameOver();
        return;
    }
    
    snake.unshift(head); // Add new head

    // Self Collision
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            if (shields > 0) {
                shields--;
                showBonusMessage("Shield Used! Phased Through Tail!");
                updateUIDisplay();
                // No game over, snake passes through. The segment will be popped later if no food.
            } else {
                gameOver();
                return;
            }
            break; // Collision handled (either shield or game over)
        }
    }
    
    let ateFoodThisTick = false;

    // Check if snake eats regular food
    if (food.active && head.x === food.x && head.y === food.y) {
        ateFoodThisTick = true;
        food.active = false; // Mark as eaten
        const currentTime = Date.now();
        if (currentTime - lastFoodTime < comboTimeThreshold) {
            comboMultiplier = Math.min(5, comboMultiplier + 0.5); // Max combo 5x
        } else {
            comboMultiplier = 1;
        }
        lastFoodTime = currentTime;
        score += Math.floor(1 * comboMultiplier);

        placeFood(); // Place new regular food
        updateUIDisplay();

        // Chance to spawn bonus food
        if (!bonusFood.active && Math.random() < BONUS_FOOD_SPAWN_CHANCE) {
            placeBonusFood();
        }
    }

    // Check if snake eats bonus food (NEW)
    if (bonusFood.active && head.x === bonusFood.x && head.y === bonusFood.y) {
        ateFoodThisTick = true; // Counts as eating for not popping tail
        bonusFood.active = false;
        applyRandomBonusEffect();
        updateUIDisplay();
        // Don't add to score or combo for bonus food (or make it a small fixed amount)
        // score += 5; // Optional: small score for bonus food
    }


    if (!ateFoodThisTick) {
        snake.pop(); // Remove tail if no food eaten
    }

    drawGame();
}

function applyRandomBonusEffect() { // NEW
    const effects = Object.values(BonusEffect);
    const chosenEffectKey = effects[Math.floor(Math.random() * effects.length)];

    switch (chosenEffectKey) {
        case BonusEffect.TURBO_UNITS:
            turboDurationUnits += 3;
            showBonusMessage("+3 Turbo Units!");
            break;
        case BonusEffect.TURBO_POWER:
            turboPowerMultiplier = parseFloat((turboPowerMultiplier + 0.2).toFixed(1));
            showBonusMessage(`Turbo Power Up! (${turboPowerMultiplier}x)`);
            break;
        case BonusEffect.REDUCE_LENGTH:
            const reduction = Math.max(1, Math.floor(snake.length * 0.25)); // Reduce by at least 1 if possible
            if (snake.length - reduction >= 1) {
                for (let i = 0; i < reduction; i++) {
                    if (snake.length > 1) snake.pop();
                }
                showBonusMessage("Snake Shrunk!");
            } else {
                 showBonusMessage("Shrink Failed (Too Short)!");
            }
            break;
        case BonusEffect.ADD_SHIELD:
            shields++;
            showBonusMessage("+1 Shield!");
            break;
    }
}


function gameOver() {
    clearInterval(gameLoop);
    gameLoop = null; // Clear the interval ID
    gameStarted = false;
    if (isTurboActive) deactivateTurbo(); // Ensure turbo is off

    if(startMessage) {
        startMessage.textContent = `Game Over! Score: ${score}. Press an arrow key to restart.`;
        startMessage.style.display = 'block';
    }

    resetGameState(); // Reset snake, food, score etc.
    updateUIDisplay(); // Update UI for reset state
    drawGame(); // Draw reset state
}

// --- INPUT HANDLING ---
function handleKeyDown(event) {
    if (!gameStarted) {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
            // First key press to start the game
            gameStarted = true;
            if(startMessage) startMessage.style.display = 'none';
            
            // Attempt to go fullscreen on first interaction that starts the game
            if (!document.fullscreenElement) {
                requestGameFullscreen();
            }

            // Set initial direction based on key pressed
            setInitialDirection(event.key);

            if (dx !== 0 || dy !== 0) { // Check if a direction was successfully set
                 currentSpeedInterval = baseSpeedInterval; // Use speed from slider
                 gameLoop = setInterval(updateGame, currentSpeedInterval);
                 updateGame(); // Perform one immediate update to move the snake
            } else { // If initial key didn't set a direction
                gameStarted = false; // Revert gameStarted
                if(startMessage) startMessage.style.display = 'block'; // Show message again
            }
        }
    } else { // Game is already started
        const goingUp = dy === -1;
        const goingDown = dy === 1;
        const goingLeft = dx === -1;
        const goingRight = dx === 1;

        switch (event.key) {
            case 'ArrowUp': if (!goingDown) { dx = 0; dy = -1; } break;
            case 'ArrowDown': if (!goingUp) { dx = 0; dy = 1; } break;
            case 'ArrowLeft': if (!goingRight) { dx = -1; dy = 0; } break;
            case 'ArrowRight': if (!goingLeft) { dx = 1; dy = 0; } break;
            case 'Shift': // NEW: Turbo Activation
                activateTurbo();
                break;
        }
    }

    // Prevent arrow keys from scrolling the page when game has focus/is fullscreen
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Shift'].includes(event.key)) {
        event.preventDefault();
    }
}

function setInitialDirection(key) {
    // snake[0] is the head. For initial move, snake.length is 1, so no 'previous' segment.
    // dy === 0 and dx === 0 is the starting condition.
    switch (key) {
        case 'ArrowUp': dx = 0; dy = -1; break;
        case 'ArrowDown': dx = 0; dy = 1; break;
        case 'ArrowLeft': dx = -1; dy = 0; break;
        case 'ArrowRight': dx = 1; dy = 0; break;
    }
}