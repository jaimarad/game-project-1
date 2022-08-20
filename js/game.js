const Game = {
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
    this.ctx = this.canvas.getContest("2d");
    this.setDimensions();
    this.start();
  },

  setDimensions() {
    this.height = window.innerHeight;
    this.width = windows.innerWidth;
    this.canvas.height = this.height;
    this.canvas.width = this.width;
  },

  reset() {
    this.background = new Background();
    this.player = new Player();
    this.obstacles = [];
  },

  start() {
    this.reset();

    this.interval = setInterval(refreshScreen, 1000 / this.FPS);
  },

  refeshScreen() {
    this.clear();
    this.drawAll();
  },

  drawAll() {
    this.player.draw();
    this.background.draw();
    this.obstacles.forEach((obstacle) => obstacle.draw());
  },

  clear() {
    this.ctx.context.clearRect(0, 0, this.width, this.height);
  },
};
