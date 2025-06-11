// Computer science teacher said to comment code. I don't want to.

// Declare variables.

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

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
var score;
var highscore = 0;
var scoreDisplay;
var apple = { x: 0, y: 0, img: new Image() };
var scoreUpdated;

apple.img.src = "./assets/apple.webp";


resize();

if (document.cookie !== "") {
    highscore = document.cookie.split("=")[1];
}

document.getElementById("startGame").addEventListener("click", startGame);

document.addEventListener("keydown", (e) => {
    if (e.key == "ArrowLeft" || e.key == "a") {
        direction = -1;
    } else if (e.key == "ArrowRight" || e.key == "d") {
        direction = 1;
    }
});

document.addEventListener("keyup", (e) => {
    if (((e.key == "ArrowLeft" || e.key == "a") && direction == -1) || ((e.key == "ArrowRight" || e.key == "d") && direction == 1)) {
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
    score = 0;
    switch (String(highscore).length) {
        case 1:
            scoreDisplay = "SCORE 0000 | HI 000" + highscore;
            break;
        case 2:
            scoreDisplay = "SCORE 0000 | HI 00" + highscore;
            break;
        case 3:
            scoreDisplay = "SCORE 0000 | HI 0" + highscore;
            break;
        default:
            scoreDisplay = "SCORE 0000| HI " + highscore;
    }
    startX = [35];
    startY = [50];
    endX = [65];
    endY = [50];
    angles = [0];
    gameOver = false;
    scoreUpdated = 0;
    loseAnimationTimer = 0;
    direction = false;
    apple.x = Math.random() * 95;
    apple.y = Math.random() * 95;
    gameLoop();
}

function updateScore() {
    score++;
    scoreUpdated = true;
    if (score > highscore) {
        highscore = score;
        document.cookie = "highscore=" + highscore + ";max-age=157784760";
    }
    switch (String(score).length) {
        case 1:
            scoreDisplay = "SCORE 000" + score + " | ";
            break;
        case 2:
            scoreDisplay = "SCORE 00" + score + " | ";
            break;
        case 3:
            scoreDisplay = "SCORE 0" + score + " | ";
            break;
        default:
            scoreDisplay = "SCORE " + score + " | ";
            break;
    }
    switch (String(highscore).length) {
        case 1:
            scoreDisplay = scoreDisplay + "HI 000" + highscore;
            break;
        case 2:
            scoreDisplay = scoreDisplay + "HI 00" + highscore;
            break;
        case 3:
            scoreDisplay = scoreDisplay + "HI 0" + highscore;
            break;
        default:
            scoreDisplay = scoreDisplay + "HI " + highscore;
            break;
    }
}


function gameLoop() {
    startTime = performance.now();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!gameOver) {
        // Turn snake
        if (direction == -1) {
            angles.push((angles[angles.length - 1] + (1.975 * Math.PI)) % (2 * Math.PI));
            startX.push(endX[endX.length - 1]);
            startY.push(endY[endY.length - 1]);
            endX.push(endX[endX.length - 1]);
            endY.push(endY[endY.length - 1]);
        } else if (direction == 1) {
            angles.push((angles[angles.length - 1] + (0.025 * Math.PI)) % (2 * Math.PI));
            startX.push(endX[endX.length - 1]);
            startY.push(endY[endY.length - 1]);
            endX.push(endX[endX.length - 1]);
            endY.push(endY[endY.length - 1]);
        }
        endX[endX.length - 1] += Math.cos(angles[angles.length - 1]) / 2;
        endY[endY.length - 1] += Math.sin(angles[angles.length - 1]) / 2;
        if (scoreUpdated == 0) {
            startX[0] += Math.cos(angles[0]) / 2;
            startY[0] += Math.sin(angles[0]) / 2;
        } else if (scoreUpdated == 9) {
            scoreUpdated = false;
        } else {
            scoreUpdated++;
        }
        if (endX[endX.length - 1] > 99 || endX[endX.length - 1] < 1 || endY[endY.length - 1] < 1 || endY[endY.length - 1] > 99) {
            gameOver = true
        } else {
            for (let i = 0; i < endX.length - 10; i++) {
                if (circleLineSegmentCollision(
                    endX[endX.length - 1], endY[endY.length - 1], 0.5,
                    startX[i], startY[i], endX[i], endY[i]
                )) {
                    gameOver = true;
                    break;
                }
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
    //console.log(startX.length + " | " + startX[0] + " | " + endX[0] + " | " + endX[0] + " | " + endY[0] + " | " + angles[0])

    // Collision detection with apples
    if (
        endX[endX.length - 1] < apple.x + 5 &&
        endX[endX.length - 1] + 0.5 > apple.x &&
        endY[endY.length - 1] < apple.y + 5 &&
        endY[endY.length - 1] + 0.5 > apple.y
    ) {
        apple.x = Math.random() * 95;
        apple.y = Math.random() * 95;
        updateScore();
    }


    // Render
    ctx.drawImage(apple.img, apple.x * size / 100, apple.y * size / 100, size / 20, size / 20);
    ctx.beginPath();
    ctx.lineCap = "round";
    ctx.strokeStyle = "green";
    ctx.moveTo(startX[0] * size / 100, startY[0] * size / 100);
    for (let i = 0; i < startX.length; i++) {
        ctx.lineTo(endX[i] * size / 100, endY[i] * size / 100);
    }
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    ctx.arc(endX[endX.length - 1] * size / 100, endY[endY.length - 1] * size / 100, size / 100, 0, Math.PI * 2);
    ctx.stroke();
    ctx.closePath();
    ctx.font = size / 25 + "px sans-serif";
    ctx.fillText(scoreDisplay, size / 20, size / 15);
    if (endX.length) {
        timer = setTimeout(gameLoop, Math.max(100 / 6 - (performance.now() - startTime)));
    }
}

// Round to 12 decimal places to prevent issues with roundoff
function round(num) {
    return Math.round(num * 10000000000) / 10000000000;
}

// The following code was written by AI (GPT-4.1 in GitHub Copilot)
function circleLineSegmentCollision(cx, cy, r, x1, y1, x2, y2) {
    // Vector from x1,y1 to x2,y2
    const dx = x2 - x1;
    const dy = y2 - y1;
    if (dx === 0 && dy === 0) {
        // The segment is a point
        return Math.hypot(cx - x1, cy - y1) <= r;
    }
    // Project circle center onto the segment, computing parameterized position t
    let t = ((cx - x1) * dx + (cy - y1) * dy) / (dx * dx + dy * dy);
    t = Math.max(0, Math.min(1, t));
    // Find the closest point on the segment
    const closestX = x1 + t * dx;
    const closestY = y1 + t * dy;
    // Distance from circle center to segment
    return Math.hypot(cx - closestX, cy - closestY) <= r;
}