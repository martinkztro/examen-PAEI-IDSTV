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

canvas.width = map[0].length * 40;
canvas.height = map.length * 40;  

const grd = ctx.createLinearGradient(100, 10, 200, 0);
grd.addColorStop(0, "#1c0453");
grd.addColorStop(1, "#212137");


//pintar mapa
function drawMap() {
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            if (map[i][j] === 1) {
                ctx.fillStyle = grd;
                ctx.fillRect(j * 40, i * 40, 40, 40);
            } else if (map[i][j] === 2) {
                ctx.beginPath();
                ctx.arc(j * 40 + 20, i * 40 + 20, 7, 5, 2 * Math.PI);
                ctx.fillStyle = 'white';
                ctx.fill();
            } else if (map[i][j] === 0) {

            }
        }
    }
}


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

const player = new Player(x, y, 38, 38, 'white');

// DECLARACION DE PERSONAJES
//enemies
const asteroid = new Image();
asteroid.src = 'images/asteroid.png';

const blackHole = new Image();
blackHole.src = 'images/black-hole.png';
blackHole.onload = () =>
ctx.drawImage(blackHole, canvas.width/2 - 160, canvas.height/2 - 90, 320, 180);

//portals
const wormHoleTop = new Image();
wormHoleTop.src = 'images/worm-hole.png';
wormHoleTop.onload = () => ctx.drawImage(wormHoleTop, 475, 50, 170, 130);

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
            console.log("arriba");
            dir = 1;
            break;
        case "s":
            console.log("abajo");
            dir = 2;
            break;
        case "d":
            console.log("derecha");
            dir = 3;
            break;
        case "a":
            console.log("izquierda");
            dir = 4;
            break;
        case " ":
            console.log("pausa");
            pause = !pause;
            break;
    }

})

//FUNCIONES
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

        soundtrack.play();

    }
    paint();
    window.requestAnimationFrame(update);


}

function paint() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMap();
    
    ctx.font = "20px Georgia";
    ctx.fillStyle = "white";
    ctx.fillText("Score: " + score, 20, 30);

    ctx.drawImage(apolo, player.x, player.y, player.w, player.h);


    if (pause) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(0, 0, 1200, 600);

        ctx.font = "75px Arial Black";
        ctx.fillStyle = "blue";
        ctx.fillText("PAUSED", 395, 280);
        ctx.font = "20px Arial";
        ctx.fillStyle = "white";
        ctx.fillText("Press [ SPACE ] to continue", 435, 320);

        soundtrack.pause();
    }
}

update();