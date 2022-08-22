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
  interval: undefined,

  keys: {},

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
    this.background = new Background(this.ctx, this.width, this.height, 0);
    this.player = new Player(this.ctx, this.height, this.width);
    this.player.setListeners();
    this.obstacles = [];
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
  },

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  },

  generateObstacles() {
    if (this.frameCounter % 90 === 0) {
      this.obstacles.push(new Obstacles(this.ctx, this.width, this.height, 0)); //Aquí llamamos a la clase obstacle.js
    }
  },

  clearObstacles() {
    this.obstacles = this.obstacles.filter((obs) => obs.x >= -obs.w); //Esta x y w son de la clase obstacle.js
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
