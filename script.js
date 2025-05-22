// Canvas Setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const tileSize = 20;
let tileCountX;
let tileCountY;

// Game State Variables
let gameStarted = false;
const gameVersion = "0.5.0";
let playerName = "Player";
let snake = [];
let food = { x: 0, y: 0, active: false };
let score = 0;
let dx = 0;
let dy = 0;
let changingDirection = false;
let gameLoop;
let currentSpeedInterval;
let baseSpeedInterval;

// Turbo Variables
let isTurboActive = false;
let turboTimer = null;
let turboDurationUnits = 3;
let turboPowerMultiplier = 2.0;
const TURBO_DURATION_MS = 3000;

// SlowMo Variables
let isSlowMoActive = false;
let slowMoTimer = null;
let slowMoUnits = 0;
const SLOWMO_DURATION_MS = 3000;
const SLOWMO_SPEED_FACTOR = 0.5;
const SLOWMO_COMBO_TIMER_FACTOR = 0.5;

// Shield Variables
let shields = 0;

// Item Types
const ItemType = { BONUS_FOOD: 'bonus_food', BAD_ITEM: 'bad_item' };
const BonusFoodEffect = { TURBO_UNITS: 'turbo_units', TURBO_POWER: 'turbo_power', REDUCE_LENGTH: 'reduce_length', ADD_SHIELD: 'add_shield', ADD_SLOWMO: 'add_slowmo' };
const BadItemType = { MOVING_SPIKE: 'moving_spike', STATIC_SPIKES: 'static_spikes', WALL_OBSTACLE: 'wall_obstacle', SHRINKING_ZONE: 'shrinking_zone' };

let items = [];
const ITEM_SPAWN_CHANCE = 0.25;
const BAD_ITEM_PROBABILITY = 0.4;

// Combo Variables
let comboMultiplier = 1;
let comboTimerId = null;
let comboTimeRemaining = 0;
const COMBO_BASE_DURATION = 3000;
const COMBO_TIMER_UPDATE_INTERVAL = 100;

// High Score
let highScore = 0;
let highScoreName = "CPU";

// DOM Elements
const gameContainer = document.getElementById('gameContainer');
const splashScreen = document.getElementById('splashScreen');
const playerNameInput = document.getElementById('playerNameInput');
const startGameButton = document.getElementById('startGameButton');
const gameOverScreen = document.getElementById('gameOverScreen');
const restartGameButton = document.getElementById('restartGameButton');
const playerNameGameOverDisplay = document.getElementById('playerNameGameOver');
const finalScoreDisplay = document.getElementById('finalScore');
const gameUiOverlay = document.getElementById('gameUiOverlay');

const scoreDisplay = document.getElementById('score');
const gameVersionSplashDisplay = document.getElementById('gameVersionSplash');
const gameVersionFooterDisplay = document.getElementById('gameVersionFooter');
const gameSpeedSlider = document.getElementById('gameSpeedSlider');
const comboMultiplierDisplay = document.getElementById('comboMultiplier');
const shieldCountDisplay = document.getElementById('shieldCount');
const turboUnitsDisplay = document.getElementById('turboUnitsDisplay');
const turboPowerDisplay = document.getElementById('turboPowerDisplay');
const slowMoUnitsDisplay = document.getElementById('slowMoUnitsDisplay');
const bonusMessageDisplay = document.getElementById('bonusMessage');
const highScoreDisplay = document.getElementById('highScore');
const highScoreNameDisplay = document.getElementById('highScoreName');
const comboTimerDisplayElement = document.getElementById('comboTimerDisplay');
const comboTimeLeftDisplay = document.getElementById('comboTimeLeft');

let bonusMessageTimeout;
let originalCanvasWidth = 600;
let originalCanvasHeight = 400;

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', initializeGame);

function initializeGame() {
    canvas.width = gameContainer.clientWidth || originalCanvasWidth;
    canvas.height = gameContainer.clientHeight || originalCanvasHeight;
    recalculateTileCounts();

    if(gameVersionSplashDisplay) gameVersionSplashDisplay.textContent = gameVersion;
    if(gameVersionFooterDisplay) gameVersionFooterDisplay.textContent = gameVersion;
    
    loadHighScore();
    updateHighScoreDisplayUI();

    if(gameSpeedSlider) {
        gameSpeedSlider.addEventListener('input', handleSpeedSliderChange);
        baseSpeedInterval = calculateIntervalFromSlider(gameSpeedSlider.value);
        currentSpeedInterval = baseSpeedInterval;
    } else {
        baseSpeedInterval = 100;
        currentSpeedInterval = baseSpeedInterval;
    }
    
    resetGameStateBeforeStart();
    updateUIDisplay();
    showSplashScreen();
    drawGame();

    if(startGameButton) startGameButton.addEventListener('click', handleStartGameButtonClick);
    if(restartGameButton) restartGameButton.addEventListener('click', handleStartGameButtonClick);

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('keydown', handleKeyDown);
}

