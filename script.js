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
var touchscreen = false;
var gameStarted = false;
var leftDown;
var rightDown;
var buttonSize;
var onMainMenu = true;
var theme = { theme: 1, snake: "#008000", background: "#aaffaa", text: "#000000", bars: "#000000" };

apple.img.src = "./assets/apple.webp";


resize();

if (document.cookie !== "") {
    if (document.cookie.includes("theme")) {
        theme = JSON.parse(document.cookie.match(/theme={.+}/)[0].split("=")[1]);
        updateTheme();
    }
    if (document.cookie.includes("highscore")) {
        highscore = document.cookie.match(/highscore=[0-9]+/)[0].split("=")[1];
    }
}
snakePreview();


document.addEventListener("contextmenu", (e) => { e.preventDefault(); });

document.getElementById("startGame").addEventListener("click", startGame);

document.getElementById("playAgain").addEventListener("click", startGame);

document.getElementById("leaveButton").addEventListener("click", () => {
    document.getElementById("gameOver").style.display = "none";
    document.getElementById("score").style.display = "none";
    document.getElementById("mainMenu").style.display = "";
    document.getElementById("leftArrow").style.display = "none";
    document.getElementById("rightArrow").style.display = "none";
    onMainMenu = true;
    snakePreview();
});

document.getElementById("creditsButton").addEventListener("click", () => {
    document.getElementById("creditScreen").style.display = "";
    document.getElementById("mainMenu").style.display = "none";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    onMainMenu = false;
});

document.getElementById("closeCredits").addEventListener("click", () => {
    document.getElementById("creditScreen").style.display = "none";
    document.getElementById("mainMenu").style.display = "";
    onMainMenu = true;
    snakePreview();
});

document.getElementById("help").addEventListener("click", () => {
    document.getElementById("helpScreen").style.display = "";
    document.getElementById("mainMenu").style.display = "none";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    onMainMenu = false;
});

document.getElementById("closeHelp").addEventListener("click", () => {
    document.getElementById("helpScreen").style.display = "none";
    document.getElementById("mainMenu").style.display = "";
    onMainMenu = true;
    snakePreview();
});

document.getElementById("defaultColor").addEventListener("click", () => {
    theme.theme = 1;
    document.cookie = "theme=" + JSON.stringify(theme);
    updateTheme();
});

document.getElementById("classicColor").addEventListener("click", () => {
    theme.theme = 2;
    document.cookie = "theme=" + JSON.stringify(theme);
    updateTheme();
});

document.getElementById("customColor").addEventListener("click", () => {
    theme.theme = 3;
    document.cookie = "theme=" + JSON.stringify(theme);
    updateTheme();
});

document.getElementById("snakeColor").addEventListener("input", (e) => {
    theme.snake = e.target.value;
    document.cookie = "theme=" + JSON.stringify(theme);
    updateTheme();
});

document.getElementById("backgroundColor").addEventListener("input", (e) => {
    theme.background = e.target.value;
    document.cookie = "theme=" + JSON.stringify(theme);
    updateTheme();
});

document.getElementById("textColor").addEventListener("input", (e) => {
    theme.text = e.target.value;
    document.cookie = "theme=" + JSON.stringify(theme);
    updateTheme();
});

document.getElementById("barColor").addEventListener("input", (e) => {
    theme.bars = e.target.value;
    document.cookie = "theme=" + JSON.stringify(theme);
    updateTheme();
});

document.addEventListener("keydown", (e) => {
    if (touchscreen) {
        document.getElementById("keyboardHelp").style.display = "";
        document.getElementById("mobileHelp").style.display = "none";

        if (gameStarted) {
            document.getElementById("leftArrow").style.display = "";
            document.getElementById("rightArrow").style.display = "";
        }
        touchscreen = false;
        document.getElementById("leftArrow").style.display = "none";
        document.getElementById("rightArrow").style.display = "none";
    }


    if (e.key == "ArrowLeft" || e.key == "a") {
        direction = -1;
        leftDown = true;
    } else if (e.key == "ArrowRight" || e.key == "d") {
        direction = 1;
        rightDown = true;
    }
});

document.addEventListener("keyup", (e) => {
    if (e.key == "ArrowLeft" || e.key == "a") {
        leftDown = false;
        if (rightDown) {
            direction = 1;
        } else {
            direction = 0;
        }
    } else if (e.key == "ArrowRight" || e.key == "d") {
        rightDown = false;
        if (leftDown) {
            direction = -1;
        } else {
            direction = 0;
        }
    }
});

document.addEventListener("touchstart", (e) => {
    if (e.target == document.getElementById("leftArrow")) {
        leftDown = true;
        direction = -1;
    } else if (e.target == document.getElementById("rightArrow")) {
        rightDown = true;
        direction = 1;
    }
    if (!touchscreen) {
        document.getElementById("keyboardHelp").style.display = "none";
        document.getElementById("mobileHelp").style.display = "";

        if (gameStarted) {
            document.getElementById("leftArrow").style.display = "";
            document.getElementById("rightArrow").style.display = "";
        }
    }
    touchscreen = true;
}, { passive: true });

document.addEventListener("touchend", (e) => {
    if (e.target == document.getElementById("leftArrow")) {
        leftDown = false;
        if (rightDown) {
            direction = 1;
        } else {
            direction = 0;
        }
    } else if (e.target == document.getElementById("rightArrow")) {
        rightDown = false;
        if (leftDown) {
            direction = -1;
        } else {
            direction = 0;
        }
    }
    if (!touchscreen) {
        document.getElementById("keyboardHelp").style.display = "none";
        document.getElementById("mobileHelp").style.display = "";

        if (gameStarted) {
            document.getElementById("leftArrow").style.display = "";
            document.getElementById("rightArrow").style.display = "";
        }
    }
    touchscreen = true;
});

