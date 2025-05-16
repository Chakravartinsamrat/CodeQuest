export default class MainScene extends Phaser.Scene {
      constructor() {
        super('MainScene');
      }

      preload() {
        this.load.image('player', '/BOSS.png'); // Make sure this path is correct
      }

      create() {
        this.player = this.add.sprite(100, 100, 'player').setScale(0.02);
        this.cursors = this.input.keyboard.createCursorKeys();
      }

      update() {
        if (this.cursors.left.isDown) {
          this.player.x -= 2;
        } else if (this.cursors.right.isDown) {
          this.player.x += 2;
        }

        if (this.cursors.up.isDown) {
          this.player.y -= 2;
        } else if (this.cursors.down.isDown) {
          this.player.y += 2;
        }
      }
    }