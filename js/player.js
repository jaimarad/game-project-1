class Player {
  constructor(ctx, height, width) {
    this.ctx = ctx;
    this.height = height;
    this.width = width;

    this.x = 50;
    this.y = 60;
    this.h = 170;
    this.w = 130;

    this.hitbox = {
      x: this.x + 30,
      y: this.y + 30,
      w: this.w - 50,
      h: this.h - 30,
    };

    this.velx = 5;
    this.velxl = 5;
    this.vely = 0;
    this.gravitySpeed = 0;
    this.gravity = 0.35;

    this.keys = {
      keyRightPressed: false,
      keyLeftPressed: false,
    };

    this.bullets = [];

    this.lives = 3;
    this.timeLastHit = -500;

    this.invulnerable = false;
    this.invulnerabilityTime = 2000;

    this.jumping = false;

    this.roll = false;
    this.lastRoll = -6000;
    this.rollCooldown = 6000;

    this.bulletsCoolDown = 1000;
    this.timeSinceLastAttack = -this.bulletsCoolDown;

    this.image = new Image();
    this.image.src = "../img/Player/ScottMovement.png"; //PREDETERMINADO PARA CORRER

    this.imageJump = new Image();
    this.imageJump.src = "../img/Player/ScottPilgrimJump-01.png";

    this.imageRoll = new Image();
    this.imageRoll.src = "../img/Player/ScottPilgrimRoll.png";

    this.heartimg = new Image();
    this.heartimg.src = "../img/Player/heart.png";

    this.rollicon = new Image();
    this.rollicon.src = "../img/Player/rollicon.png";

    this.image.frames = 0;

    this.audioJump = new Audio();
    this.audioJump.src = "../sounds/Salto.mp3";

    this.audioRoll = new Audio();
    this.audioRoll.src = "../sounds/Roll.mp3";

    this.audioRock = new Audio();
    this.audioRock.src = "../sounds/Piedra.mp3";
  }

  draw() {
    this.ctx.strokeRect(
      this.hitbox.x,
      this.hitbox.y,
      this.hitbox.w,
      this.hitbox.h
    );

    if (this.invulnerable || this.roll) this.ctx.globalAlpha = 0.5;

    if (this.jumping) {
      this.w = 130;
      this.h = 170;
      this.hitbox.w = this.w - 70;
      this.hitbox.h = this.h - 50;
      this.hitbox.y = this.y - 30;

      this.ctx.drawImage(
        this.imageJump,
        49.25 * this.image.frames,
        0,
        49.25,
        76,
        this.x,
        this.y,
        this.w,
        this.h
      );
    } else if (this.roll) {
      this.h = 150;
      this.w = 150;
      this.hitbox.w = this.w - 50;
      this.hitbox.h = this.h - 30;

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
      this.hitbox.w = this.w - 50;
      this.hitbox.h = this.h - 30;

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
    this.ctx.globalAlpha = 1;
  }

  animate(anim) {
    this.image.frames++;
    if (this.image.frames > anim) this.image.frames = 0;
  }

  drawLives() {
    let len = 0;
    for (let live = 0; live <= this.lives - 1; live++) {
      this.ctx.drawImage(this.heartimg, 50 + len, 50, 50, 50);
      len += 60;
    }
  }

  drawRoll() {
    if (performance.now() < this.lastRoll + this.rollCooldown) {
      this.ctx.globalAlpha = 0.5;
    }
    this.ctx.drawImage(this.rollicon, 50, 120, 60, 60);
    this.ctx.globalAlpha = 1;
  }

  moveRight() {
    if (this.x < this.width - this.w) {
      this.x += this.velx;
      this.hitbox.x = this.x + 30;
    }
  }

  moveLeft() {
    if (this.x > 0) {
      this.x -= this.velxl;
      this.hitbox.x = this.x + 30;
    }
  }

  jump() {
    this.vely -= 10;
    this.y -= 20;
    this.hitbox.y = this.y + 30;
    this.jumping = true;
  }

  move() {
    if (this.y < this.height - this.h) {
      // Está saltando!
      this.y += this.vely;
      this.hitbox.y = this.y + 30;
      this.vely += this.gravity;
    } else {
      this.y = this.height - this.h;
      this.hitbox.y = this.y + 30;
      this.vely = 1;
      this.jumping = false;
    }
  }

  coolDownInvulnerability() {
    if (performance.now() > this.timeLastHit + this.invulnerabilityTime) {
      this.invulnerable = false;
    }
  }

  coolDownRoll() {
    if (performance.now() > this.lastRoll + 750) {
      this.roll = false;
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
          if (this.y === this.height - this.h) {
            this.jump();
            this.jumping = true;
            this.audioJump.play();
          }
          break;
        }
        case 83: {
          if (key.timeStamp > this.lastRoll + this.rollCooldown) {
            this.lastRoll = key.timeStamp;
            if (this.y === this.height - this.h) {
              this.roll = true;
              this.audioRoll.play();
            }
          }

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
      }
    });

    addEventListener("click", (key) => {
      if (!this.roll) {
        if (key.timeStamp > this.timeSinceLastAttack + this.bulletsCoolDown) {
          this.timeSinceLastAttack = key.timeStamp;
          const bullet = new Bullet(this.ctx, this.x, this.y, key.x, key.y);
          bullet.calculateVelocity();
          this.bullets.push(bullet);
          this.audioRock.play();
        }
      }
    });
  }
}
