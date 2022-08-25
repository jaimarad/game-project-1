class Obstacles {
  constructor(ctx, width, height, speed) {
    this.ctx = ctx;
    this.w = 100;
    this.h = 100;
    this.x = width;
    this.y = height - this.h;

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
    // this.ctx.strokeRect(
    //   this.hitbox.x,
    //   this.hitbox.y,
    //   this.hitbox.w,
    //   this.hitbox.h
    // );

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
