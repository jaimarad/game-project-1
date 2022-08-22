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
    this.bullets = [];
    this.timeSinceLastAttack = -500;
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
      switch (key.keyCode) {
        case 68: {
          this.keys.keyRightPressed = true;
          break;
        }
        case 65: {
          this.keys.keyLeftPressed = true;
          break;
        }
        case 32:
        case 87: {
          key.preventDefault();
          if (this.y === this.height - this.h) this.jump();
          break;
        }
        case 83: {
          if (this.y === this.height - this.h) this.crouch = true;
          break;
        }
      }
    });

    addEventListener("keyup", (key) => {
      switch (key.keyCode) {
        case 68: {
          this.keys.keyRightPressed = false;
          break;
        }
        case 65: {
          this.keys.keyLeftPressed = false;
          break;
        }
        case 83: {
          if (this.y === this.height - this.h) this.crouch = false;
          break;
        }
      }
    });

    addEventListener("click", (key) => {
      console.log(key);
      if (key.timeStamp > this.timeSinceLastAttack + 500) {
        this.timeSinceLastAttack = key.timeStamp;
        const bullet = new Bullet(this.ctx, this.x, this.y, key.x, key.y);
        bullet.calculateVelocity();
        console.log(bullet);
        this.bullets.push(bullet);
      }
    });
  }
}
