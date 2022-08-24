class Obstacles {
  constructor(ctx, width, height, speed) {
    this.ctx = ctx;
    this.w = 100;
    this.h = 100;
    this.x = width; // canvas width
    this.y = height - this.h; // initialize but changes with the typen of obstacles

    this.hitbox = {
      x: this.x + 10,
      y: this.y + 5,
      w: this.w - 20,
      h: this.h,
    };

    this.speed = speed;

    this.image = new Image();
    this.image.src = "../img/obstacles/TrashCan.png";
  }

  draw() {
    this.ctx.strokeRect(
      this.hitbox.x,
      this.hitbox.y,
      this.hitbox.w,
      this.hitbox.h
    );

    this.ctx.drawImage(this.image, this.x, this.y, this.w, this.h);
    this.move();
  }

  animate() {
    this.image.frames++;
    if (this.image.frames > 0) this.image.frames = 0;
  }

  move() {
    this.x -= this.speed;
    this.hitbox.x = this.x + 10;
  }
}

class ObstacleMiddle extends Obstacles {
  constructor(ctx, width, height, speed) {
    super(ctx, width, height, speed);
    this.w = 150;
    this.h = 80;
    this.x = width;
    this.y = Math.floor(Math.random() * (height - 500) + 300);

    this.hitbox = {
      x: this.x,
      y: this.y,
      w: this.w,
      h: this.h,
    };

    this.imageMiddle = new Image();
    this.imageMiddle.src = "../img/obstacles/MiddleObstacle.png";
    this.image.frames = 0;
  }

  draw() {
    this.ctx.strokeRect(
      this.hitbox.x,
      this.hitbox.y,
      this.hitbox.w,
      this.hitbox.h
    );
    this.ctx.drawImage(
      this.imageMiddle,
      101.5 * this.image.frames,
      0,
      101.5,
      70,
      this.x,
      this.y,
      this.w,
      this.h
    );
    this.move();
  }

  animate() {
    this.image.frames++;
    if (this.image.frames > 3) this.image.frames = 0;
  }

  move() {
    this.x -= this.speed;
    this.hitbox.x = this.x;
  }
}
