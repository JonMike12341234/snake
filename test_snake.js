// test_snake.js
const puppeteer = require('puppeteer');
const path = require('path');

async function runGameTest() {
    let browser;
    let observations = [];
    let errors = [];

    try {
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
        });
        const page = await browser.newPage();
        const filePath = `file:${path.join(__dirname, 'index.html')}`;
        await page.goto(filePath);

        // Allow time for the game to initialize
        await new Promise(resolve => setTimeout(resolve, 500));

        // --- 1. Initial State ---
        let initialSnake = await page.evaluate(() => snake);
        if (initialSnake && initialSnake.length > 0 && initialSnake[0].x === 10 && initialSnake[0].y === 10) {
            observations.push("Initial state: Snake is at starting position (10,10).");
        } else {
            observations.push(`Initial state: Snake is at unexpected position: ${JSON.stringify(initialSnake)}`);
        }
        let initialDx = await page.evaluate(() => dx);
        let initialDy = await page.evaluate(() => dy);
        if (initialDx === 0 && initialDy === 0) {
            observations.push("Initial state: Snake is stationary (dx=0, dy=0).");
        } else {
            observations.push(`Initial state: Snake is moving (dx=${initialDx}, dy=${initialDy}).`);
        }

        // --- 2. Movement ---
        await page.keyboard.press('ArrowRight');
        await new Promise(resolve => setTimeout(resolve, 200)); // Wait for a couple of game ticks (100ms interval)
        let snakeAfterMove = await page.evaluate(() => snake);
        let dxAfterMove = await page.evaluate(() => dx);
        let dyAfterMove = await page.evaluate(() => dy);

        if (dxAfterMove === 1 && dyAfterMove === 0) {
            observations.push("Movement: dx set to 1, dy set to 0 after ArrowRight press.");
        } else {
            observations.push(`Movement: dx,dy not set as expected. dx=${dxAfterMove}, dy=${dyAfterMove}`);
        }
        if (snakeAfterMove && snakeAfterMove.length > 0 && snakeAfterMove[0].x > initialSnake[0].x) {
            observations.push(`Movement: Snake moved right. New head X: ${snakeAfterMove[0].x}`);
        } else {
            observations.push(`Movement: Snake did not move right as expected. Current snake: ${JSON.stringify(snakeAfterMove)}`);
        }

        // --- 3. Food Consumption & Growth ---
        observations.push("Food Test: Setting up food consumption scenario.");
        const initialScore = await page.evaluate(() => score);
        const initialLength = await page.evaluate(() => snake.length);

        // Place food directly in front of the snake's next move
        // Current head is snakeAfterMove[0]
        // It will move to snakeAfterMove[0].x + dxAfterMove, snakeAfterMove[0].y + dyAfterMove
        // For simplicity, let's reset snake and food for a clean test
        await page.evaluate(() => {
            snake = [{ x: 5, y: 5 }];
            food = { x: 6, y: 5 }; // Food will be one step to the right
            dx = 1; dy = 0; // Ensure snake is moving towards food
            score = 0; // Reset score for this test
            updateScoreDisplay();
            drawGame(); // Redraw with new positions
        });
        await new Promise(resolve => setTimeout(resolve, 100)); // Game state before eating
        await page.evaluate(() => updateGame()); // Manually trigger one game update
        await new Promise(resolve => setTimeout(resolve, 100)); // Game state after eating

        const scoreAfterFood = await page.evaluate(() => score);
        const lengthAfterFood = await page.evaluate(() => snake.length);

        if (scoreAfterFood > initialScore) {
            observations.push(`Food Consumption: Score increased to ${scoreAfterFood}.`);
        } else {
            observations.push(`Food Consumption: Score did not increase. Score: ${scoreAfterFood}`);
        }
        if (lengthAfterFood > initialLength) {
            observations.push(`Food Consumption: Snake grew. New length: ${lengthAfterFood}.`);
        } else {
            observations.push(`Food Consumption: Snake did not grow. Length: ${lengthAfterFood}. Initial length for this test was 1.`);
        }
        
        // --- 4. Wall Collision ---
        observations.push("Wall Collision Test: Setting up wall collision.");
        // Dismiss any previous alerts (like game over from other tests if any)
        let gameContinued = true;
        page.on('dialog', async dialog => {
            observations.push(`Wall Collision: Game Over alert detected: "${dialog.message()}"`);
            await dialog.dismiss();
            gameContinued = false;
        });

        await page.evaluate(() => {
            snake = [{ x: tileCountX - 1, y: 5 }]; // Head near the right wall
            dx = 1; dy = 0; // Moving right
            drawGame();
        });
        await new Promise(resolve => setTimeout(resolve, 100)); // Before collision
        await page.evaluate(() => updateGame()); // Trigger update that should cause collision
        await new Promise(resolve => setTimeout(resolve, 300)); // Give time for alert to appear and be handled

        if (!gameContinued) {
             observations.push("Wall Collision: Test indicates game over occurred as expected.");
        } else {
             observations.push("Wall Collision: Game did not seem to end after hitting a wall. `gameContinued` is true.");
             // Check if gameLoop is still running
             const gameLoopActive = await page.evaluate(() => typeof gameLoop !== 'undefined' && gameLoop !== null);
             if (gameLoopActive) {
                observations.push("Wall Collision: gameLoop variable is still defined, suggesting it wasn't cleared.");
             } else {
                observations.push("Wall Collision: gameLoop variable is cleared, but dialog event wasn't caught as expected.");
             }
        }
        
        // Reset game state for self-collision test
        gameContinued = true; // Reset for next test
        await page.evaluate(() => {
            // Clear any existing dialog listeners from previous test by re-assigning
            // This is a bit of a hack for puppeteer; normally you'd remove specific listeners
            // For this environment, re-evaluating the page context might be the simplest.
            snake = [{x: 5, y: 5}, {x: 4, y: 5}, {x: 3, y: 5}, {x: 2, y: 5}]; // Snake of length 4
            dx = 1; dy = 0; // Moving right
            // Force a turn into itself
            // Head is at (5,5). Next move (6,5).
            // If we change direction to left (dx=-1), head will be (4,5) which is a self-collision
            snake[0] = {x:5,y:5}; // ensure head position
            dx = -1; dy = 0; // Change direction to left
            updateScoreDisplay(); // Reset score display in case
            drawGame();
        });
        
        // --- 5. Self Collision ---
        observations.push("Self Collision Test: Setting up self collision.");
        // Re-attach dialog listener specifically for this test, or ensure it's general enough.
        // The previous page.on('dialog') should still be active if not removed.
        // Let's make it more specific for this test to avoid cross-test contamination if possible
        let selfCollisionGameOver = false;
        const selfCollisionListener = async (dialog) => {
            observations.push(`Self Collision: Game Over alert detected: "${dialog.message()}"`);
            await dialog.dismiss();
            selfCollisionGameOver = true;
            page.off('dialog', selfCollisionListener); // Remove this specific listener
        };
        page.on('dialog', selfCollisionListener);

        await new Promise(resolve => setTimeout(resolve, 100)); // before collision
        await page.evaluate(() => updateGame()); // Trigger update for self-collision
        await new Promise(resolve => setTimeout(resolve, 300)); // Give time for alert

        if (selfCollisionGameOver) {
            observations.push("Self Collision: Test indicates game over occurred as expected.");
        } else {
            observations.push("Self Collision: Game did not seem to end after self-collision.");
             const gameLoopActive = await page.evaluate(() => typeof gameLoop !== 'undefined' && gameLoop !== null);
             if (gameLoopActive) {
                observations.push("Self Collision: gameLoop variable is still defined, suggesting it wasn't cleared.");
             } else {
                observations.push("Self Collision: gameLoop variable is cleared, but dialog event wasn't caught as expected.");
             }
        }
        page.off('dialog', selfCollisionListener); // Clean up listener if it didn't fire


    } catch (e) {
        console.error("Error during Puppeteer test:", e);
        errors.push(`Error during Puppeteer test: ${e.toString()}`);
    } finally {
        if (browser) {
            await browser.close();
        }
    }

    console.log("\n--- Observations ---");
    observations.forEach(obs => console.log(obs));
    if (errors.length > 0) {
        console.log("\n--- Errors ---");
        errors.forEach(err => console.log(err));
    }
    return { observations, errors };
}

runGameTest();
