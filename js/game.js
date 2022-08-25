const game = {
  canvas: undefined,
  ctx: undefined,
  width: undefined,
  height: undefined,
  FPS: 60,
  frameCounter: 0,

  canStart: true,

  background: undefined,
  player: undefined,
  score: undefined,

  obstacles: [],
  obstaclesMiddle: [],
  targets: [],
  hearts: [],

  obsRate: undefined,
  pigRate: undefined,

  interval: undefined,

  audioGame: new Audio(),
  audioPig: new Audio(),

  init() {
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.setDimensions();
    this.start();
  },

  setDimensions() {
    this.height = window.innerHeight;
    this.width = window.innerWidth;
    this.canvas.height = this.height;
    this.canvas.width = this.width;
  },

  reset() {
    this.background = new Background(this.ctx, this.width, this.height, 3);
    this.player = new Player(
      this.ctx,
      this.height,
      this.width,
      this.background.speed
    );
    this.player.setListeners();
    this.score = 0;
    this.frameCounter = 0;

    this.obsRate = 160;
    this.pigRate = 240;
    this.obstacles = [];
    this.targets = [];
  },

  start() {
    this.audioGame.src = "../sounds/ScottTheme.mp3";
    this.audioGame.volume = 0.4;

    if (typeof this.audioGame.loop == "boolean") {
      this.audioGame.loop = true;
    } else {
      this.audioGame.addEventListener(
        "ended",
        function () {
          this.currentTime = 0;
          this.play();
        },
        false
      );
    }
    this.audioGame.play();

    this.canStart = false;

    this.reset();
    this.interval = setInterval(
      () => {
        this.frameCounter > 6000
          ? (this.frameCounter = 0)
          : this.frameCounter++;
        this.clear();

        this.drawAll();

        this.generateObstacles();
        this.clearObstacles();

        this.removeBullets();
        this.generateTarget();

        this.player.velxl = this.background.speed + 2;

        if (this.player.keys.keyLeftPressed) this.player.moveLeft();
        if (this.player.keys.keyRightPressed) this.player.moveRight();

        if (this.frameCounter % 60 === 0) this.score++;

        if (this.frameCounter % 10 === 0) {
          if (this.player.roll) this.player.animate(4);
          else this.player.animate(8);
        }

        if (this.frameCounter % 2 === 0) {
          this.targets.forEach((target) => target.animate());
        }

        if (this.frameCounter % 6 === 0) {
          this.obstacles.forEach((obs) => {
            obs.speed = this.background.speed;
            obs.animate();
          });
        }

        if (this.frameCounter % 8 === 0) {
          this.obstaclesMiddle.forEach((obstacleMid) => {
            obstacleMid.animate();
          });
        }

        this.player.move();

        this.player.coolDownInvulnerability();
        this.player.coolDownRoll();

        this.displayScore();

        // Check player collisions
        if (this.playerCollision()) {
          const audioCrash = new Audio();
          audioCrash.src = "../sounds/Choque.mp3";
          audioCrash.play();

          this.player.timeLastHit = performance.now();
          this.player.lives -= 1;
          this.player.invulnerable = true;
        }

        // Check bullets collisions
        this.player.bullets.some((bullet, index) => {
          if (this.bulletCollision(bullet)) {
            this.player.bullets.splice(index, 1);
          }
        });

        // Hearts collisions
        if (this.heartCollision() && this.player.lives < 5) this.player.lives++;

        if (this.player.lives === 0) this.gameOver();
      },

      1000 / this.FPS
    );
  },

  displayScore() {
    this.ctx.fillStyle = "white";
    this.ctx.font = "40px Silkscreen";
    this.ctx.fillText("Score: " + this.score, 60, 50);
  },

  drawAll() {
    this.background.draw();

    this.player.draw();
    this.player.drawLives();
    this.player.drawRoll();

    this.player.bullets.forEach((bullet) => {
      bullet.draw();
      bullet.move();
    });

    this.obstacles.forEach((obs) => {
      obs.draw();
    });

    this.obstaclesMiddle.forEach((obs) => {
      obs.draw();
    });

    this.targets.forEach((target) => target.draw());

    this.hearts.forEach((heart) => heart.draw());
  },

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  },

  generateObstacles() {
    if (this.frameCounter % 1000 === 0) {
      if (this.obsRate > 80) {
        this.obsRate -= 10;
      }
      this.pigRate += 10;
    }
    if (this.frameCounter % this.obsRate === 0) {
      let rand = Math.round(Math.random());
      if (rand === 1) {
        this.obstacles.push(
          new Obstacles(
            this.ctx,
            this.width,
            this.height,
            this.background.speed
          )
        );
      } else {
        const vel = Math.floor(Math.random() * 4) + 1;
        this.obstaclesMiddle.push(
          new ObstacleMiddle(
            this.ctx,
            this.width,
            this.height,
            this.background.speed + vel
          )
        );
      }
    }
  },

  clearObstacles() {
    this.obstacles = this.obstacles.filter((obs) => obs.x >= -obs.w);
    this.obstaclesMiddle = this.obstaclesMiddle.filter(
      (obs) => obs.x >= -obs.w
    );
  },

  generateTarget() {
    if (this.frameCounter % this.pigRate === 0) {
      this.targets.push(
        new Target(this.ctx, this.width, this.background.speed + 3)
      );
    }
  },

  clearTarget() {
    this.targets = this.targets.filter((tar) => tar.x >= -tar.w);
  },

  clearHearts() {
    this.hearts = this.hearts.filter((heart) => heart.x >= -heart.w);
  },

  removeBullets() {
    this.player.bullets = this.player.bullets.filter((bullet) => {
      if (
        bullet.x >= 0 - bullet.w &&
        bullet.y <= this.height &&
        bullet.x <= this.width &&
        bullet.y >= 0
      )
        return bullet;
    });
  },

  playerCollision() {
    const obsArr = [...this.obstacles, ...this.obstaclesMiddle];
    return obsArr.some((obs) => {
      if (!this.player.invulnerable && !this.player.roll) {
        return (
          this.player.hitbox.x < obs.hitbox.x + obs.hitbox.w &&
          this.player.hitbox.x + this.player.hitbox.w - 10 > obs.hitbox.x &&
          this.player.hitbox.y < obs.hitbox.y + obs.hitbox.h &&
          this.player.hitbox.y + this.player.hitbox.h - 10 > obs.hitbox.y
        );
      } else {
        return false;
      }
    });
  },

  bulletCollision(bullet) {
    const collisionables = [...this.targets, ...this.obstaclesMiddle];
    return collisionables.some((target, index) => {
      const bool =
        bullet.x < target.hitbox.x + target.hitbox.w &&
        bullet.x + bullet.w > target.hitbox.x &&
        bullet.y < target.hitbox.y + target.hitbox.h &&
        bullet.h + bullet.y > target.hitbox.y;
      if (bool) {
        const removed = this.targets.splice(index, 1);
        if (removed.length === 1) {
          this.audioPig.src = "../sounds/Pig.mp3";
          this.audioPig.play();

          this.score += 100;
          const rand = Math.round(Math.random());
          if (rand === 1) {
            const heart = new Heart(
              this.ctx,
              removed[0].x,
              removed[0].y,
              this.background.speed,
              this.height
            );
            this.hearts.push(heart);
          }
        }
      }
      return bool;
    });
  },

  heartCollision() {
    return this.hearts.some((heart, index) => {
      const bool =
        this.player.hitbox.x < heart.x + heart.w &&
        this.player.hitbox.x + this.player.hitbox.w - 10 > heart.x &&
        this.player.hitbox.y < heart.y + heart.h &&
        this.player.hitbox.y + this.player.hitbox.h - 10 > heart.y;
      if (bool) this.hearts.splice(index, 1);
      return bool;
    });
  },

  gameOver() {
    clearInterval(this.interval);

    this.audioGame.pause();

    this.clearObstacles();
    this.clearTarget();
    this.clearHearts();
    this.removeBullets();

    this.canStart = true;

    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.width, this.height);

    this.ctx.textAlign = "center";
    this.ctx.fillStyle = "white";
    this.ctx.font = "80px Silkscreen";
    this.ctx.fillText(
      "GAME OVER",
      this.width / 2,
      this.height / 2 - this.height * 0.2
    );

    this.ctx.font = "50px Silkscreen";

    this.ctx.fillText(
      "SCORE: " + this.score,
      this.width / 2,
      this.height / 3 + this.height * 0.1
    );

    const body = document.querySelector("body");
    body.style.backgroundColor = "black";

    let alpha = 0;
    const blinkInterval = setInterval(() => {
      if (alpha === 0) alpha = 1;
      else alpha = 0;
      this.ctx.globalAlpha = alpha;

      this.ctx.clearRect(
        0,
        this.height / 3 + this.height * 0.1,
        this.width,
        this.height
      );

      this.ctx.fillStyle = "black";
      this.ctx.fillRect(
        0,
        this.height / 3 + this.height * 0.1,
        this.width,
        this.height
      );
      this.ctx.fillStyle = "white";

      this.ctx.fillText(
        "PRESS SPACE TO RESTART",
        this.width / 2,
        this.height / 3 + this.height * 0.2
      );
    }, 500);

    addEventListener("keydown", (key) => {
      if (key.keyCode === 32) {
        key.preventDefault();
        if (this.canStart) {
          clearInterval(blinkInterval);
          this.init();
        }
      }
    });
  },
};
