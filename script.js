const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const gameContainer = document.getElementById("game-container");
const scoreElement = document.getElementById("score");

const gridSize = 20;
const dogSize = gridSize;
const boneSize = gridSize;
const speed = 10;

let dogX = 0;
let dogY = 0;
let dogDirection = 1; // 1: right, 2: down, 3: left, 4: up

let boneX = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
let boneY = Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;

let dogLength = 1;
let dogParts = [];

let score = 0;

let gameLoop;

function drawDog() {
    ctx.fillStyle = "green";
    for (let i = 0; i < dogLength; i++) {
        ctx.fillRect(dogParts[i].x, dogParts[i].y, dogSize, dogSize);
    }
}

function drawBone() {
    ctx.fillStyle = "red";
    ctx.fillRect(boneX, boneY, boneSize, boneSize);
}

function checkCollision(x1, y1, w1, h1, x2, y2, w2, h2) {
    return !(x1 + w1 < x2 || x2 + w2 < x1 || y1 + h1 < y2 || y2 + h2 < y1);
}

function checkGameOver() {
    for (let i = 1; i < dogLength; i++) {
        if (checkCollision(dogX, dogY, dogSize, dogSize, dogParts[i].x, dogParts[i].y, dogSize, dogSize)) {
            clearInterval(gameLoop);
            alert("Game Over! Your score: " + score);
            return true;
        }
    }
    return false;
}

function moveDog() {
    if (dogDirection === 1) {
        dogX += gridSize;
    } else if (dogDirection === 2) {
        dogY += gridSize;
    } else if (dogDirection === 3) {
        dogX -= gridSize;
    } else if (dogDirection === 4) {
        dogY -= gridSize;
    }

    if (dogX < 0) {
        dogX = canvas.width - gridSize;
    } else if (dogX >= canvas.width) {
        dogX = 0;
    }

    if (dogY < 0) {
        dogY = canvas.height - gridSize;
    } else if (dogY >= canvas.height) {
        dogY = 0;
    }

    dogParts.unshift({ x: dogX, y: dogY });
    if (dogLength > 1) {
        dogParts.pop();
    }
}

function checkBoneCollision() {
    if (checkCollision(dogX, dogY, dogSize, dogSize, boneX, boneY, boneSize, boneSize)) {
        dogLength++;
        score++;
        scoreElement.textContent = "Score: " + score;
        boneX = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
        boneY = Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;
    }
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawDog();
    drawBone();
    moveDog();
    checkBoneCollision();
    if (checkGameOver()) {
        return;
    }
    requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight" && dogDirection !== 3) {
        dogDirection = 1;
    } else if (event.key === "ArrowDown" && dogDirection !== 4) {
        dogDirection = 2;
    } else if (event.key === "ArrowLeft" && dogDirection !== 1) {
        dogDirection = 3;
    } else if (event.key === "ArrowUp" && dogDirection !== 2) {
        dogDirection = 4;
    }
});

gameLoop();
