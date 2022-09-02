class Heart {
  constructor(ctx, targetX, targetY, speed, height, img) {
    this.ctx = ctx;
    this.height = height;
    this.x = targetX;
    this.y = targetY;
    this.w = 60;
    this.h = 60;
    this.vely = 1;
    this.velx = speed;
    this.gravity = 0.65;

    this.image = img
  }

  draw() {
    this.ctx.drawImage(this.image, this.x, this.y, this.w, this.h);
    this.move();
  }

  move() {
    this.x -= this.velx;

    if (this.y < this.height - this.h) {
      this.y += this.vely;
      this.vely += this.gravity;
    } else {
      this.y = this.height - this.h;
      this.vely = 1;
    }
  }
}