function recalculateTileCounts() {
    tileCountX = Math.floor(canvas.width / tileSize);
    tileCountY = Math.floor(canvas.height / tileSize);
}

function resetGameStateBeforeStart() {
    snake = [{ x: Math.floor(tileCountX / 2), y: Math.floor(tileCountY / 2) }];
    dx = 0; dy = 0; score = 0; shields = 0;
    turboDurationUnits = 3; turboPowerMultiplier = 2.0;
    slowMoUnits = 0;
    isTurboActive = false; if (turboTimer) clearTimeout(turboTimer);
    isSlowMoActive = false; if (slowMoTimer) clearTimeout(slowMoTimer);
    resetCombo();
    placeFoodCore();
    items = [];
    changingDirection = false;
}

function handleStartGameButtonClick() {
    if (playerNameInput) {
        playerName = playerNameInput.value.trim();
        if (playerName === "") {
            playerName = "YourName";
        }
    } else {
        playerName = "YourName";
    }
    if (playerName.length > 15) playerName = playerName.substring(0, 15);
    if(playerNameInput) playerNameInput.value = playerName; 

    dx = 0; 
    dy = 0; 
    
    startGame();
}

function startGame() {
    if (gameStarted && (dx !==0 || dy !==0 )) return;

    console.log("Attempting to start game with player:", playerName); // DEBUG

    gameStarted = true;
    hideSplashScreen();
    hideGameOverScreen();
    showGameUI();

    resetFullGameStateForNewGame();
    updateUIDisplay();
    drawGame(); 

    if (gameLoop) clearInterval(gameLoop); // Clear any old loop just in case
    currentSpeedInterval = baseSpeedInterval; // Ensure speed is reset
    if (isSlowMoActive) currentSpeedInterval /= SLOWMO_SPEED_FACTOR; // Apply if slowmo somehow pre-active (shouldn't be)
    if (isTurboActive) currentSpeedInterval = Math.max(20, Math.round(baseSpeedInterval / turboPowerMultiplier)); // Apply if turbo somehow pre-active
    
    gameLoop = setInterval(updateGame, currentSpeedInterval);
    console.log("Game loop started with interval:", currentSpeedInterval); // DEBUG
}

function resetFullGameStateForNewGame() {
    snake = [{ x: Math.floor(tileCountX / 2), y: Math.floor(tileCountY / 2) }];
    // dx and dy are now explicitly 0 from handleStartGameButtonClick, awaiting first arrow
    score = 0; shields = 0;
    turboDurationUnits = 3; slowMoUnits = 0; turboPowerMultiplier = 2.0;
    isTurboActive = false; if (turboTimer) clearTimeout(turboTimer);
    isSlowMoActive = false; if (slowMoTimer) clearTimeout(slowMoTimer);
    resetCombo();
    placeFood(); items = []; 
    if (gameLoop) { clearInterval(gameLoop); gameLoop = null; }
    changingDirection = false;
}

// --- UI VISIBILITY ---
function showSplashScreen() {
    splashScreen.style.display = 'block';
    gameUiOverlay.style.display = 'none';
    gameOverScreen.style.display = 'none';
    canvas.style.opacity = '0.3';
    if (playerNameInput) { playerNameInput.value = "YourName"; }
}
function hideSplashScreen() { splashScreen.style.display = 'none'; canvas.style.opacity = '1';}
function showGameOverScreen() {
    gameOverScreen.style.display = 'block';
    playerNameGameOverDisplay.textContent = playerName;
    finalScoreDisplay.textContent = score;
    gameUiOverlay.style.display = 'none';
    canvas.style.opacity = '0.3';
}
function hideGameOverScreen() { gameOverScreen.style.display = 'none'; canvas.style.opacity = '1';}
function showGameUI() { gameUiOverlay.style.display = 'block';}

