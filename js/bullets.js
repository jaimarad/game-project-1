class Bullet {
  constructor(ctx, playerX, playerY, mouseX, mouseY) {
    this.ctx = ctx;
    this.x = playerX + 60;
    this.y = playerY + 100;
    this.h = 20;
    this.w = 20;

    this.vel = 20;

    this.mouseX = mouseX;
    this.mouseY = mouseY;

    this.image = new Image();
    this.image.src = "../img/Player/bullet.png";
  }

  draw() {
    this.ctx.drawImage(this.image, this.x, this.y, this.w, this.h);
  }

  calculateVelocity() {
    let dy = this.mouseY - this.y;
    let dx = this.mouseX - this.x;
    let alpha = Math.atan2(dy, dx);
    this.velx = this.vel * Math.cos(alpha);
    this.vely = this.vel * Math.sin(alpha);
  }

  move() {
    this.x += this.velx;
    this.y += this.vely;
  }
}
