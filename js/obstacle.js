class Obstacles {
  constructor(ctx, width, height, speed) {
    this.ctx = ctx;
    this.w = 100
    this.h = 100
    this.x = width; // canvas width
    this.y = height - this.h; // initialize but changes with the typen of obstacles
    this.velX = speed;

    this.image = new Image();
    this.image.src = "../img/OBSTACLETESTING.jpg";


  }

  draw() {
    this.ctx.drawImage(this.image, this.x, this.y, this.w, this.h);
    this.move()
  }

  move() {
    this.x -= this.velX;
  }

}

class ObstacleMiddle extends Obstacles {
  constructor(ctx, width, height, speed) {
    super(ctx, width, height, speed)
    this.w = 150
    this.h = 50
    this.x = width;
    this.y = Math.floor(Math.random() * (height - 500) + 300);
    this.velX = speed;
  }
}