// --- FULLSCREEN ---
function toggleGameFullscreen() { 
    if (!document.fullscreenElement) { 
        gameContainer.requestFullscreen().catch(err => console.warn(`FS Error: ${err.message}`)); 
    } else { 
        if (document.exitFullscreen) document.exitFullscreen(); 
    }
}
function handleFullscreenChange() { 
    const isFs = document.fullscreenElement === gameContainer; 
    if (isFs) { 
        canvas.width = window.innerWidth; 
        canvas.height = window.innerHeight; 
    } else { 
        canvas.width = gameContainer.clientWidth || originalCanvasWidth; 
        canvas.height = gameContainer.clientHeight || originalCanvasHeight; 
    } 
    recalculateTileCounts(); 
    if (gameStarted) { 
        snake.forEach(s => { s.x = Math.min(Math.max(0, s.x), tileCountX - 1); s.y = Math.min(Math.max(0, s.y), tileCountY - 1); }); 
        if (food.active) { food.x = Math.min(Math.max(0, food.x), tileCountX - 1); food.y = Math.min(Math.max(0, food.y), tileCountY - 1); } 
        items.forEach(i => { i.x = Math.min(Math.max(0, i.x), tileCountX -1); i.y = Math.min(Math.max(0, i.y), tileCountY -1); if (i.parts) i.parts.forEach(p => { p.x = Math.min(Math.max(0, p.x), tileCountX - 1); p.y = Math.min(Math.max(0, p.y), tileCountY - 1); }); }); 
    } else { 
        snake = [{ x: Math.floor(tileCountX / 2), y: Math.floor(tileCountY / 2) }]; 
        if (food.active || !food.active) placeFoodCore(); 
    } 
    drawGame(); 
}

// --- SPEED SLIDER ---
function calculateIntervalFromSlider(v) { 
    const minI=50,maxI=200,minS=parseInt(gameSpeedSlider.min),maxS=parseInt(gameSpeedSlider.max); 
    let nV=(parseInt(v)-minS)/(maxS-minS); 
    return Math.round(maxI-nV*(maxI-minI));
}
function handleSpeedSliderChange() { 
    baseSpeedInterval=calculateIntervalFromSlider(gameSpeedSlider.value); 
    if(gameStarted&&!isTurboActive&&!isSlowMoActive){
        currentSpeedInterval=baseSpeedInterval;
        clearInterval(gameLoop);
        gameLoop=setInterval(updateGame,currentSpeedInterval);
    } else if(!isTurboActive&&!isSlowMoActive){
        currentSpeedInterval=baseSpeedInterval;
    }
}

