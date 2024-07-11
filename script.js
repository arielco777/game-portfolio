const player = document.getElementById("player");
const characterWidth = 50;
const characterHeight = 50;

const area = document.getElementById("game-area");
let areaWidth = area.offsetWidth;
let viewportWidth = window.innerWidth;

const collisions = document.querySelectorAll(".collision");
// console.log("Collisions: ", collisions);
// const boxes = document.querySelectorAll(".box");
// console.log("Boxes: ", boxes);

let areaLeft = 0;

let playerLeft = 0;
let playerBottom = 0;
let characterSpeed = 5;

let verticalVelocity = 0;
const gravity = 0.5;
const jumpStrength = 12;
let groundLevel = 0;

let rightPressed = false;
let leftPressed = false;
let jumpPressed = false;
let isJumping = false;

let onGround = true;
let isFalling = true;

function draw() {
    if (!player.getContext) {
        const p = document.createElement("p");
        p.innerText =
            "Oh no! It seems your browser doesn't support canvas and you can't see all the hard work I did :(. I hope you feel horrible about this!!!";
        document.querySelector("body").appendChild(p);
    }

    player.width = characterWidth;
    player.height = characterHeight;

    player.style.left = `${playerLeft}px`;
    player.style.bottom = `${playerBottom}px`;

    const ctx = player.getContext("2d");

    ctx.fillStyle = "rgb(200 0 200)";
    ctx.fillRect(0, 0, characterWidth, characterHeight);
}

function move() {
    if (rightPressed) {
        if (playerLeft >= viewportWidth - characterWidth) {
            // Player reaches the end of the viewport
            rightPressed = false;
        } else if (
            playerLeft <= viewportWidth / 2 ||
            areaLeft + areaWidth - viewportWidth <= 0
        ) {
            if (playerLeft <= areaWidth - viewportWidth) {
                playerLeft += characterSpeed;
                player.style.left = `${playerLeft}px`;
            }
        } else {
            areaLeft -= characterSpeed;
            area.style.left = `${areaLeft}px`;
        }
    } else if (leftPressed) {
        if (playerLeft <= 0) {
            // Player reaches the start of the viewport
            leftPressed = false;
        } else if (playerLeft >= viewportWidth / 2 || areaLeft >= 0) {
            if (playerLeft >= 0) {
                playerLeft -= characterSpeed;
                player.style.left = `${playerLeft}px`;
            }
        } else {
            areaLeft += characterSpeed;
            area.style.left = `${areaLeft}px`;
        }
    }

    applyGravityAndJump();

    checkCollision();

    requestAnimationFrame(move);
}

function applyGravityAndJump() {
    if (jumpPressed && !isJumping) {
        verticalVelocity = jumpStrength;
        isJumping = true;
        onGround = false;
    }

    verticalVelocity -= gravity;
    playerBottom += verticalVelocity;

    if (verticalVelocity < 0) {
        isFalling = true;
    }

    if (playerBottom < groundLevel) {
        // Ground level
        playerBottom = groundLevel;
        verticalVelocity = 0;
        isJumping = false;
    }

    player.style.bottom = `${playerBottom}px`;
}

function checkCollision() {
    const playerTop = playerBottom + characterHeight;
    const playerRight = playerLeft + characterWidth;
    collisions.forEach((collider, index) => {
        const isBox = collider.className.includes("box");

        const colliderHeight = parseFloat(
            window.getComputedStyle(collider).height
        );
        const colliderWidth = parseFloat(
            window.getComputedStyle(collider).width
        );
        const colliderBottom = parseFloat(
            window.getComputedStyle(collider).bottom
        );
        const colliderTop = colliderBottom + colliderHeight;
        const rect = collider.getBoundingClientRect();
        const colliderLeft = rect.left;
        const colliderRight = colliderLeft + colliderWidth;

        // console.log("Rect: ", rect);
        if (isBox) {
            if (
                playerTop > colliderTop &&
                playerBottom > colliderTop &&
                playerLeft < colliderRight &&
                playerRight > colliderLeft
            ) {
                // console.log("here");
                isJumping = false;
                isFalling = false;
                velocity = -1;
                groundLevel = colliderTop;
                playerBottom = colliderTop;
            } else if (
                playerTop > colliderBottom &&
                playerLeft < colliderRight &&
                playerRight > colliderLeft
            ) {
                verticalVelocity = 0;
            } else if (
                playerTop > colliderBottom &&
                playerRight > colliderLeft &&
                playerLeft < colliderLeft
            ) {
                playerLeft -= characterSpeed;
            } else {
                groundLevel = 0;
            }
        } else {
            if (
                // player on left
                playerRight > colliderLeft &&
                playerLeft < colliderLeft &&
                playerTop < colliderTop
            ) {
                playerLeft -= characterSpeed;
            } else if (
                //player on right
                playerLeft < colliderRight &&
                playerRight > colliderRight &&
                playerTop < colliderTop
            )
                playerLeft += characterSpeed;
            else if (
                //player on top
                playerBottom < colliderTop &&
                playerRight > colliderLeft &&
                playerLeft < colliderRight
            ) {
                // console.log("ColliderTop: ", colliderTop, "Index: ", index);
                isJumping = false;
                isFalling = false;
                verticalVelocity = 0;
                playerBottom = colliderTop;
            }
            // }
            // else if (
            //     isBox &&
            //     playerTop > rectBottom &&
            //     (playerLeft < rect.right || playerRight > rect.left)wd
            // ) {
            //     console.log("True");
            //     verticalVelocity = 0;
            //     playerBottom += verticalVelocity;
        }
    });
}

function keyDownHandler(event) {
    if (event.key === "d") {
        rightPressed = true;
    } else if (event.key === "a") {
        leftPressed = true;
    } else if (event.key === " " || event.key === "w") {
        jumpPressed = true;
    }
}

function keyUpHandler(event) {
    if (event.key === "d") {
        rightPressed = false;
    } else if (event.key === "a") {
        leftPressed = false;
    } else if (event.key === " " || event.key === "w") {
        jumpPressed = false;
    }
}

function handleResize() {
    viewportWidth = window.innerWidth;
    areaWidth = area.offsetWidth;
    draw();
}

window.addEventListener("load", () => {
    draw();
    move();
});

window.addEventListener("keydown", keyDownHandler);
window.addEventListener("keyup", keyUpHandler);
// window.addEventListener("resize", handleResize);
