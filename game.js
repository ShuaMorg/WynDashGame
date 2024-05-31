const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const playerImage = new Image();
playerImage.src = 'image.png'; // Replace with the path to your player image

const obstacleImage = new Image();
obstacleImage.src = 'jj.png'; // Replace with the path to your obstacle image

const player = {
    x: 50,
    y: 300,
    width: 20,
    height: 20,
    dy: 0,
    gravity: 0.6,
    jumpPower: -15,
    grounded: false,
    jumping: false,
    scoreEligible: false
};

const obstacles = [];
let obstacleTimer = 0;
const obstacleInterval = 60;

let score = 0;
let coin = null;

const owSound = new Audio('ow.mp3'); // Load the sound file

function createObstacle() {
    const obstacle = {
        x: canvas.width,
        y: 300,
        width: 20,
        height: 20,
        image: obstacleImage,
        passed: false
    };
    obstacles.push(obstacle);

    // Create a coin after the obstacle is created
    if (!coin) {
        createCoin(obstacle.x + 200); // Coin placed 200px after the obstacle
    }
}

function updateObstacles() {
    obstacleTimer++;
    if (obstacleTimer % obstacleInterval === 0) {
        createObstacle();
    }
    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].x -= 5;
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
        y: 250, // Coin is slightly above the ground
        width: 15,
        height: 15,
        color: '#ffd700'
    };
}

function updateCoin() {
    if (coin) {
        coin.x -= 5;
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
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
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
