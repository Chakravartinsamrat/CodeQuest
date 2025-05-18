// GameScene.jsx
import Phaser from 'phaser';

export default class DinoGameScene extends Phaser.Scene {
  constructor() {
    super('DinoGameScene');
  }
  preload() {
    this.load.image('sprite', '/sprite.png');
  }

  create() {
    this.canvasWidth = this.sys.game.config.width;
    this.canvasHeight = this.sys.game.config.height;

    this.sprImg = this.add.image(0, 0, 'sprite').setVisible(false); // just preload

    this.scoreInterval = 0;
    this.frameInterval = 0;
    this.groundscroll = 0;
    this.groundscroll2 = 0;
    this.tempstart = 0;
    this.groundbool = false;
    this.frame = 0;
    this.bool = false;
    this.grav = 0.6;
    this.gamespeed = 0;

    this.multiS = -1;
    this.picS = 0;
    this.obsS = {
      x: 20, y: 230, w: 34, h: 70, scroll: -100, on: false,
    };

    this.multiB = -1;
    this.picB = 0;
    this.obsB = {
      x: 20, y: 201, w: 49, h: 100, scroll: -200, on: false,
    };

    this.p = {
      x: 100, y: 500, w: 89, h: 94, yv: 0, score: 0, hscore: 0, jump: 15,
    };

    this.pbox = {
      x: this.p.x, y: 0, w: 80, h: 75,
    };

    this.onG = false;

    this.plat = {
      x: 0, y: this.canvasHeight - 100, w: this.canvasWidth, h: 5,
    };

    this.input.keyboard.on('keydown-UP', this.keyDown, this);
  }

  update() {
    const ctx = this.game.canvas.getContext('2d');
    if (!ctx) return;

    // Update physics
    if (!this.onG) this.p.yv += this.grav;
    this.p.y += this.p.yv;
    this.pbox.y = this.p.y;

    // Score
    this.scoreInterval++;
    if (this.scoreInterval > 6 && this.gamespeed !== 0) {
      this.p.score++;
      this.scoreInterval = 0;
    }

    // Speed increase
    if (this.gamespeed < 17 && this.gamespeed !== 0) {
      this.gamespeed = 7 + (this.p.score / 100);
    }

    // Ground collision
    this.onG = false;
    if (this.p.y + this.p.h > this.plat.y) {
      this.p.y = this.plat.y - this.p.h;
      this.onG = true;
    }

    // Collision check
    const checkCollision = (obs, multi) => {
      return this.pbox.x > (this.canvasWidth - obs.scroll) - this.p.w &&
        this.pbox.x < (this.canvasWidth - obs.scroll) + (obs.w * multi) &&
        this.pbox.y > obs.y - this.pbox.h;
    };

    if (checkCollision(this.obsB, this.multiB) || checkCollision(this.obsS, this.multiS)) {
      this.gameover();
    }

    // Frame switching
    this.frameInterval++;
    if (this.frameInterval > 5) {
      this.bool = !this.bool;
      this.frameInterval = 0;
    }

    this.frame = this.bool && this.onG ? 1514 : (!this.bool && this.onG ? 1602 : 1338);

    // Draw
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

    // Ground
    this.groundscroll += this.gamespeed;
    ctx.drawImage(this.textures.get('sprite').getSourceImage(), 0, 104, 2404, 18, 0 - this.groundscroll + this.tempstart, this.plat.y - 24, 2404, 18);

    if (this.groundscroll - this.tempstart > 2404 - this.canvasWidth || this.groundbool) {
      this.groundbool = true;
      this.groundscroll2 += this.gamespeed;
      ctx.drawImage(this.textures.get('sprite').getSourceImage(), 0, 104, this.canvasWidth, 18, 0 - this.groundscroll2 + this.canvasWidth, this.plat.y - 24, this.canvasWidth, 18);
      if (this.groundscroll2 > this.canvasWidth && this.groundscroll - this.tempstart > 1000) {
        this.tempstart = this.canvasWidth;
        this.groundscroll = 20;
      }
      if (this.groundscroll2 > 2402) {
        this.groundscroll2 = 0;
        this.groundbool = false;
      }
    }

    // Character
    const sprite = this.textures.get('sprite').getSourceImage();
    const frameToDraw = this.gamespeed !== 0 ? this.frame : 1338;
    ctx.drawImage(sprite, frameToDraw, 0, 88, 94, this.p.x, this.p.y, this.p.w, this.p.h);

    // Small obstacle
    if (!this.obsB.on) {
      this.obsS.on = true;
      if (this.multiS === -1) this.rngS();

      ctx.drawImage(sprite, this.picS, 2, this.obsS.w * this.multiS, this.obsS.h, this.canvasWidth - this.obsS.scroll, this.obsS.y, this.obsS.w * this.multiS, this.obsS.h);
      this.obsS.scroll += this.gamespeed;

      if (this.obsS.scroll > this.canvasWidth + this.obsS.w * 3) {
        this.obsS.scroll = -100;
        this.multiS = -1;
        this.obsS.on = false;
      }
    }

    // Big obstacle
    if (!this.obsS.on) {
      this.obsB.on = true;
      if (this.multiB === -1) this.rngB();

      ctx.drawImage(sprite, 652, 2, this.obsB.w * this.multiB, this.obsB.h, this.canvasWidth - this.obsB.scroll, this.obsB.y, this.obsB.w * this.multiB, this.obsB.h);
      this.obsB.scroll += this.gamespeed;

      if (this.obsB.scroll > this.canvasWidth + this.obsB.w * 3) {
        this.obsB.scroll = -200;
        this.multiB = -1;
        this.obsB.on = false;
      }
    }

    // Score UI
    ctx.font = '20px verdana';
    ctx.fillStyle = 'black';
    ctx.fillText(`Score: ${this.p.score}`, 100, this.canvasHeight - 40);
    ctx.fillText(`Highscore: ${this.p.hscore}`, 600, this.canvasHeight - 40);
  }

  keyDown() {
    if (this.onG) this.p.yv = -this.p.jump;
    if (this.gamespeed === 0) this.gamespeed = 7;
  }

  gameover() {
    this.gamespeed = 0;
    console.log('HIT!');
    if (this.p.score > this.p.hscore) {
      this.p.hscore = this.p.score;
    }
    this.p.score = 0;
    this.obsB.scroll = -200;
    this.obsS.scroll = -100;
    this.scoreInterval = 0;
    this.frameInterval = 0;
    this.groundscroll = 0;
    this.groundscroll2 = 0;
    this.tempstart = 0;
    this.groundbool = false;
    this.multiS = -1;
    this.multiB = -1;
  }

  rngS() {
    this.multiS = Math.floor(Math.random() * 3) + 1;
    this.picS = 446 + (Math.floor(Math.random() * 2) * 102);
  }

  rngB() {
    this.multiB = Math.floor(Math.random() * 3) + 1;
    this.picB = 652 + (Math.floor(Math.random() * 2) * 150);
  }
}