// --- DRAWING ---
function drawGame(){
    ctx.fillStyle='black';ctx.fillRect(0,0,canvas.width,canvas.height);
    drawSnake();if(food.active)drawFood();drawItems();
}
function drawSnake(){
    ctx.fillStyle='lime';
    snake.forEach(s=>{ctx.fillRect(s.x*tileSize,s.y*tileSize,tileSize-1,tileSize-1);});
    if(shields>0&&snake.length>0){ctx.fillStyle='cyan';ctx.fillRect(snake[0].x*tileSize,snake[0].y*tileSize,tileSize-1,tileSize-1);}
}
function drawFood(){ctx.fillStyle='red';ctx.fillRect(food.x*tileSize,food.y*tileSize,tileSize,tileSize);}
function drawItems(){
    items.forEach(i=>{
        if(!i.active)return;
        switch(i.itemSubType){
            case BonusFoodEffect.TURBO_UNITS:case BonusFoodEffect.TURBO_POWER:
            case BonusFoodEffect.REDUCE_LENGTH:case BonusFoodEffect.ADD_SHIELD:
            case BonusFoodEffect.ADD_SLOWMO:drawBonusFoodItem(i);break;
            case BadItemType.MOVING_SPIKE:drawMovingSpike(i);break;
            case BadItemType.STATIC_SPIKES:drawStaticSpikes(i);break;
            case BadItemType.WALL_OBSTACLE:drawWallObstacle(i);break;
            case BadItemType.SHRINKING_ZONE:drawShrinkingZone(i);break;
        }
    });
}
function drawBonusFoodItem(i){
    let c='gold';
    if(i.itemSubType===BonusFoodEffect.ADD_SLOWMO)c='#64b5f6';
    if(i.itemSubType===BonusFoodEffect.ADD_SHIELD)c='cyan';
    if(i.itemSubType===BonusFoodEffect.TURBO_UNITS||i.itemSubType===BonusFoodEffect.TURBO_POWER)c='orange';
    ctx.fillStyle=c;const dX=i.x*tileSize+tileSize/2,dY=i.y*tileSize+tileSize/2;
    ctx.beginPath();ctx.arc(dX,dY,tileSize/2.2,0,2*Math.PI);ctx.fill();
    ctx.fillStyle='white';
    for(let k=0;k<2;k++)ctx.fillRect(dX-tileSize/2+Math.random()*(tileSize-4)+2,dY-tileSize/2+Math.random()*(tileSize-4)+2,2,2);
}
function drawMovingSpike(i){
    ctx.fillStyle='#c62828';ctx.beginPath();
    const x=i.x*tileSize+tileSize/2,y=i.y*tileSize+tileSize/2;
    if(i.dx===1){ctx.moveTo(x-tileSize/3,y-tileSize/2);ctx.lineTo(x+tileSize/2,y);ctx.lineTo(x-tileSize/3,y+tileSize/2);}
    else if(i.dx===-1){ctx.moveTo(x+tileSize/3,y-tileSize/2);ctx.lineTo(x-tileSize/2,y);ctx.lineTo(x+tileSize/3,y+tileSize/2);}
    else if(i.dy===1){ctx.moveTo(x-tileSize/2,y-tileSize/3);ctx.lineTo(x,y+tileSize/2);ctx.lineTo(x+tileSize/2,y-tileSize/3);}
    else{ctx.moveTo(x-tileSize/2,y+tileSize/3);ctx.lineTo(x,y-tileSize/2);ctx.lineTo(x+tileSize/2,y+tileSize/3);}
    ctx.closePath();ctx.fill();
}
function drawStaticSpikes(i){
    ctx.fillStyle='#757575';
    i.parts.forEach(p=>{
        ctx.beginPath();
        ctx.moveTo(p.x*tileSize,p.y*tileSize+tileSize);
        ctx.lineTo(p.x*tileSize+tileSize/2,p.y*tileSize);
        ctx.lineTo(p.x*tileSize+tileSize,p.y*tileSize+tileSize);
        ctx.closePath();ctx.fill();
    });
}
function drawWallObstacle(i){
    ctx.fillStyle='#e0e0e0';ctx.strokeStyle='#9e9e9e';ctx.lineWidth=1;
    i.parts.forEach(p=>{
        ctx.fillRect(p.x*tileSize,p.y*tileSize,tileSize,tileSize);
        ctx.strokeRect(p.x*tileSize,p.y*tileSize,tileSize,tileSize);
    });
}
function drawShrinkingZone(i){
    const x=i.x*tileSize+tileSize/2,y=i.y*tileSize+tileSize/2,rPx=i.currentRadius*tileSize;
    if(rPx<=0)return;
    ctx.beginPath();ctx.arc(x,y,rPx,0,2*Math.PI);
    const a=0.3+0.2*Math.sin(Date.now()/200);
    ctx.fillStyle=`rgba(186,104,200,${a})`;ctx.fill();
    ctx.strokeStyle=`rgba(156,39,176,${a+0.2})`;ctx.lineWidth=2;ctx.stroke();
}

// --- UI UPDATES ---
function updateUIDisplay(){
    if(scoreDisplay)scoreDisplay.textContent=score;
    if(comboMultiplierDisplay)comboMultiplierDisplay.textContent=comboMultiplier.toFixed(1)+'x';
    if(shieldCountDisplay)shieldCountDisplay.textContent=shields;
    if(turboUnitsDisplay)turboUnitsDisplay.textContent=turboDurationUnits;
    if(turboPowerDisplay)turboPowerDisplay.textContent=turboPowerMultiplier.toFixed(1)+'x';
    if(slowMoUnitsDisplay)slowMoUnitsDisplay.textContent=slowMoUnits;
    updateHighScoreDisplayUI();
}
function showBonusMessage(m,d=2500){
    if(bonusMessageDisplay){
        bonusMessageDisplay.textContent=m;
        if(bonusMessageTimeout)clearTimeout(bonusMessageTimeout);
        bonusMessageTimeout=setTimeout(()=>{bonusMessageDisplay.textContent='';},d);
    }
}

