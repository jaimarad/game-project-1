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
  target: [],

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
    this.target = [];
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

        this.player.move();
      },

      1000 / this.FPS
    );
  },

  drawAll() {
    this.background.draw();
    this.player.draw();
    this.obstacles.forEach((obs) => obs.draw());
    console.log(this.player.bullets);
    this.player.bullets.forEach((bullet) => {
      bullet.draw();
      bullet.move();
    });
    this.target.forEach((target) => target.draw());
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
      this.target.push(new Target(this.ctx, this.width, this.height, 8));
    }
  },

  clearTarget() {
    this.target = this.target.filter((tar) => tar.x >= -tar.w);
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
};
