class Bullet {
  constructor(ctx, playerX, playerY, mouseX, mouseY) {
    this.ctx = ctx;
    this.x = playerX;
    this.y = playerY;
    this.h = 10;
    this.w = 10;
    this.vel = 20;
    this.mouseX = mouseX;
    this.mouseY = mouseY;
  }

  draw() {
    this.ctx.fillRect(this.x, this.y, this.w, this.h);
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
