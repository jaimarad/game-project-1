class Target {
  constructor(ctx, width, height, speed) {
    this.ctx = ctx;
    this.w = 100;
    this.h = 100;
    this.x = width; // canvas width
    this.y = Math.floor(Math.random() * 150); // initialize but changes with the typen of obstacles
    this.velX = speed;

    this.image = new Image();
    this.image.src = "../img/TargetMovementLeft.png";
    this.image.frames = 0;
  }

  draw() {
    this.ctx.drawImage(
      this.image,
      97 * this.image.frames,
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

  move() {
    this.image.frames++;
    if (this.image.frames > 4) this.image.frames = 0;
    this.x -= this.velX;
  }
}