addEventListener("resize", resize);

function resize() {
    if (window.innerWidth > window.innerHeight) {
        size = window.innerHeight;
        canvas.style.left = (window.innerWidth - size) / 2 + "px";
        canvas.style.top = 0;
        menu.style.left = (window.innerWidth - size) / 2 + "px";
        menu.style.top = 0;
        buttonSize = Math.min(Math.max((innerWidth * 0.96 - size) / 2, size / 12.5), size / 4) + "px";
    } else {
        size = window.innerWidth;
        canvas.style.top = (window.innerHeight - size) / 2 + "px";
        canvas.style.left = "0";
        menu.style.top = (window.innerHeight - size) / 2 + "px";
        menu.style.left = "0";
        buttonSize = Math.min(Math.max((innerHeight * 0.96 - size) / 2, size / 12.5), size / 4) + "px";
    }
    canvas.width = size;
    canvas.height = size;
    menu.style.width = size + "px";
    menu.style.height = size + "px";
    ctx.lineWidth = size * 0.02;
    document.querySelector("html").style.fontSize = size / 40 + "px";
    h1 = document.querySelectorAll("h1");
    for (let i = 0; i < h1.length; i++) {
        h1[i].style.fontSize = size / 25 + "px";
    }
    document.getElementById("leftArrow").style.width = buttonSize;
    document.getElementById("leftArrow").style.height = buttonSize;
    document.getElementById("rightArrow").style.width = buttonSize;
    document.getElementById("rightArrow").style.height = buttonSize;
    if (onMainMenu) {
        snakePreview();
    }
}

function startGame() {
    document.getElementById("score").style.display = "";
    document.getElementById("mainMenu").style.display = "none";
    document.getElementById("gameOver").style.display = "none";
    if (touchscreen) {
        document.getElementById("leftArrow").style.display = "";
        document.getElementById("rightArrow").style.display = "";
    } else {
        document.getElementById("leftArrow").style.display = "none";
        document.getElementById("rightArrow").style.display = "none";
    }
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
    document.getElementById("score").textContent = scoreDisplay;
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
    gameStarted = true;
    onMainMenu = false;
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
    document.getElementById("score").textContent = scoreDisplay;
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
            gameOver = true;
            document.getElementById("gameOver").style.display = "";
            document.getElementById("leftArrow").style.display = "none";
            document.getElementById("rightArrow").style.display = "none";
        } else {
            for (let i = 0; i < endX.length - 10; i++) {
                if (circleLineSegmentCollision(
                    endX[endX.length - 1], endY[endY.length - 1], 0.5,
                    startX[i], startY[i], endX[i], endY[i]
                )) {
                    gameOver = true;
                    document.getElementById("gameOver").style.display = "";
                    document.getElementById("leftArrow").style.display = "none";
                    document.getElementById("rightArrow").style.display = "none";
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
    if (theme.theme == 1) {
        ctx.strokeStyle = "green";
    } else if (theme.theme == 2) {
        ctx.strokeStyle = "lime";
    } else {
        ctx.strokeStyle = theme.snake;
    }
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
    if (endX.length && gameStarted) {
        console.log(performance.now() - startTime)
        timer = setTimeout(gameLoop, Math.max(100 / 6 - (performance.now() - startTime), 0));
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        gameStarted = false;
    }
}

// Round to 12 decimal places to prevent issues with roundoff
function round(num) {
    return Math.round(num * 10000000000) / 10000000000;
}

function snakePreview() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.lineCap = "round";
    if (theme.theme == 1) {
        ctx.strokeStyle = "green";
    } else if (theme.theme == 2) {
        ctx.strokeStyle = "lime";
    } else {
        ctx.strokeStyle = theme.snake;
    }
    ctx.moveTo(0.35 * size, 0.5 * size);
    ctx.lineTo(0.65 * size, 0.5 * size);
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    ctx.arc(0.65 * size, 0.5 * size, size / 100, 0, Math.PI * 2);
    ctx.stroke();
    ctx.closePath();
}

function updateTheme() {
    if (theme.theme == 1) {
        document.getElementById("defaultColor").style.backgroundColor = "#e2e2e2";
        document.getElementById("classicColor").style.backgroundColor = "";
        document.getElementById("customColor").style.backgroundColor = "";
        document.body.style.backgroundColor = "black";
        document.body.style.color = "black";
        document.getElementById("canvas").style.backgroundColor = "#aaffaa";
        document.getElementById("colorPickers").style.display = "none";
        snakePreview();
    } else if (theme.theme == 2) {
        document.getElementById("defaultColor").style.backgroundColor = "";
        document.getElementById("classicColor").style.backgroundColor = "#e2e2e2";
        document.getElementById("customColor").style.backgroundColor = "";
        document.body.style.backgroundColor = "#202040";
        document.body.style.color = "white";
        document.getElementById("canvas").style.backgroundColor = "black";
        document.getElementById("colorPickers").style.display = "none";
        snakePreview();
    } else {
        document.getElementById("defaultColor").style.backgroundColor = "";
        document.getElementById("classicColor").style.backgroundColor = "";
        document.getElementById("customColor").style.backgroundColor = "#e2e2e2";
        document.body.style.backgroundColor = theme.bars;
        document.body.style.color = theme.text;
        document.getElementById("canvas").style.backgroundColor = theme.background;
        document.getElementById("colorPickers").style.display = "";
        snakePreview();
    }
    document.getElementById("snakeColor").value = theme.snake;
    document.getElementById("backgroundColor").value = theme.background;
    document.getElementById("textColor").value = theme.text;
    document.getElementById("barColor").value = theme.bars;
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