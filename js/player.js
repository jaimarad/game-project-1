class Player {
  constructor(ctx, height, width) {
    this.ctx = ctx;
    this.height = height;
    this.width = width;
    this.x = 50;
    this.y = 60;
    this.h = 100;
    this.w = 60;
    this.velx = 5;
    this.vely = 0;
    this.gravitySpeed = 0;
    this.gravity = 0.2;

    this.keys = {
      keyRightPressed: false,
      keyLeftPressed: false,
    };
    this.crouch = false;
  }
  draw() {
    this.ctx.beginPath();
    if (this.crouch) {
      this.h = 60;
      this.w = 100;
      this.ctx.rect(this.x, this.height - this.h, this.w, this.h);
      this.ctx.fillRect(this.x, this.height - this.h, this.w, this.h);
    } else {
      this.h = 100;
      this.w = 60;
      this.ctx.rect(this.x, this.y, this.w, this.h);
      this.ctx.fillRect(this.x, this.y, this.w, this.h);
    }

    this.ctx.stroke();
  }

  moveRight() {
    if (this.x < this.width - this.w) this.x += this.velx;
  }

  moveLeft() {
    if (this.x > 0) this.x -= this.velx;
  }

  jump() {
    this.vely -= 10;
    this.y -= 20;
  }

  move() {
    if (this.y < this.height - this.h) {
      // Está saltando!
      this.y += this.vely;
      this.vely += this.gravity;
    } else {
      this.y = this.height - this.h;
      this.vely = 1;
    }
  }

  setListeners() {
    addEventListener("keydown", (key) => {
      console.log(key.key);
      switch (key.key) {
        case "ArrowRight": {
          this.keys.keyRightPressed = true;
          break;
        }
        case "ArrowLeft": {
          this.keys.keyLeftPressed = true;
          break;
        }
        case "ArrowUp": {
          if (this.y === this.height - this.h) this.jump();
          break;
        }
        case "ArrowDown": {
          if (this.y === this.height - this.h) this.crouch = true;
          break;
        }
      }
    });

    addEventListener("keyup", (key) => {
      console.log(key.key);
      switch (key.key) {
        case "ArrowRight": {
          this.keys.keyRightPressed = false;
          break;
        }
        case "ArrowLeft": {
          this.keys.keyLeftPressed = false;
          break;
        }
        case "ArrowDown": {
          if (this.y === this.height - this.h) this.crouch = false;
          break;
        }
      }
    });
  }
}
