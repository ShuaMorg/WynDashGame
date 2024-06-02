const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const playerImage = new Image();
playerImage.src = 'image.png'; // Replace with the path to your player image

const obstacleImage = new Image();
obstacleImage.src = 'jj.png'; // Replace with the path to your obstacle image

const player = {
    x: canvas.width * 0.1, // Initial x position scaled with canvas width
    y: canvas.height * 0.75, // Initial y position scaled with canvas height
    width: canvas.width * 0.04, // Player width scaled with canvas width
    height: canvas.width * 0.04, // Player height scaled with canvas width
    dy: 0,
    gravity: canvas.height * 0.002, // Gravity scaled with canvas height
    jumpPower: -canvas.height * 0.03, // Jump power scaled with canvas height
    grounded: false,
    jumping: false,
    scoreEligible: false
};

const obstacles = [];
let obstacleTimer = 0;
const obstacleInterval = canvas.width * 0.08; // Obstacle interval scaled with canvas width

let score = 0;
let coin = null;

const owSound = new Audio('ow.mp3'); // Load the sound file

// Function to set canvas size based on the viewport size
function setCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // Update player position and size relative to canvas size
    player.x = canvas.width * 0.1;
    player.y = canvas.height * 0.75;
    player.width = canvas.width * 0.04;
    player.height = canvas.width * 0.04;
    player.gravity = canvas.height * 0.002;
    player.jumpPower = -canvas.height * 0.03;
    obstacleInterval = canvas.width * 0.08;
}

// Call setCanvasSize function initially and on window resize
setCanvasSize();
window.addEventListener('resize', setCanvasSize);

function createObstacle() {
    const obstacle = {
        x: canvas.width,
        y: canvas.height * 0.75, // Initial y position scaled with canvas height
        width: canvas.width * 0.04, // Obstacle width scaled with canvas width
        height: canvas.width * 0.04, // Obstacle height scaled with canvas width
        image: obstacleImage,
        passed: false
    };
    obstacles.push(obstacle);

    // Create a coin after the obstacle is created
    if (!coin) {
        createCoin(obstacle.x + canvas.width * 0.2); // Coin placed 20% of canvas width after the obstacle
    }
}

function updateObstacles() {
    obstacleTimer++;
    if (obstacleTimer % obstacleInterval === 0) {
        createObstacle();
    }
    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].x -= canvas.width * 0.01; // Obstacle speed scaled with canvas width
        if (obstacles[i].x + obstacles[i].width < 0) {
            obstacles.splice(i, 1);
        }
    }
}

function drawObstacles() {
    for (const obstacle of obstacles) {
        ctx.drawImage(obstacle.image, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    }
}

function createCoin(xPosition) {
    coin = {
        x: xPosition,
        y: canvas.height * 0.6, // Coin y position scaled with canvas height
        width: canvas.width * 0.03, // Coin width scaled with canvas width
        height: canvas.width * 0.03, // Coin height scaled with canvas width
        color: '#ffd700'
    };
}

function updateCoin() {
    if (coin) {
        coin.x -= canvas.width * 0.01; // Coin speed scaled with canvas width
        if (coin.x + coin.width < 0) {
            coin = null; // Remove coin if it goes off-screen
        }
    }
}

function drawCoin() {
    if (coin) {
        ctx.fillStyle = coin.color;
        ctx.beginPath();
        ctx.arc(coin.x + coin.width / 2, coin.y + coin.height / 2, coin.width / 2, 0, Math.PI * 2);
        ctx.fill();
    }
}

function handleInput() {
    window.addEventListener('keydown', (e) => {
        if (player.grounded && e.code === 'Space') {
            player.dy = player.jumpPower;
            player.grounded = false;
            player.jumping = true;
            player.scoreEligible = true;
        }
    });
}

function updatePlayer() {
    player.dy += player.gravity;
    player.y += player.dy;
    
    if (player.y + player.height >= canvas.height) {
        player.y = canvas.height - player.height;
        player.dy = 0;
        player.grounded = true;
        player.jumping = false;
    }
}

function drawPlayer() {
    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
}

function drawScore() {
    ctx.fillStyle = '#fff';
    ctx.font = `${canvas.width * 0.03}px Arial`; // Font size scaled with canvas width
    ctx.fillText(`Score: ${score}`, canvas.width * 0.02, canvas.height * 0.05); // Position scaled with canvas dimensions
}

function checkCollisions() {
    for (const obstacle of obstacles) {
        if (player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.height > obstacle.y) {
            owSound.play(); // Play sound on collision
            alert('Game Over');
            document.location.reload();
        }

        if (player.jumping && player.scoreEligible && player.x > obstacle.x + obstacle.width) {
            player.scoreEligible = false;
            score++;
        }
    }

    if (coin &&
        player.x < coin.x + coin.width &&
        player.x + player.width > coin.x &&
        player.y < coin.y + coin.height &&
        player.y + player.height > coin.y) {
        score += 10;
        coin = null; // Remove the coin after collecting
    }
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    updatePlayer();
    updateObstacles();
    updateCoin();
    checkCollisions();
    
    drawPlayer();
    drawObstacles();
    drawCoin();
    drawScore();
    
    requestAnimationFrame(gameLoop);
}

handleInput();
gameLoop();


