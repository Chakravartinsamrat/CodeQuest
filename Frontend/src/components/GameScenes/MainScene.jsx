import ObstacleManager from "../utils/ObstracleManager";
import NavigationController from "../Routes/NavigationController";
import sceneManager from "../utils/SceneManager";

export default class MainScene extends Phaser.Scene {
  constructor() {
    super("MainScene");
  }

  preload() {
    this.load.image("player", "/BOSS.png");
    this.load.image("background", "/Volt-Town.webp");
  }

  create() {
    // Add background
    const bg = this.add.image(0, 0, "background").setOrigin(0);
    bg.setDisplaySize(1600, 1200);

    // Set world bounds
    this.physics.world.setBounds(0, 0, 1600, 1200);
    this.cameras.main.setBounds(0, 0, 1600, 1200);

    // Create player
    this.player = this.physics.add.sprite(675, 950, "player").setScale(0.01);
    this.player.setCollideWorldBounds(true);

    // Create obstacles
    this.obstacleManager = new ObstacleManager(this);
    this.obstacleManager.createAllObstacles();
    this.obstacles = this.obstacleManager.getObstacles();
    this.physics.add.collider(this.player, this.obstacles);

    // Camera follows player
    this.cameras.main.startFollow(this.player);

    // Controls
    this.cursors = this.input.keyboard.createCursorKeys();
    this.speed = 300;

    // Debug text
    this.debugText = this.add
      .text(10, 10, "Use arrow keys to move", {
        fontSize: "16px",
        fill: "#ffffff",
        backgroundColor: "#000000",
      })
      .setScrollFactor(0);

    // Glowing zones
    this.createGlowArea(630, 870, 60, 40, 0x00ff00);
    this.createGlowArea(650, 850, 60, 40, 0x00ff00);
    this.createGlowArea(955, 875, 20, 10, 0x0000ff);
    this.createGlowArea(585, 665, 50, 10, 0x0000ff);

    this.navController = new NavigationController(this);

    // Handle P key
    this.input.keyboard.on("keydown-P", (event) => {
      if (event.shiftKey) {
        this.scene.launch("MenuScene");
      }
    });

    this.activeNpcZone = null;
    this.activeNpcMessage = null;
    
    // Properly define space key - moved here from constructor
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    
    // Fix: Add specific space key event listener for NPC dialog
    this.input.keyboard.on('keydown-SPACE', () => {
      if (this.activeNpcZone && this.activeNpcMessage) {
        this.showNpcDialog(this.activeNpcMessage);
        this.interactHint?.destroy();
        this.interactHint = null;
      }
    });

    this.addNpcTrigger(500, 300, "Welcome, hero! Be careful ahead.");
    this.addNpcTrigger(800, 500, "I once saw a monster around here...");
  }

  update() {
    this.debugText.setText(
      `Player pos: ${Math.round(this.player.x)}, ${Math.round(this.player.y)}`
    );

    this.player.setVelocity(0);

    if (this.cursors.left.isDown) this.player.setVelocityX(-this.speed);
    else if (this.cursors.right.isDown) this.player.setVelocityX(this.speed);

    if (this.cursors.up.isDown) this.player.setVelocityY(-this.speed);
    else if (this.cursors.down.isDown) this.player.setVelocityY(this.speed);

    // Navigation to different scenes
    if (this.isInArea(630, 870, 60, 40)) {
      sceneManager.navigateToScene(this, "KnowledgeScene");
    }

    if (this.isInArea(955, 875, 20, 10)) {
      this.scene.start("ChallengeScene", { playerX: 855, playerY: 1003 });
    }

    if (this.isInArea(585, 665, 50, 10)) {
      sceneManager.navigateToScene(this, "GymScene");
    }

    // NPC interaction
    if (this.activeNpcZone) {
      if (this.interactHint) {
        this.interactHint.setPosition(this.player.x, this.player.y - 40);
      }
      
      // Removed the space key check from here since we're handling it with the event listener
    }

    // Exit zone if player walks away
    if (
      this.activeNpcZone &&
      !Phaser.Geom.Intersects.RectangleToRectangle(
        this.player.getBounds(),
        this.activeNpcZone.getBounds()
      )
    ) {
      this.activeNpcZone = null;
      this.activeNpcMessage = null;
      this.interactHint?.destroy();
      this.interactHint = null;
    }
  }