// --- HIGH SCORE ---
function loadHighScore(){
    const sS=localStorage.getItem('snakeHighScore_v0_5_0'),sN=localStorage.getItem('snakeHighScoreName_v0_5_0');
    highScore=sS?parseInt(sS,10):0;highScoreName=sN||"CPU";
}
function saveHighScore(){localStorage.setItem('snakeHighScore_v0_5_0',highScore.toString());localStorage.setItem('snakeHighScoreName_v0_5_0',highScoreName);}
function updateHighScoreDisplayUI(){if(highScoreDisplay)highScoreDisplay.textContent=highScore;if(highScoreNameDisplay)highScoreNameDisplay.textContent=highScoreName;}
function checkAndSaveHighScore(){
    if(score>highScore){
        highScore=score;highScoreName=playerName;
        saveHighScore();updateHighScoreDisplayUI();
        showBonusMessage(`${highScoreName} set New High Score: ${highScore}!`,3500);
    }
}

// --- COMBO MECHANICS ---
function startOrExtendCombo(){if(comboTimeRemaining<=0&&comboMultiplier===1)comboMultiplier=1;extendCombo();}
function extendCombo(){
    if(comboTimerId)clearInterval(comboTimerId);
    comboMultiplier=Math.min(16,comboMultiplier*2);
    comboTimeRemaining=COMBO_BASE_DURATION;
    if(isSlowMoActive)comboTimeRemaining/=SLOWMO_COMBO_TIMER_FACTOR;
    if(comboTimerDisplayElement)comboTimerDisplayElement.style.display='block';
    updateComboTimerDisplay();updateUIDisplay();
    showBonusMessage(`Combo x${comboMultiplier.toFixed(0)}! +${(COMBO_BASE_DURATION/1000).toFixed(0)}s`,1000);
    comboTimerId=setInterval(()=>{
        comboTimeRemaining-=COMBO_TIMER_UPDATE_INTERVAL;
        if(comboTimeRemaining<=0)resetCombo();else updateComboTimerDisplay();
    },COMBO_TIMER_UPDATE_INTERVAL*(isSlowMoActive?(1/SLOWMO_COMBO_TIMER_FACTOR):1));
}
function resetCombo(){
    if(comboTimerId)clearInterval(comboTimerId);
    comboTimerId=null;comboMultiplier=1;comboTimeRemaining=0;
    if(comboTimerDisplayElement)comboTimerDisplayElement.style.display='none';
    updateUIDisplay();
}
function updateComboTimerDisplay(){if(comboTimeLeftDisplay)comboTimeLeftDisplay.textContent=(comboTimeRemaining/1000).toFixed(1);}

// --- SLOWMO MECHANICS ---
function activateSlowMo(){
    if(!gameStarted||isSlowMoActive||slowMoUnits<=0||isTurboActive)return;
    isSlowMoActive=true;slowMoUnits--;updateUIDisplay();showBonusMessage("Slow Mo Activated!",1500);
    currentSpeedInterval/=SLOWMO_SPEED_FACTOR;
    if(gameLoop){clearInterval(gameLoop);gameLoop=setInterval(updateGame,currentSpeedInterval);}
    if(comboTimeRemaining>0){comboTimeRemaining/=SLOWMO_COMBO_TIMER_FACTOR;extendCombo();}
    slowMoTimer=setTimeout(deactivateSlowMo,SLOWMO_DURATION_MS/SLOWMO_SPEED_FACTOR);
}
function deactivateSlowMo(){
    if(!isSlowMoActive)return;
    isSlowMoActive=false;clearTimeout(slowMoTimer);slowMoTimer=null;showBonusMessage("Slow Mo Finished",1500);
    currentSpeedInterval*=SLOWMO_SPEED_FACTOR;
    if(gameStarted&&gameLoop){clearInterval(gameLoop);gameLoop=setInterval(updateGame,currentSpeedInterval);}
    if(comboTimeRemaining>0){comboTimeRemaining*=SLOWMO_COMBO_TIMER_FACTOR;extendCombo();}
}

