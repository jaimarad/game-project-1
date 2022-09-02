class Target {
  constructor(ctx, width, speed, img) {
    this.ctx = ctx;
    this.w = 100;
    this.h = 100;
    this.x = width;
    this.y = Math.floor(Math.random() * 150);
    this.speed = speed;

    this.hitbox = {
      x: this.x + 10,
      y: this.y + 30,
      w: this.w - 30,
      h: this.h - 30,
    };

    this.image = img;
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
      this.image,
      97 * this.frames,
      0,
      99,
      96,
      this.x,
      this.y,
      this.w,
      this.h
    );
    this.move();
  }

  animate() {
    this.frames++;
    if (this.frames > 4) this.frames = 0;
  }

  move() {
    this.x -= this.speed;
    this.hitbox.x = this.x + 20;
  }
}
