export default class ContentScene extends Phaser.Scene {
  constructor() {
    super("ContentScene");
  }

  init(data) {
    // Access the passed data
    console.log(data.challengeAccepted); // true
    console.log(data.playerPos); // { x: number, y: number }

    // Use the data as needed, e.g., set player position or trigger challenge logic
    this.challengeAccepted = data.challengeAccepted;
    this.playerStartPos = data.playerPos;
  }

  create() {
    const bg = this.add.image(0, 0, "Background.jpg").setOrigin(0);
    bg.setDisplaySize(1600, 1200);

    this.physics.world.setBounds(0, 0, 1600, 1200);
    this.cameras.main.setBounds(0, 0, 1600, 1200);

    // Add player
    this.player = this.physics.add.sprite(
      this.playerStartPos.x,
      this.playerStartPos.y,
      "player"
    ).setScale(0.02);
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

    // Set up spacebar interaction
    this.spacebar = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
  }
}