const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

let map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 1, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 1, 1, 1, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 2, 2, 2, 2,  ,  ,  ,  ,  ,  ,  ,  , 2, 2, 2, 2, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 1, 1, 1, 2,  ,  ,  ,  ,  ,  ,  ,  , 2, 1, 1, 1, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 2, 2, 2, 2,  ,  ,  ,  ,  ,  ,  ,  , 2, 2, 2, 2, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 1, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 1, 1, 1, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

const apolo = new Image();
apolo.src = 'images/apolo.png';

let soundtrack = new Audio();
soundtrack.src = 'soundtrack.mp3';

let pause = false;
let dir = 0;
let speed = 1;
let score = 0;
let x = 255;
let y = 255;
let lives = 3;
let time = 0;
const keysPressed = {
    w: false,
    s: false,
    a: false,
    d: false,
};



canvas.width = map[0].length * 40;
canvas.height = map.length * 40;  

const grd = ctx.createLinearGradient(120, 80, 100, 160);
grd.addColorStop(0, "#000000");
grd.addColorStop(1, "#101010");

// DECLARACION DE CLASES
//player
class Player {
    constructor(x, y, w, h, color) {
        this.x = 45;
        this.y = 45;
        this.w = w;
        this.h = h;
        this.color = color;
    }
    paint(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.strokeRect(this.x, this.y, this.w, this.h);
    }
}

class Circle {
    constructor(x, y, r, color) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.color = color;
    }
    paint(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 5, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}
class Wall {
    constructor(x, y, w, h, color) {
        this.x = x;
        this.y = y;
        this.w = 40;
        this.h = 40;
        this.color = color;
    }
    paint(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.strokeRect(this.x, this.y, this.w, this.h);
    }
}
const wall = new Wall(0, 0, 40, 40, grd);

//pintar mapa
function drawMap() {
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            if (map[i][j] === 1) {
                const wall = new Wall(j * 40, i * 40, 40, 40, grd);
                wall.paint(ctx);
            } else if (map[i][j] === 2) {
                const circle = new Circle(j * 40 + 20, i * 40 + 20, 5, 'white');
                circle.paint(ctx);
            } else if (map[i][j] === 0) {

            }
        }
    }
}

const player = new Player(x, y, 35, 35, 'white');
const previousX = player.x;
const previousY = player.y; 

// DECLARACION DE PERSONAJES
//enemies
const asteroid = new Image();
asteroid.src = 'images/asteroid.png';

const blackHole = new Image();
blackHole.src = 'images/black-hole.png';

//portals
const wormHoleTop = new Image();
wormHoleTop.src = 'images/worm-hole.png';


const wormHoleBottom = new Image();
wormHoleBottom.src = 'images/worm-hole.png';
wormHoleBottom.onload = () => ctx.drawImage(wormHoleBottom, 475, 415, 170, 130);

window.requestAnimationFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 17);
        };
}());

document.addEventListener("keydown", (e) => {

    switch (e.key) {
        case "w":
            dir = 1;
            break;
        case "s":
            dir = 2;
            break;
        case "d":
            dir = 3;
            break;
        case "a":
            dir = 4;
            break;
        case " ":
            pause = !pause;
            break;
    }

})

document.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "w":
            keysPressed.w = true;
            break;
        case "s":
            keysPressed.s = true;
            break;
        case "a":
            keysPressed.a = true;
            break;
        case "d":
            keysPressed.d = true;
            break;
        case " ":
            pause = !pause;
            break;
    }
    speed = 1.2;
});

document.addEventListener("keyup", (e) => {
    switch (e.key) {
        case "w":
            keysPressed.w = false;
            break;
        case "s":
            keysPressed.s = false;
            break;
        case "a":
            keysPressed.a = false;
            break;
        case "d":
            keysPressed.d = false;
            break;
        case " ":
            pause = !pause;
            break;
    }
    speed = 1;
});

document.addEventListener("keyup", (e) => {
    if (e.key === "w") {
        keysPressed.w = false;
        speed = 1;
    } else if (e.key === "s") {
        keysPressed.s = false;
        speed = 1;
    } else if (e.key === "a") {
        keysPressed.a = false;
        speed = 1;
    } else if (e.key === "d") {
        keysPressed.d = false;
        speed = 1;
    }
});


function seTocaPared(player, wall) {
    return (
        player.x < wall.x + wall.w &&
        player.x + player.w > wall.x &&
        player.y < wall.y + wall.h &&
        player.y + player.h > wall.y
    );
}

function checkWallCollision(player) {
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            if (map[i][j] === 1) {
                const wall = new Wall(j * 40, i * 40, 40, 40, grd);
                if (seTocaPared(player, wall)) {
                    return true;
                }
            }
        }
    }
    return false;
}


//pintar
function update() {

    if (!pause) {
        if (dir == 1) {
            player.y -= speed;

        }
        if (dir == 2) {
            player.y += speed;

        }
        if (dir == 3) {
            player.x += speed;

        }
        if (dir == 4) {
            player.x -= speed;

        }
        if (keysPressed.w) {
            player.y -= speed;

        }
        if (keysPressed.s) {
            player.y += speed;

        }
        if (keysPressed.d) {
            player.x += speed;

        }
        if (keysPressed.a) {
            player.x -= speed;

        }

        for (let i = 0; i < map.length; i++) {
            for (let j = 0; j < map[i].length; j++) {
                if (map[i][j] === 1) {
                    const pared = new Wall(j * 40, i * 40);
                    if (seTocaPared(player, pared)) {
                        if (dir == 1) {
                            player.y += speed;
                        }
                        if (dir == 2) {
                            player.y -= speed;
                        }
                        if (dir == 3) {
                            player.x -= speed;
                        }
                        if (dir == 4) {
                            player.x += speed;
                        }
                    }
                }
            }
        }
        if (checkWallCollision(player)) {
            // Revertir el movimiento del jugador cuando colisiona con una pared
            player.x = previousX;
            player.y = previousY;
        }


        soundtrack.loop = true;
        soundtrack.play();

    }
    paint();
    window.requestAnimationFrame(update);


}

function paint() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMap();
    
    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("SCORE: " + score, 20, 30);

    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("LIVES: " + lives, 500, 30);
    
    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("TIME: " + time, 1020, 30);

    ctx.drawImage(apolo, player.x, player.y, player.w, player.h);

    ctx.drawImage(blackHole, 385, 200, 350, 200);
    ctx.drawImage(wormHoleTop, 505, 55, 110, 110);
    ctx.drawImage(wormHoleBottom, 505, 420, 110, 110);
    ctx.drawImage(asteroid, 200, 520, 40, 40);


    if (pause) {
        ctx.fillStyle = "rgba(220, 210, 255, 0.2)";
        ctx.fillRect(0, 0, 1200, 600);

        ctx.font = "75px Arial Black";
        ctx.fillStyle = "white";
        ctx.fillText("PAUSED", 395, 280);
        ctx.font = "20px Arial";
        ctx.fillStyle = "white";
        ctx.fillText("Press [ SPACE ] to continue", 435, 320);

        soundtrack.pause();
    }
}

update();