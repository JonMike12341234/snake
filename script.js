// Canvas Setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const tileSize = 20; // Size of each tile in pixels
const tileCountX = canvas.width / tileSize; // Number of tiles horizontally
const tileCountY = canvas.height / tileSize; // Number of tiles vertically

// Game Variables
let snake = [{ x: 10, y: 10 }]; // Initial snake position
let food = { x: 15, y: 15 }; // Initial food position
let score = 0;
let dx = 0; // Velocity in x-direction
let dy = 0; // Velocity in y-direction
let gameLoop;

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

// Score Display
function updateScoreDisplay() {
    document.getElementById('score').textContent = score;
}

// Game Loop
function updateGame() {
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
        score++;
        updateScoreDisplay();
        placeFood();
    } else {
        snake.pop(); // Remove tail if no food eaten
    }

    drawGame();
}

function gameOver() {
    clearInterval(gameLoop);
    alert(`Game Over! Your score: ${score}`);
    // Optional: Add logic to restart the game here
}

// Event Listener for Input
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            if (dy === 0) { // Prevent immediate reversal
                dx = 0;
                dy = -1;
            }
            break;
        case 'ArrowDown':
            if (dy === 0) {
                dx = 0;
                dy = 1;
            }
            break;
        case 'ArrowLeft':
            if (dx === 0) {
                dx = -1;
                dy = 0;
            }
            break;
        case 'ArrowRight':
            if (dx === 0) {
                dx = 1;
                dy = 0;
            }
            break;
    }
});

// Initial Game Start
placeFood();
updateScoreDisplay(); // Initialize score display
drawGame(); // Draw initial state before loop starts
gameLoop = setInterval(updateGame, 100); // Start game loop (100ms = 10 FPS)
