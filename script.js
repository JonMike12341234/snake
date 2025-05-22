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
let currentSpeedInterval;
let baseSpeedInterval;

// NEW: Turbo Variables
let isTurboActive = false;
let turboTimer = null;
let turboDurationUnits = 3;
let turboPowerMultiplier = 2.0;
const TURBO_DURATION_MS = 3000;

// NEW: Shield Variables
let shields = 0;

// NEW: Bonus Food Variables
const BONUS_FOOD_COLOR = 'gold';
const BONUS_FOOD_SPAWN_CHANCE = 0.2;
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
const shieldCountDisplay = document.getElementById('shieldCount');
const turboUnitsDisplay = document.getElementById('turboUnitsDisplay');
const turboPowerDisplay = document.getElementById('turboPowerDisplay');
const bonusMessageDisplay = document.getElementById('bonusMessage');
let bonusMessageTimeout;


// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', initializeGame);

function initializeGame() {
    tileCountX = canvas.width / tileSize;
    tileCountY = canvas.height / tileSize;

    if(gameVersionDisplay) gameVersionDisplay.textContent = gameVersion;
    if(startMessage) startMessage.style.display = 'block';

    if(gameSpeedSlider) {
        gameSpeedSlider.addEventListener('input', handleSpeedSliderChange);
        baseSpeedInterval = calculateIntervalFromSlider(gameSpeedSlider.value);
        currentSpeedInterval = baseSpeedInterval;
    } else {
        baseSpeedInterval = 100;
        currentSpeedInterval = baseSpeedInterval;
    }
    
    resetGameState();
    updateUIDisplay();
    drawGame();

    if(fullscreenButton) {
        fullscreenButton.addEventListener('click', toggleFullScreen);
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('keydown', handleKeyDown);
}

function resetGameState() {
    snake = [{ x: Math.floor(tileCountX / 2), y: Math.floor(tileCountY / 2) }];
    dx = 0;
    dy = 0;
    score = 0;
    comboMultiplier = 1;
    lastFoodTime = 0;
    
    shields = 0;
    turboDurationUnits = 3;
    turboPowerMultiplier = 2.0;
    isTurboActive = false;
    if (turboTimer) clearTimeout(turboTimer);

    placeFood();
    bonusFood.active = false;

    if (gameStarted) {
        clearInterval(gameLoop);
        gameLoop = null;
    }
    gameStarted = false;
}


// --- FULLSCREEN ---
function requestGameFullscreen() {
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
    drawGame();
}

// --- SPEED SLIDER ---
function calculateIntervalFromSlider(sliderValue) {
    const minInterval = 50;
    const maxInterval = 200;
    const sliderMin = parseInt(gameSpeedSlider.min);
    const sliderMax = parseInt(gameSpeedSlider.max);
    let normalizedValue = (parseInt(sliderValue) - sliderMin) / (sliderMax - sliderMin);
    return Math.round(maxInterval - normalizedValue * (maxInterval - minInterval));
}

function handleSpeedSliderChange() {
    baseSpeedInterval = calculateIntervalFromSlider(gameSpeedSlider.value);
    if (gameStarted && !isTurboActive) {
        currentSpeedInterval = baseSpeedInterval;
        clearInterval(gameLoop);
        gameLoop = setInterval(updateGame, currentSpeedInterval);
    } else if (!isTurboActive) {
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
        ctx.fillRect(segment.x * tileSize, segment.y * tileSize, tileSize - 1, tileSize - 1);
    });
    if (shields > 0 && snake.length > 0) {
        ctx.fillStyle = 'cyan';
        ctx.fillRect(snake[0].x * tileSize, snake[0].y * tileSize, tileSize - 1, tileSize - 1);
    }
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * tileSize, food.y * tileSize, tileSize, tileSize);
}

