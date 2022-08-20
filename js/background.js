class Background {
  constructor(ctx, width, height, speed) {
    this.x = 0;
    this.y = 0;
    this.ctx = ctx

    this.height = height;
    this.width = width;
    this.speed = speed;

    this.image = new Image();
    this.image.src = '../img/BACKGROUNDTEST.jpg';

  }

  draw() {
    this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

}
