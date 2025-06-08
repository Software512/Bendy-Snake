// Computer science teacher said to comment code. I don't want to.

// Declare variables.

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const gradient = ctx.createLinearGradient(20, 0, 220, 0);

var startX;
var startY;
var endX;
var endY;
var angles;

var startTime;
var timer;
var gameOver;
var loseAnimationTimer;
var size;
var direction;
var distLeft = 0;


resize();

document.getElementById("startGame").addEventListener("click", startGame);

document.addEventListener("keydown", (e) => {
    if (e.key == "ArrowLeft") {
        direction = -1;
    } else if (e.key == "ArrowRight") {
        direction = 1;
    }
});

document.addEventListener("keyup", (e) => {
    if ((e.key == "ArrowLeft" && direction == -1) || (e.key == "ArrowRight" && direction == 1)) {
        direction = 0;
    }
});

addEventListener("resize", resize);

function resize() {
    if (window.innerWidth > window.innerHeight) {
        size = window.innerHeight;
        canvas.style.left = (window.innerWidth - size) / 2 + "px";
        canvas.style.top = 0;
    } else {
        size = window.innerWidth;
        canvas.style.top = (window.innerHeight - size) / 2 + "px";
        canvas.style.left = "0";
    }
    canvas.width = size;
    canvas.height = size;
    ctx.lineWidth = size * 0.02;
}

function startGame() {
    clearTimeout(timer);
    startX = [30];
    startY = [50];
    endX = [70];
    endY = [50];
    angles = [0];
    gameOver = false;
    loseAnimationTimer = 0;
    direction = false;
    gameLoop();
}

function gameLoop() {
    startTime = performance.now();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!gameOver) {
        // Turn snake
        if (direction == -1) {
            angles.push((angles[angles.length - 1] + (1.975 * Math.PI)) % (2 * Math.PI));
            startX.push(startX[startX.length - 1]);
            startY.push(startY[startY.length - 1]);
            endX.push(endX[endX.length - 1]);
            endY.push(endY[endY.length - 1]);
        } else if (direction == 1) {
            angles.push((angles[angles.length - 1] + (0.025 * Math.PI)) % (2 * Math.PI));
            startX.push(startX[startX.length - 1]);
            startY.push(startY[startY.length - 1]);
            endX.push(endX[endX.length - 1]);
            endY.push(endY[endY.length - 1]);
        }
        endX[endX.length - 1] += Math.cos(angles[angles.length - 1]) / 2;
        endY[endY.length - 1] += Math.sin(angles[angles.length - 1]) / 2;
        startX[0] += Math.cos(angles[0]) / 2;
        startY[0] += Math.sin(angles[0]) / 2;
        if (endX[endX.length - 1] > 99 || endX[endX.length - 1] < 1 || endY[endY.length - 1] < 1 || endY[endY.length - 1] > 99) {
            gameOver = true
        } else {
            for (let i = 0; i < endX.length - 2; i++) {
                if (false) { gameOver = true }; // Check if snake collides with itself, but not implemented yet.
            }
        }
    } else {
        if (loseAnimationTimer % 10 == 0) {
            startX[0] = startX.shift();
            startY[0] = startY.shift();
            endX.shift();
            endY.shift();
            angles.shift();
        }
    }
    
    // Fixes an issue where every other curve segment has no length and the speed of the back half as fast
    if (Math.sqrt((endX[0] - startX[0]) ** 2 + (endY[0] - startY[0]) ** 2) == 0) {
        startX.shift();
        startY.shift();
        startX[0] = endX.shift();
        startY[0] = endY.shift();
        angles.shift();
    }

    // Took a lot of trial and error. Deletes snake segments when the length goes negative.
    if ((angles[0] == 0 || (angles[0] < 0.5 * Math.PI && angles[0] > 0) || (angles[0] > 1.5 * Math.PI)) && startX[0] > endX[0]) {
        distLeft = 1 - Math.sqrt((endX[0] - startX[0]) ** 2 + (endY[0] - startY[0]) ** 2);
        startX.shift();
        startY.shift();
        startX[0] = endX.shift();
        startY[0] = endY.shift();
        angles.shift();
    } else if (((angles[0] < 1.5 * Math.PI && angles[0] > Math.PI) || (angles[0] < Math.PI && angles[0] > Math.PI * 0.5) || angles[0] == Math.PI) && startX[0] < endX[0]) {
        distLeft = 1 - Math.sqrt((endX[0] - startX[0]) ** 2 + (endY[0] - startY[0]) ** 2);
        startX.shift();
        startY.shift();
        startX[0] = endX.shift();
        startY[0] = endY.shift();
        angles.shift();
    } else if ((round(angles[0]) == round(Math.PI * 0.5) && startY[0] > endY[0]) || (round(angles[0]) == round(Math.PI * 1.5) && startY[0] < endY[0])) {
        distLeft = 1 - Math.sqrt((endX[0] - startX[0]) ** 2 + (endY[0] - startY[0]) ** 2);
        startX.shift();
        startY.shift();
        startX[0] = endX.shift();
        startY[0] = endY.shift();
        angles.shift();
    }
    //console.log(startX.length + " | " + startX[0] + " | " + endX[0] + " | " + startY[0] + " | " + endY[0] + " | " + angles[0])


    // Render snake
    ctx.beginPath();
    ctx.moveTo(startX[0] * size / 100, startY[0] * size / 100);
    for (let i = 0; i < startX.length; i++) {
        ctx.lineTo(endX[i] * size / 100, endY[i] * size / 100);
    }
    //ctx.arc(endX[endX.length - 1] * size / 100, endY[endY.length - 1] * size / 100, size / 100, 0, Math.PI * 2);
    ctx.stroke();
    ctx.closePath();
    if (endX.length) {
        timer = setTimeout(gameLoop, Math.max(100 / 6 - (performance.now() - startTime)));
    }
}

// Round to 12 decimal places to prevent issues with roundoff
function round(num) {
    return Math.round(num * 10000000000) / 10000000000;
}