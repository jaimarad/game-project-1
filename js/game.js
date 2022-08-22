const game = {
  canvas: undefined,
  ctx: undefined,
  width: undefined,
  height: undefined,
  FPS: 60,
  frameCounter: 0,

  background: undefined,
  player: undefined,
  obstacles: [],
  targets: [],

  interval: undefined,

  init() {
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.setDimensions();
    this.start();
  },

  setDimensions() {
    this.height = window.innerHeight - 5;
    this.width = window.innerWidth - 5;
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
        this.frameCounter > 5000
          ? (this.frameCounter = 0)
          : this.frameCounter++;
        this.clear();
        this.drawAll();

        this.generateObstacles();
        this.clearObstacles();

        this.removeBullets();
        this.generateTarget();

        if (this.player.keys.keyLeftPressed) this.player.moveLeft();
        if (this.player.keys.keyRightPressed) this.player.moveRight();

        // this.player.move(); !!!!!!!!!!!!!!!!!

        this.player.coolDownInvulnerability();

        // console.log(this.player.lives);

        // Check player collisions

        if (this.playerCollision()) {
          this.player.timeLastHit = performance.now();
          console.log(this.player.lives);
          this.player.lives -= 1;
          this.player.invulnerable = true;
        }

        // Check proyectail collisions
        this.player.bullets.forEach((bullet) => {
          console.log(this.bulletCollision(bullet));

          // if (check[0]) {
          //   this.player.bullet.splice(index, 1);
          //   this.targets.splice(check[1], 1);
          // }
        });

        if (this.player.lives === 0) this.gameOver();
      },

      1000 / this.FPS
    );
  },

  drawAll() {
    this.background.draw();
    this.player.draw();
    this.obstacles.forEach((obs) => {
      obs.draw();
    });
    this.player.bullets.forEach((bullet) => {
      bullet.draw();
      bullet.move();
    });
    this.targets.forEach((target) => target.draw());
  },

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  },

  generateObstacles() {
    // let random = Math.floor(Math.random() * 300 + 200)
    // console.log(random)
    if (this.frameCounter % 160 === 0) {
      this.obstacles.push(new Obstacles(this.ctx, this.width, this.height, 3)); //Aquí llamamos a la clase obstacle.js
    }
    if (this.frameCounter % 150 === 0) {
      this.obstacles.push(
        new ObstacleMiddle(this.ctx, this.width, this.height, 8)
      ); //Aquí llamamos a la clase obstacle.js
    }
  },

  clearObstacles() {
    this.obstacles = this.obstacles.filter((obs) => obs.x >= -obs.w); //Esta x y w son de la clase obstacle.js
  },

  generateTarget() {
    if (this.frameCounter % 240 === 0) {
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
    return this.obstacles.some((obs) => {
      if (!this.player.invulnerable) {
        return (
          this.player.x < obs.x + obs.w &&
          this.player.x + this.player.w > obs.x &&
          this.player.y < obs.y + obs.h &&
          this.player.h + this.player.y > obs.y
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
      // console.log(bool);
      return bool;
    });
  },

  gameOver() {
    clearInterval(this.interval);
  },
};