  createGlowArea(x, y, width, height, color) {
    const glow = this.add
      .rectangle(x, y, width, height, color, 0.4)
      .setOrigin(0)
      .setStrokeStyle(2, color, 1);

    this.tweens.add({
      targets: glow,
      alpha: { from: 0.2, to: 0.8 },
      duration: 800,
      yoyo: true,
      repeat: -1,
    });
  }

  isInArea(x, y, width, height) {
    return (
      this.player.x >= x &&
      this.player.x <= x + width &&
      this.player.y >= y &&
      this.player.y <= y + height
    );
  }

  showNpcDialog(text) {
    // First, clear any existing dialog
    this.destroyDialog();
    
    const sceneWidth = this.cameras.main.width - 40;
    const sceneHeight = this.cameras.main.height - 10;

    this.npcDialogShadow = this.add
      .rectangle(
        sceneWidth / 2 + 15,
        sceneHeight + 80,
        sceneWidth,
        120,
        0x000000,
        0.3
      )
      .setOrigin(0.5)
      .setScrollFactor(0);

    this.npcDialogBg = this.add
      .rectangle(
        sceneWidth / 2 + 10,
        sceneHeight + 75,
        sceneWidth,
        120,
        0xffffff,
        0.8
      )
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setStrokeStyle(1, 0x000000, 0.6);

    this.npcDialogText = this.add
      .text(sceneWidth / 2 + 10, sceneHeight + 75, text, {
        fontSize: "20px",
        fontFamily: "Arial",
        color: "#000000",
        align: "center",
        wordWrap: { width: sceneWidth - 100 },
      })
      .setOrigin(0.5)
      .setScrollFactor(0);

    // Make dialog more visible by positioning it better
    this.npcDialogShadow.setPosition(
      this.cameras.main.width / 2 + 5,
      this.cameras.main.height - 80
    );
    this.npcDialogBg.setPosition(
      this.cameras.main.width / 2,
      this.cameras.main.height - 80
    );
    this.npcDialogText.setPosition(
      this.cameras.main.width / 2,
      this.cameras.main.height - 80
    );

    this.time.delayedCall(3000, () => {
      this.destroyDialog();
    });
  }

  addNpcTrigger(x, y, message) {
    const npcZone = this.add.zone(x, y, 50, 50);
    this.add.rectangle(x, y, 50, 50, 0xff0000, 0.5).setOrigin(0);
    this.physics.world.enable(npcZone);
    npcZone.body.setAllowGravity(false);
    npcZone.body.moves = false;

    this.physics.add.overlap(this.player, npcZone, () => {
      if (!this.activeNpcZone) {
        this.activeNpcZone = npcZone;
        this.activeNpcMessage = message;

        if (!this.interactHint) {
          this.interactHint = this.add
            .text(this.player.x, this.player.y - 40, "Press SPACE to interact", {
              fontSize: "14px",
              fill: "#fff",
              backgroundColor: "#000",
              padding: { x: 5, y: 2 },
            })
            .setOrigin(0.5);
        }
      }
    });
  }

  destroyDialog() {
    // Clear both regular and NPC dialog elements
    this.dialogBg?.destroy();
    this.dialogShadow?.destroy();
    this.dialogText?.destroy();
    this.yesBtn?.destroy();
    this.noBtn?.destroy();
    
    this.npcDialogBg?.destroy();
    this.npcDialogShadow?.destroy();
    this.npcDialogText?.destroy();
  }
}