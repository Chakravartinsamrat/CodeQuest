export default class KnowledgeScene extends Phaser.Scene {
  constructor() {
    super("KnowledgeScene");
  }

  preload() {
    this.load.image("Knowledge-Arena.webp", "/Knowledge-Arena.webp");
    this.load.image("player", "/BOSS.png");
  }

  create() {
    const bg = this.add.image(0, 0, "Knowledge-Arena.webp").setOrigin(0);
    bg.setDisplaySize(1600, 1200);

    this.physics.world.setBounds(0, 0, 1600, 1200);
    this.cameras.main.setBounds(0, 0, 1600, 1200);

    // Add player
    this.player = this.physics.add.sprite(745, 1169, "player").setScale(0.02);
    this.player.setCollideWorldBounds(true);

    this.cameras.main.startFollow(this.player);
    this.cursors = this.input.keyboard.createCursorKeys();
    this.speed = 300;

    this.debugText = this.add
      .text(10, 10, "Use arrow keys to move", {
        fontSize: "16px",
        fill: "#ffffff",
        backgroundColor: "#000000",
      })
      .setScrollFactor(0);

    this.glowArea = this.add
      .rectangle(625, 1073, 20, 20, 0x00ff00, 0.4)
      .setOrigin(0)
      .setStrokeStyle(2, 0x00ff00, 1);
    this.tweens.add({
      targets: this.glowArea,
      alpha: { from: 0.2, to: 0.8 },
      duration: 800,
      yoyo: true,
      repeat: -1,
    });

    this.player.setInteractive();
    this.spacebar = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
      if (
        Phaser.Geom.Rectangle.Overlaps(
          this.glowArea.getBounds(),
          this.player.getBounds()
        )
      ) {
        this.showChallengeDialog();
      }
    }
  }

  update() {
    this.debugText.setText(
      `Player pos: ${Math.round(this.player.x)}, ${Math.round(this.player.y)}`
    );

    this.player.setVelocity(0);

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-this.speed);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(this.speed);
    }

    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-this.speed);
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(this.speed);
    }
  }

  showChallengeDialog() {
    // Dim background
    this.dialogBg = this.add
      .rectangle(800, 600, 400, 200, 0x000000, 0.8)
      .setOrigin(0.5);
    this.dialogText = this.add
      .text(800, 550, "Do you want to challenge us?", {
        fontSize: "20px",
        color: "#ffffff",
        align: "center",
        wordWrap: { width: 360 },
      })
      .setOrigin(0.5);

    this.yesBtn = this.add
      .text(740, 630, "Yes", {
        fontSize: "18px",
        backgroundColor: "#00aa00",
        color: "#ffffff",
        padding: { x: 10, y: 5 },
      })
      .setInteractive()
      .on("pointerdown", () => {
        this.destroyDialog();
        this.scene.start("NextScene"); // Replace with your actual scene
      });

    this.noBtn = this.add
      .text(840, 630, "No", {
        fontSize: "18px",
        backgroundColor: "#aa0000",
        color: "#ffffff",
        padding: { x: 10, y: 5 },
      })
      .setInteractive()
      .on("pointerdown", () => {
        this.destroyDialog();
      });
  }

  destroyDialog() {
    this.dialogBg.destroy();
    this.dialogText.destroy();
    this.yesBtn.destroy();
    this.noBtn.destroy();
  }
}
