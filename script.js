const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

let dir = 0;
let speed = .4;
let pause = false;
let score = -5;
let lives = 3;
let wall = [];
let food = [];
let map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 2, 2, 2,  ,  , 2, 2, 2, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 2, 2, 2,  ,  , 2, 2, 2, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 1, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 1, 1, 1, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 2, 2, 2, 2,  ,  ,  ,  ,  ,  ,  ,  , 2, 2, 2, 2, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 1, 1, 1, 2,  ,  ,  ,  ,  ,  ,  ,  , 2, 1, 1, 1, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 2, 2, 2, 2,  ,  ,  ,  ,  ,  ,  ,  , 2, 2, 2, 2, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 1, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 1, 1, 1, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 2, 2, 2,  ,  , 2, 2, 2, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 2, 2, 2,  ,  , 2, 2, 2, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];
let stopWall = true;
let gameOver = false;
let time = 0;

const pintarMapa = () => {
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[0].length; j++) {
            if (map[i][j] === 1) {
                wall.push(new Game(j * 40, i * 40, 39, 39, 'grey'));
            }
        }
    }
}

const pintarComida = () => {
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[0].length; j++) {
            if (map[i][j] === 2) {
                food.push(new Game(j * 40 + 18, i * 40 + 18, 5, 5, 'white'));
            }
        }
    }
}

canvas.width = map[0].length * 40;
canvas.height = map.length * 40;

 // Carga de elementos (imagenes)
  const apolo = new Image();
  apolo.src = 'images/apolo.png';
  apolo.onload = () => {
      update();
  };
 
  const blackhole = new Image();
  blackhole.src = 'images/black-hole.png';
  blackhole.onload = () => {
      update();
  };

  const wormhole = new Image();
  wormhole.src = 'images/worm-hole.png';
  wormhole.onload = () => {
      update();
  };

  const soundtrack = new Audio();
  soundtrack.src = 'soundtrack.mp3';

  const finalSoundtrack = new Audio();
  finalSoundtrack.src = 'final_soundtrack.mp3';


const grd = ctx.createLinearGradient(120, 80, 100, 160);
grd.addColorStop(0, "#000000");
grd.addColorStop(1, "#101010");

window.requestAnimationFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 17);
        };
}());

class Game {
    constructor(x, y, w, h, c) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.c = c;
    }

    paint(ctx) {
        ctx.fillStyle = this.c;
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }

    colision(otro) {
        return this.x < otro.x + otro.w &&
            this.x + this.w > otro.x &&
            this.y < otro.y + otro.h &&
            this.y + this.h > otro.y;
    }
}
    const player = new Game(45, 45, 30, 30, "crimson");
    const blackHole = new Game(390, 240, 330, 120, "black");

    const paint = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < wall.length; i++) {
            wall[i].paint(ctx); // TODO: DIBUJAR FONDOS A CUADROS
        }

        for (let i = 0; i < food.length; i++) {
            food[i].paint(ctx);
        }

        if (stopWall){
            pintarMapa();
            pintarComida();
            stopWall = false;
        }

        ctx.drawImage(apolo, player.x, player.y, player.w, player.h);
        blackHole.paint(ctx);
        ctx.drawImage(blackhole, 390, 195, 330, 205)

        ctx.font = "20px Arial Black";
        ctx.fillStyle = "white";
        ctx.fillText("SCORE: " + score, 20, 30);
    
        ctx.font = "20px Arial Black";
        ctx.fillStyle = "white";
        ctx.fillText("LIVES: " + lives, 515, 30);
    
        ctx.font = "20px Arial Black";
        ctx.fillStyle = "white";
        ctx.fillText("TIME: " + time, 1000, 30);

        
        if (pause) {
            ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.font = "75px Arial Black";
            ctx.fillStyle = "white";
            ctx.fillText("PAUSED", 395, 280);
            ctx.font = "20px Arial";
            ctx.fillStyle = "white";
            ctx.fillText("Press [ SPACE ] to continue", 435, 320);
        }

        if (gameOver) {
            ctx.fillStyle = "rgba(0, 0, 0, 0.9)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.font = "75px Arial Black";
            ctx.fillStyle = "white";
            ctx.fillText("GAME OVER", 330, 280);
            ctx.font = "25px Arial Black";
            ctx.fillText("SCORE: " + score, 420, 350);
            ctx.font = "25px Arial Black";
            ctx.fillText("TIME: " + time, 430, 420);
            ctx.font = "20px Arial";
            ctx.fillStyle = "white";
            ctx.fillText("Press [ R ] to restart", 435, 320);
            gameOver = true;
        }
    }

    window.addEventListener('keydown', (e) => {

        switch (e.key) {
            case 'w':
                dir = 1;
                break;
            case 's':
                dir = 2;
                break;
            case 'd':
                dir = 3;
                break;
            case 'a':
                dir = 4;
                break;
            case ' ':
                pause = !pause;
                break;
        }

    })

    const timer = () => {
        if (!pause) {
            time += 1;
        }
    } 
    setInterval(timer, 1000);

    const update = () => {
        if (!pause) {
            if (dir === 1) {
                player.y -= speed;
            }
            if (dir === 2) {
                player.y += speed;
            }
            if (dir === 3) {
                player.x += speed;
            }
            if (dir === 4) {
                player.x -= speed;
            }
        }

        for (let i = 0; i < wall.length; i++) {
            if (player.colision(wall[i])) {
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

        for (let i = 0; i < food.length; i++) {
            if (player.colision(food[i])) {
                food.splice(i, 1);
                score += 5;
            }
        }

        if (player.colision(blackHole)) {
            lives -= 1;
            player.x = 45;
            player.y = 45;
            dir = 0;
            if (lives === 0) {
                speed = 0;
                soundtrack.volume = 0.1;
                finalSoundtrack.play();
                gameOver = true;
            }
        }

        soundtrack.play();

        paint();
        requestAnimationFrame(update);

    }

    update();