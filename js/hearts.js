class Heart {
  constructor(ctx, targetX, targetY, speed, height) {
    this.ctx = ctx;
    this.height = height;
    this.x = targetX;
    this.y = targetY;
    this.w = 60;
    this.h = 60;
    this.vely = 1;
    this.velx = speed;
    this.gravity = 0.35;

    this.image = new Image();
    this.image.src = "../img/targets/heart.png";
  }

  draw() {
    this.ctx.drawImage(this.image, this.x, this.y, this.w, this.h);
    this.move();
  }

  move() {
    this.x -= this.velx;

    if (this.y < this.height - this.h) {
      // Está saltando!
      this.y += this.vely;
      this.vely += this.gravity;
    } else {
      this.y = this.height - this.h;
      this.vely = 1;
    }
  }
}