// --- ITEM SPAWNING & MANAGEMENT ---
function trySpawnItem(){
    if(items.length>=5)return;
    if(Math.random()<ITEM_SPAWN_CHANCE){
        if(Math.random()<BAD_ITEM_PROBABILITY)spawnBadItem();else spawnBonusFood();
    }
}
function spawnBonusFood(){
    const eK=Object.values(BonusFoodEffect),iST=eK[Math.floor(Math.random()*eK.length)];
    let nI={type:ItemType.BONUS_FOOD,itemSubType:iST,x:0,y:0,dx:0,dy:0,speed:0.02+Math.random()*0.03,active:true};
    nI.x=Math.floor(Math.random()*(tileCountX-4))+2;nI.y=Math.floor(Math.random()*(tileCountY-4))+2;
    const tE=Math.floor(Math.random()*4);
    if(tE===0){nI.dx=0;nI.dy=-1;}else if(tE===1){nI.dx=1;nI.dy=0;}
    else if(tE===2){nI.dx=0;nI.dy=1;}else{nI.dx=-1;nI.dy=0;}
    if(!isOccupied(Math.floor(nI.x),Math.floor(nI.y),true))items.push(nI);
}
function spawnBadItem(){
    const bTK=Object.values(BadItemType),iST=bTK[Math.floor(Math.random()*bTK.length)];
    let nI={type:ItemType.BAD_ITEM,itemSubType:iST,x:0,y:0,active:true,parts:[]};let cPI=true;
    switch(iST){
        case BadItemType.MOVING_SPIKE:
            nI.x=Math.floor(Math.random()*(tileCountX-2))+1;nI.y=Math.floor(Math.random()*(tileCountY-2))+1;
            const d=Math.floor(Math.random()*4);
            nI.dx=(d===0)?1:(d===1)?-1:0;nI.dy=(d===2)?1:(d===3)?-1:0;
            if(nI.dx===0&&nI.dy===0)nI.dx=(Math.random()<0.5?1:-1);
            nI.speed=0.04+Math.random()*0.03;
            if(isOccupied(Math.floor(nI.x),Math.floor(nI.y),true))cPI=false;break;
        case BadItemType.STATIC_SPIKES:
            const nS=Math.floor(Math.random()*4)+3;
            for(let i=0;i<nS;i++){
                let pX,pY,att=0;
                do{pX=Math.floor(Math.random()*tileCountX);pY=Math.floor(Math.random()*tileCountY);att++;}
                while(isOccupied(pX,pY,false)&&att<20);
                if(att<20)nI.parts.push({x:pX,y:pY});else{cPI=false;break;}
            }
            break;
        case BadItemType.WALL_OBSTACLE:
            const l=Math.floor(Math.random()*4)+3,iV=Math.random()<0.5;
            let sX=Math.floor(Math.random()*(tileCountX-(iV?1:l))),sY=Math.floor(Math.random()*(tileCountY-(iV?l:1)));
            for(let i=0;i<l;i++){
                const pX=sX+(iV?0:i),pY=sY+(iV?i:0);
                if(isOccupied(pX,pY,false)){cPI=false;break;}
                nI.parts.push({x:pX,y:pY});
            }
            break;
        case BadItemType.SHRINKING_ZONE:
            nI.x=Math.floor(Math.random()*(tileCountX-6))+3;nI.y=Math.floor(Math.random()*(tileCountY-6))+3;
            nI.initialRadius=(2+Math.random()*2);nI.currentRadius=nI.initialRadius;
            nI.shrinkRate=0.005+Math.random()*0.005;
            if(isOccupied(Math.floor(nI.x),Math.floor(nI.y),true))cPI=false;
            break;
    }
    if(cPI)items.push(nI);
}
function isOccupied(x,y,inclItems=true){
    if(food.active&&food.x===x&&food.y===y)return true;
    for(let s of snake){if(s.x===x&&s.y===y)return true;}
    if(inclItems){
        for(let i of items){
            if(i.active){
                if(i.parts&&i.parts.length>0){for(let p of i.parts){if(p.x===x&&p.y===y)return true;}}
                else if(Math.floor(i.x)===x&&Math.floor(i.y)===y){return true;}
            }
        }
    }
    return false;
}
function placeFoodCore(){
    let att=0;
    do{food.x=Math.floor(Math.random()*tileCountX);food.y=Math.floor(Math.random()*tileCountY);att++;}
    while(isOccupied(food.x,food.y,true)&&att<50);
    if(att>=50)console.warn("Food placement fail.");food.active=true;
}
function placeFood(){placeFoodCore();items=items.filter(i=>i.active);trySpawnItem();}

