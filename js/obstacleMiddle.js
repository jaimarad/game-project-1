class ObstacleMiddle extends Obstacles {
  constructor(ctx, width, height, speed, img) {
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

    this.imageMiddle = img;
    this.frames = 0;
  }

  draw() {
    // this.ctx.strokeRect(
    //   this.hitbox.x,
    //   this.hitbox.y,
    //   this.hitbox.w,
    //   this.hitbox.h
    // );

    this.ctx.drawImage(
      this.imageMiddle,
      101.5 * this.frames,
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
    this.frames++;
    if (this.frames > 3) this.frames = 0;
  }

  move() {
    this.x -= this.speed;
    this.hitbox.x = this.x;
  }
}
