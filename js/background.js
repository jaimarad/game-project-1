class Background {
  constructor(ctx, width, height, speed, img) {
    this.x = 0;
    this.y = 0;
    this.ctx = ctx;

    this.height = height;
    this.width = width;
    this.speed = speed;
    this.acc = 0.001;

    this.image = img;
  }

  draw() {
    this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    this.ctx.drawImage(
      this.image,
      this.x + this.width,
      this.y,
      this.width,
      this.height
    );
    this.move();
  }
  move() {
    this.speed += this.acc;
    if (this.x <= -this.width) {
      this.x = 0;
    }
    this.x -= this.speed;
  }
}
