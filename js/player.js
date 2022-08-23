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

    this.bullets = [];

    this.lives = 3;
    this.timeLastHit = -500;

    this.invulnerable = false;
    this.invulnerabilityTime = 2000;

    this.roll = false;
    this.bulletsCoolDown = 500;
    this.timeSinceLastAttack = -this.bulletsCoolDown;

    this.image = new Image();
    this.image.src = "../img/Player/ScottMovement.png"; //PREDETERMINADO PARA CORRER

    this.imageJump = new Image();
    this.imageJump.src = "../img/Player/ScottPilgrimJump-01.png";

    this.imageRoll = new Image();
    this.imageRoll.src = "../img/Player/ScottPilgrimRoll.png";

    this.heartimg = new Image();
    this.heartimg.src = "../img/Player/heart.png";

    this.image.frames = 0;
  }

  draw() {
    this.ctx.beginPath();
    if (this.jumping) {
      this.ctx.drawImage(
        this.imageJump,
        49.25 * this.image.frames,
        0,
        49.25,
        63,
        this.x,
        this.y,
        this.w,
        this.h
      );
    } else if (this.roll) {
      this.ctx.drawImage(
        this.imageRoll,
        49 * this.image.frames,
        0,
        49,
        53,
        this.x,
        this.y,
        this.w,
        this.h
      );
    } else {
      this.h = 170;
      this.w = 130;
      this.ctx.drawImage(
        this.image,
        49 * this.image.frames,
        0,
        49,
        63,
        this.x,
        this.y,
        this.w,
        this.h
      );
    }
  }

  animate() {
    this.image.frames++;
    if (this.image.frames > 4) this.image.frames = 0;
  }

  drawLives() {
    let len = 0;
    for (let live = 0; live <= this.lives - 1; live++) {
      this.ctx.drawImage(this.heartimg, 50 + len, 50, 50, 50);
      len += 60;
    }
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
    this.jumping = true;
  }

  move() {
    if (this.y < this.height - this.h) {
      // Está saltando!
      this.y += this.vely;
      this.vely += this.gravity;
    } else {
      this.y = this.height - this.h;
      this.vely = 1;
      this.jumping = false;
    }
  }

  coolDownInvulnerability() {
    if (performance.now() > this.timeLastHit + this.invulnerabilityTime) {
      this.invulnerable = false;
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
          if (this.y === this.height - this.h) this.roll = true;
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
          if (this.y === this.height - this.h) this.roll = false;
          break;
        }
      }
    });

    addEventListener("click", (key) => {
      if (key.timeStamp > this.timeSinceLastAttack + this.bulletsCoolDown) {
        this.timeSinceLastAttack = key.timeStamp;
        const bullet = new Bullet(this.ctx, this.x, this.y, key.x, key.y);
        bullet.calculateVelocity();
        this.bullets.push(bullet);
      }
    });
  }
}
