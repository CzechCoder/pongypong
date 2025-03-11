// DOM constants

const startText = document.getElementById("startText");
const keys = document.getElementById("keys");
const paddle1 = document.getElementById("paddle1");
const paddle2 = document.getElementById("paddle2");
const ball = document.getElementById("ball");
const player1scoreElement = document.getElementById("player1score");
const player2scoreElement = document.getElementById("player2score");
const scoreSound = document.getElementById("scoreSound");
const bouncePaddleSound = document.getElementById("bouncePaddleSound");

// game variables

let gameRunning = false;
let keysPressed = {};
let paddle1speed = 0;
let paddle1y = 150;
let paddle2speed = 0;
let paddle2y = 150;
let ballX = 290;
let ballSpeedX = 2;
let ballY = 0;
let ballSpeedY = 2;
let player1score = 0;
let player2score = 0;

// game constants

const paddleAcceleration = 1;
const paddleDeceleration = 1;
const maxPaddleSpeed = 5;
const gameHeight = 400;
const gameWidth = 600;

document.addEventListener("keydown", startGame);
document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);

// Start game

function startGame() {
  gameRunning = true;
  startText.style.display = "none";
  keys.style.display = "none";
  document.removeEventListener("keydown", startGame);
  gameLoop();
}

function gameLoop() {
  if (gameRunning) {
    updatePaddle1();
    updatePaddle2();
    moveBall();
    setTimeout(gameLoop, 8);
  }
}

function handleKeyDown(e) {
  keysPressed[e.key] = true;
}

function handleKeyUp(e) {
  keysPressed[e.key] = false;
}

function updatePaddle1() {
  if (keysPressed["w"]) {
    paddle1speed = Math.max(paddle1speed - paddleAcceleration, -maxPaddleSpeed);
  } else if (keysPressed["s"]) {
    paddle1speed = Math.min(paddle1speed + paddleAcceleration, maxPaddleSpeed);
  } else {
    if (paddle1speed > 0) {
      paddle1speed = Math.max(paddle1speed - paddleDeceleration, 0);
    } else if (paddle1speed < 0) {
      paddle1speed = Math.min(paddle1speed + paddleDeceleration, 0);
    }
  }

  paddle1y += paddle1speed;

  if (paddle1y < 0) {
    paddle1y = 0;
  }

  if (paddle1y > gameHeight - paddle1.clientHeight) {
    paddle1y = gameHeight - paddle1.clientHeight;
  }

  paddle1.style.top = paddle1y + "px";
}
function updatePaddle2() {
  if (keysPressed["ArrowUp"]) {
    paddle2speed = Math.max(paddle2speed - paddleAcceleration, -maxPaddleSpeed);
  } else if (keysPressed["ArrowDown"]) {
    paddle2speed = Math.min(paddle2speed + paddleAcceleration, maxPaddleSpeed);
  } else {
    if (paddle2speed > 0) {
      paddle2speed = Math.max(paddle2speed - paddleDeceleration, 0);
    } else if (paddle2speed < 0) {
      paddle2speed = Math.min(paddle2speed + paddleDeceleration, 0);
    }
  }

  paddle2y += paddle2speed;

  if (paddle2y < 0) {
    paddle2y = 0;
  }

  if (paddle2y > gameHeight - paddle2.clientHeight) {
    paddle2y = gameHeight - paddle2.clientHeight;
  }

  paddle2.style.top = paddle2y + "px";
}

function moveBall() {
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  if (ballY >= gameHeight - ball.clientHeight || ballY <= 0) {
    ballSpeedY = -ballSpeedY;
  }

  // paddle 1 collision
  if (
    ballX <= paddle1.clientWidth &&
    ballY >= paddle1y &&
    ballY <= paddle1y + paddle1.clientHeight
  ) {
    ballSpeedX = -ballSpeedX;
    playSound(bouncePaddleSound);
  }

  // paddle 2 collision
  if (
    ballX >= gameWidth - paddle2.clientWidth - ball.clientWidth &&
    ballY >= paddle2y &&
    ballY <= paddle2y + paddle2.clientHeight
  ) {
    ballSpeedX = -ballSpeedX;
    playSound(bouncePaddleSound);
  }

  // out of game area
  if (ballX <= 0) {
    player2score++;
    playSound(scoreSound);
    updateScoreboard();
    resetBall();
    stopGame();
  } else if (ballX >= gameWidth - ball.clientWidth) {
    player1score++;
    playSound(scoreSound);
    updateScoreboard();
    resetBall();
    stopGame();
  }

  ball.style.left = ballX + "px";
  ball.style.top = ballY + "px";
}

function updateScoreboard() {
  player1scoreElement.textContent = player1score;
  player2scoreElement.textContent = player2score;
}

function resetBall() {
  ballX = gameWidth / 2 - ball.clientWidth / 2;
  ballY = gameHeight / 2 - ball.clientHeight / 2;
  ballSpeedX = Math.random() > 0.5 ? 2 : -2;
  ballSpeedY = Math.random() > 0.5 ? 2 : -2;
}

function stopGame() {
  gameRunning = false;
  document.addEventListener("keydown", startGame);
}

function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}
