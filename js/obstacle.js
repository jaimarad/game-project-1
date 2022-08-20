class Obstacles {
  constructor(ctx, width, height, speed) {
    this.ctx = ctx;
    this.w = 50;
    this.h = 80;
    this.x = width; // canvas width
    this.y = height - this.h; // initialize but changes with the typen of obstacles
    this.speed = speed;

    this.image = new Image();
    this.image.src = "../img/OBSTACLETESTING.jpg";

    this.velX = 7;
  }

  draw() {
    this.ctx.drawImage(this.image, this.x, this.y, this.w, this.h);
    this.move();
  }

  move() {
    this.x -= this.velX;
  }
}