// --- TURBO ---
function activateTurbo(){
    if(!gameStarted||isTurboActive||turboDurationUnits<=0||isSlowMoActive)return;
    isTurboActive=true;turboDurationUnits--;updateUIDisplay();
    const aTSI=Math.max(20,Math.round(baseSpeedInterval/turboPowerMultiplier));
    clearInterval(gameLoop);gameLoop=setInterval(updateGame,aTSI);
    showBonusMessage(`Turbo Activated! (${turboPowerMultiplier.toFixed(1)}x)`);
    turboTimer=setTimeout(deactivateTurbo,TURBO_DURATION_MS);
}
function deactivateTurbo(){
    if(!isTurboActive)return;
    isTurboActive=false;clearTimeout(turboTimer);turboTimer=null;
    currentSpeedInterval=baseSpeedInterval;
    if(isSlowMoActive)currentSpeedInterval/=SLOWMO_SPEED_FACTOR;
    if(gameStarted&&gameLoop){clearInterval(gameLoop);gameLoop=setInterval(updateGame,currentSpeedInterval);}
}

// --- GAME LOGIC ---
function updateGame() {
    if (!gameStarted) return;
    if (dx === 0 && dy === 0 && snake.length === 1 && !changingDirection) { // Snake is static, waiting for first move
        drawGame(); // Keep drawing the static scene
        return;
    }
    changingDirection = false;

    items.forEach((item) => {
        if (!item.active) return;
        if (item.type === ItemType.BONUS_FOOD || item.itemSubType === BadItemType.MOVING_SPIKE) {
            item.x += item.dx * item.speed; item.y += item.dy * item.speed;
            if (item.x < -0.5 || item.x > tileCountX -0.5 || item.y < -0.5 || item.y > tileCountY -0.5) item.active = false;
        }
        if (item.itemSubType === BadItemType.SHRINKING_ZONE) {
            const speedAdj = baseSpeedInterval / (currentSpeedInterval || baseSpeedInterval);
            item.currentRadius -= item.shrinkRate * speedAdj;
            if (item.currentRadius <= 0.1) item.active = false;
        }
    });
    items = items.filter(item => item.active);

    let head = { x: snake[0].x + dx, y: snake[0].y + dy };
    let wallCollision = false;
    if (head.x < 0 || head.x >= tileCountX || head.y < 0 || head.y >= tileCountY) {
        if (shields > 0) {
            shields--; showBonusMessage("Shield Used! Wall Warp!");
            if(head.x<0)head.x=tileCountX-1;else if(head.x>=tileCountX)head.x=0;
            if(head.y<0)head.y=tileCountY-1;else if(head.y>=tileCountY)head.y=0;
            updateUIDisplay();
        } else { wallCollision = true; }
    }
    if (wallCollision) { gameOver(); return; }
    
    snake.unshift(head);

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            if (shields > 0) { shields--; showBonusMessage("Shield Used! Phased Tail!"); updateUIDisplay(); } 
            else { gameOver(); return; }
            break; 
        }
    }
    
    let ateFoodThisTick = false;

    items.forEach(item => {
        if (!item.active || !gameStarted) return;
        const hXInt=Math.floor(head.x), hYInt=Math.floor(head.y);
        const iXInt=Math.floor(item.x), iYInt=Math.floor(item.y);

        if (item.type === ItemType.BONUS_FOOD) {
            if (hXInt === iXInt && hYInt === iYInt) {
                ateFoodThisTick = true; item.active = false;
                applyBonusFoodEffect(item.itemSubType);
                score += Math.floor(3 * comboMultiplier); updateUIDisplay();
            }
        } else if (item.type === ItemType.BAD_ITEM) {
            let collDet = false;
            if ((item.itemSubType === BadItemType.MOVING_SPIKE) && hXInt === iXInt && hYInt === iYInt) {
                collDet = true;
            } else if (item.itemSubType === BadItemType.STATIC_SPIKES || item.itemSubType === BadItemType.WALL_OBSTACLE) {
                for (const part of item.parts) if (hXInt === part.x && hYInt === part.y) { collDet = true; break; }
            } else if (item.itemSubType === BadItemType.SHRINKING_ZONE) {
                const dist = Math.sqrt(Math.pow(head.x - item.x, 2) + Math.pow(head.y - item.y, 2));
                if (dist < item.currentRadius) {
                    if (snake.length > 2 && Math.random() < 0.05) { snake.pop(); showBonusMessage("Zapped!", 300); }
                }
            }
            if (collDet) {
                if (shields > 0) { shields--; item.active = false; showBonusMessage("Shield Blocked Danger!"); updateUIDisplay(); } 
                else { gameOver(); return; }
            }
        }
    });
    items = items.filter(item => item.active);

    if (food.active && head.x === food.x && head.y === food.y) {
        ateFoodThisTick = true; food.active = false;
        startOrExtendCombo(); score += Math.floor(1 * comboMultiplier);
        placeFood(); updateUIDisplay();
    }

    if (!ateFoodThisTick) { if(snake.length > 1) snake.pop(); }
    if (!gameStarted) return;
    drawGame();
}