function drawBonusFood() {
    ctx.fillStyle = BONUS_FOOD_COLOR;
    ctx.beginPath();
    ctx.arc(bonusFood.x * tileSize + tileSize / 2, bonusFood.y * tileSize + tileSize / 2, tileSize / 2, 0, 2 * Math.PI);
    ctx.fill();
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

function showBonusMessage(message) {
    if (bonusMessageDisplay) {
        bonusMessageDisplay.textContent = message;
        if (bonusMessageTimeout) clearTimeout(bonusMessageTimeout);
        bonusMessageTimeout = setTimeout(() => {
            bonusMessageDisplay.textContent = '';
        }, 2500);
    }
}

// --- FOOD PLACEMENT ---
function placeFood() {
    food.x = Math.floor(Math.random() * tileCountX);
    food.y = Math.floor(Math.random() * tileCountY);
    food.active = true;

    if (isOverlappingSnake(food.x, food.y) || (bonusFood.active && food.x === bonusFood.x && food.y === bonusFood.y)) {
        placeFood();
    }
}

function placeBonusFood() {
    console.log("placeBonusFood called"); // DEBUG
    if (bonusFood.active) {
        console.log("Bonus food already active in placeBonusFood, returning."); // DEBUG
        return; 
    }

    bonusFood.x = Math.floor(Math.random() * tileCountX);
    bonusFood.y = Math.floor(Math.random() * tileCountY);
    console.log(`Attempting to place bonus food at: ${bonusFood.x}, ${bonusFood.y}`); // DEBUG
    
    if (isOverlappingSnake(bonusFood.x, bonusFood.y) || (food.active && food.x === bonusFood.x && food.y === bonusFood.y)) {
        console.log("Bonus food placement conflict. Retrying."); // DEBUG
        placeBonusFood(); // Recursive call
        return;
    }
    bonusFood.active = true;
    console.log("Bonus food placed successfully and set to active."); // DEBUG
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
function activateTurbo() {
    console.log("activateTurbo called."); // DEBUG
    console.log(`Game started: ${gameStarted}, Turbo active: ${isTurboActive}, Turbo units: ${turboDurationUnits}`); // DEBUG
    if (!gameStarted || isTurboActive || turboDurationUnits <= 0) {
        console.log("Turbo activation conditions not met. Returning."); // DEBUG
        return;
    }

    isTurboActive = true;
    turboDurationUnits--;
    updateUIDisplay(); 

    const actualTurboSpeedInterval = Math.max(20, Math.round(baseSpeedInterval / turboPowerMultiplier));

    clearInterval(gameLoop);
    gameLoop = setInterval(updateGame, actualTurboSpeedInterval);

    showBonusMessage(`Turbo Activated! (${turboPowerMultiplier.toFixed(1)}x)`);

    turboTimer = setTimeout(() => {
        deactivateTurbo();
    }, TURBO_DURATION_MS);
}

function deactivateTurbo() {
    if (!isTurboActive) return;
    isTurboActive = false;
    clearTimeout(turboTimer);
    turboTimer = null;
    
    currentSpeedInterval = baseSpeedInterval;
    if (gameStarted) {
        clearInterval(gameLoop);
        gameLoop = setInterval(updateGame, currentSpeedInterval);
    }
}

// --- GAME LOGIC ---
function updateGame() {
    if (!gameStarted || dx === 0 && dy === 0 && snake.length === 1) {
        drawGame();
        return;
    }

    let head = { x: snake[0].x + dx, y: snake[0].y + dy };
    let wallCollision = false;
    if (head.x < 0 || head.x >= tileCountX || head.y < 0 || head.y >= tileCountY) {
        if (shields > 0) {
            shields--;
            showBonusMessage("Shield Used! Wall Warp!");
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
    
    snake.unshift(head);

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            if (shields > 0) {
                shields--;
                showBonusMessage("Shield Used! Phased Through Tail!");
                updateUIDisplay();
            } else {
                gameOver();
                return;
            }
            break; 
        }
    }
    
    let ateFoodThisTick = false;

    if (food.active && head.x === food.x && head.y === food.y) {
        ateFoodThisTick = true;
        food.active = false;
        const currentTime = Date.now();
        if (currentTime - lastFoodTime < comboTimeThreshold) {
            comboMultiplier = Math.min(5, comboMultiplier + 0.5);
        } else {
            comboMultiplier = 1;
        }
        lastFoodTime = currentTime;
        score += Math.floor(1 * comboMultiplier);

        placeFood();
        updateUIDisplay();

        // Chance to spawn bonus food
        console.log("Regular food eaten. Checking for bonus food spawn..."); // DEBUG
        const randomRoll = Math.random();
        console.log(`Random roll: ${randomRoll}, Spawn chance: ${BONUS_FOOD_SPAWN_CHANCE}`); // DEBUG
        if (!bonusFood.active && randomRoll < BONUS_FOOD_SPAWN_CHANCE) {
            console.log("Spawning bonus food!"); // DEBUG
            placeBonusFood();
        } else if (bonusFood.active) {
            console.log("Bonus food already active, not spawning another."); // DEBUG
        } else {
            console.log("Bonus food spawn chance not met."); // DEBUG
        }
    }

    if (bonusFood.active && head.x === bonusFood.x && head.y === bonusFood.y) {
        ateFoodThisTick = true;
        bonusFood.active = false;
        applyRandomBonusEffect();
        updateUIDisplay();
    }


    if (!ateFoodThisTick) {
        snake.pop();
    }

    drawGame();
}

function applyRandomBonusEffect() {
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
            const reduction = Math.max(1, Math.floor(snake.length * 0.25));
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
    gameLoop = null;
    gameStarted = false;
    if (isTurboActive) deactivateTurbo();

    if(startMessage) {
        startMessage.textContent = `Game Over! Score: ${score}. Press an arrow key to restart.`;
        startMessage.style.display = 'block';
    }

    resetGameState();
    updateUIDisplay();
    drawGame();
}

// --- INPUT HANDLING ---
function handleKeyDown(event) {
    if (!gameStarted) {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
            gameStarted = true;
            if(startMessage) startMessage.style.display = 'none';
            
            if (!document.fullscreenElement) {
                requestGameFullscreen();
            }
            setInitialDirection(event.key);

            if (dx !== 0 || dy !== 0) {
                 currentSpeedInterval = baseSpeedInterval;
                 gameLoop = setInterval(updateGame, currentSpeedInterval);
                 updateGame();
            } else {
                gameStarted = false;
                if(startMessage) startMessage.style.display = 'block';
            }
        }
    } else {
        const goingUp = dy === -1;
        const goingDown = dy === 1;
        const goingLeft = dx === -1;
        const goingRight = dx === 1;

        switch (event.key) {
            case 'ArrowUp': if (!goingDown) { dx = 0; dy = -1; } break;
            case 'ArrowDown': if (!goingUp) { dx = 0; dy = 1; } break;
            case 'ArrowLeft': if (!goingRight) { dx = -1; dy = 0; } break;
            case 'ArrowRight': if (!goingLeft) { dx = 1; dy = 0; } break;
            case 'Shift':
                console.log("Shift key pressed."); // DEBUG
                activateTurbo();
                break;
        }
    }

    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Shift'].includes(event.key)) {
        event.preventDefault();
    }
}

function setInitialDirection(key) {
    switch (key) {
        case 'ArrowUp': dx = 0; dy = -1; break;
        case 'ArrowDown': dx = 0; dy = 1; break;
        case 'ArrowLeft': dx = -1; dy = 0; break;
        case 'ArrowRight': dx = 1; dy = 0; break;
    }
}