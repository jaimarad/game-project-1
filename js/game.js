const game = {
  canvas: undefined,
  ctx: undefined,
  width: undefined,
  height: undefined,
  FPS: 60,
  frameCounter: 0,
  // FLAG
  // canStart: true,

  background: undefined,
  player: undefined,
  score: 0,

  obstacles: [],
  obstaclesMiddle: [],
  targets: [],

  obsRate: 160,
  pigRate: 240,

  interval: undefined,

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
    this.player = new Player(this.ctx, this.height, this.width);
    this.player.setListeners();
    this.obstacles = [];
    this.targets = [];
  },

  start() {
    this.reset();
    this.interval = setInterval(
      () => {
        this.frameCounter > 6000
          ? (this.frameCounter = 0)
          : this.frameCounter++;
        this.clear();

        if (this.player.lives === 0) this.gameOver();

        this.drawAll();

        this.generateObstacles();
        this.clearObstacles();

        this.removeBullets();
        this.generateTarget();

        if (this.player.keys.keyLeftPressed) this.player.moveLeft();
        if (this.player.keys.keyRightPressed) this.player.moveRight();

        if (this.frameCounter % 60 === 0) {
          this.score++;
        }

        if (this.frameCounter % 10 === 0) {
          if (this.player.roll) {
            this.player.animate(4);
          } else {
            this.player.animate(8);
          }
        }

        if (this.frameCounter % 2 === 0) {
          this.targets.forEach((target) => target.animate());
        }

        if (this.frameCounter % 6 === 0) {
          this.obstacles.forEach((obs) => obs.animate());
        }

        if (this.frameCounter % 8 === 0) {
          this.obstaclesMiddle.forEach((obstacleMid) => obstacleMid.animate());
        }

        this.player.move(); // !!!!!!!!!!!!!!!!!!!!!

        this.player.coolDownInvulnerability();
        this.player.coolDownRoll();

        this.displayScore();

        // Check player collisions
        if (this.playerCollision()) {
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
      },

      1000 / this.FPS
    );
  },

  displayScore() {
    this.ctx.fillStyle = "white";
    this.ctx.font = "40px Helvetica";
    this.ctx.fillText("Score: " + this.score, 60, 50);
  },

  drawAll() {
    this.background.draw();

    this.player.draw();
    this.player.drawLives();

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
  },

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  },

  generateObstacles() {
    if (this.frameCounter % 1500 === 0) {
      if (this.obsRate > 120) {
        this.obsRate -= 10;
      }
      this.pigRate += 10;
    }
    if (this.frameCounter % this.obsRate === 0) {
      let rand = Math.round(Math.random());
      // console.log(rand);
      if (rand === 1) {
        this.obstacles.push(
          new Obstacles(this.ctx, this.width, this.height, 3)
        ); //Aquí llamamos a la clase obstacle.js
      } else {
        let vel = Math.floor(Math.random() * 4) + 4;
        this.obstaclesMiddle.push(
          new ObstacleMiddle(this.ctx, this.width, this.height, vel)
        ); //Aquí llamamos a la clase obstacle.js
      }
    }
  },

  clearObstacles() {
    this.obstacles = this.obstacles.filter((obs) => obs.x >= -obs.w); //Esta x y w son de la clase obstacle.js
    this.obstaclesMiddle = this.obstaclesMiddle.filter(
      (obs) => obs.x >= -obs.w
    ); //Esta x y w son de la clase obstacle.js
  },

  generateTarget() {
    if (this.frameCounter % this.pigRate === 0) {
      this.targets.push(new Target(this.ctx, this.width, this.height, 8));
    }
  },

  clearTarget() {
    this.targets = this.targets.filter((tar) => tar.x >= -tar.w);
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
    return this.targets.some((target, index) => {
      const bool =
        bullet.x < target.x + target.w &&
        bullet.x + bullet.w > target.x &&
        bullet.y < target.y + target.h &&
        bullet.h + bullet.y > target.y;
      if (bool) {
        this.targets.splice(index, 1);
      }
      return bool;
    });
  },

  gameOver() {
    clearInterval(this.interval);
  },
};