function applyBonusFoodEffect(effectType) {
    switch (effectType) {
        case BonusFoodEffect.TURBO_UNITS:
            turboDurationUnits += 2;
            showBonusMessage("+2 Turbo Units!");
            break;
        case BonusFoodEffect.TURBO_POWER:
            turboPowerMultiplier = parseFloat((turboPowerMultiplier + 0.1).toFixed(1));
            showBonusMessage(`Turbo Power!(${turboPowerMultiplier.toFixed(1)}x)`); // Fixed toFixed
            break;
        case BonusFoodEffect.REDUCE_LENGTH:
            const r = Math.max(1, Math.floor(snake.length * 0.2));
            if (snake.length - r >= 1) {
                for (let i = 0; i < r; i++) {
                    if (snake.length > 1) { // Ensure snake doesn't shrink to 0 length
                        snake.pop();
                    }
                }
                showBonusMessage("Snake Shrunk!");
            } else { // This 'else' correctly pairs with the 'if'
                showBonusMessage("Shrink Fail! (Too short)");
            }
            break;
        case BonusFoodEffect.ADD_SHIELD:
            shields++;
            showBonusMessage("+1 Shield!");
            break;
        case BonusFoodEffect.ADD_SLOWMO:
            slowMoUnits++;
            showBonusMessage("+1 SlowMo Unit!");
            activateSlowMo(); // Auto-activate slowmo on pickup
            break;
    }
    updateUIDisplay();
}

function gameOver() {
    if (!gameStarted) return; gameStarted = false;
    clearInterval(gameLoop); gameLoop = null;
    if (isTurboActive) deactivateTurbo();
    if (isSlowMoActive) deactivateSlowMo();
    resetCombo(); checkAndSaveHighScore();
    showGameOverScreen(); updateUIDisplay();
}

// --- INPUT HANDLING ---
function handleKeyDown(event) {
    const isArrowKey = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key);

    if (!gameStarted) {
        // Game not started: only handle 'F' for fullscreen and typing in player name input.
        // Game start is now handled by the button.
        if (document.activeElement === playerNameInput) {
            if (event.key === "Enter") {
                 if(startGameButton && typeof startGameButton.click === 'function') {
                    startGameButton.click(); // Simulate click on start game button
                 }
                 event.preventDefault();
            }
            return; // Allow typing in input field for other keys
        }
        if (event.key.toLowerCase() === 'f') {
            toggleGameFullscreen();
            event.preventDefault();
        }
        // Prevent arrow keys from scrolling page if not in input and game not started
        if (isArrowKey) {
            event.preventDefault();
        }

    } else { // Game is started
        if (isArrowKey) {
            if (changingDirection) return; // Prevent multiple direction changes per tick

            const newDx = dx; // Store potential new direction
            const newDy = dy; // Store potential new direction

            switch (event.key) {
                case 'ArrowUp':    if (dy === 0) { dx = 0; dy = -1; changingDirection = true; } break;
                case 'ArrowDown':  if (dy === 0) { dx = 0; dy = 1; changingDirection = true; } break;
                case 'ArrowLeft':  if (dx === 0) { dx = -1; dy = 0; changingDirection = true; } break;
                case 'ArrowRight': if (dx === 0) { dx = 1; dy = 0; changingDirection = true; } break;
            }
            // If this is the very first move (dx and dy were 0 from button start)
            // the changingDirection flag will be set, and dx/dy will be updated.
            // The gameLoop will then pick up this new dx/dy.
            event.preventDefault();
        } else if (event.key === 'Shift') {
            if (turboDurationUnits > 0 && !isSlowMoActive) activateTurbo();
            event.preventDefault();
        } else if (event.key.toLowerCase() === 'f') {
            toggleGameFullscreen();
            event.preventDefault();
        }
    }
}