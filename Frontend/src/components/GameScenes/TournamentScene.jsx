import NavigationController from "../Routes/NavigationController";
import PlayerController from "../utils/PlayerController";

export default class GymScene extends Phaser.Scene {
  constructor() {
    super("TournamentScene");
  }

  preload() {
    this.load.image("Tournament", "/Tournament~4.avif");
    this.load.image("player", "/BOSS.png");
    this.load.spritesheet(
      "character",
      // Use your actual sprite sheet path here
      "/PlayerMovement.png",
      {
        frameWidth: 16, // Make sure these match your sprite sheet's actual dimensions
        frameHeight: 24, // Make sure these match your sprite sheet's actual dimensions
      }
    );
  }

  create() {
    const bg = this.add.image(80, 0, "Tournament").setOrigin(0);
    bg.setDisplaySize(1600, 1000); // match world and camera bounds exactly

    this.physics.world.setBounds(80, 0, 1600, 1000);
    this.cameras.main.setBounds(80, 0, 1600, 1000);


    //ABOUT TO CREATE OBSTACLES
      this.createObstacles();

    this.physics.world.setBounds(80, 0, 1600, 1000);
    this.cameras.main.setBounds(80, 0, 1600, 1000);


    //ABOUT TO CREATE OBSTACLES
      this.createObstacles();


    // Add player
    // this.player = this.physics.add.sprite(500, 408, "player").setScale(0.02);
    try {
      this.playerController = new PlayerController(
        this,
        "character",
        890,
        863,
        6
      );
      this.player = this.playerController.getPlayer();
    } catch (error) {
      console.error(
        "Error creating PlayerController, falling back to original player:",
        error
      );
      // OPTION 2: Fall back to original player if sprite sheet doesn't work
      this.fallbackToOriginalPlayer();
    }
    this.player.setCollideWorldBounds(true);

    this.cameras.main.startFollow(this.player);
    this.cursors = this.input.keyboard.createCursorKeys();
    this.speed = 300;
        this.physics.add.collider(this.player, this.obstacles);

        this.physics.add.collider(this.player, this.obstacles);


    this.debugText = this.add
      .text(10, 10, "Use arrow keys to move", {
        fontSize: "16px",
        fill: "#ffffff",
        backgroundColor: "#000000",
      })
      .setScrollFactor(0);

    this.glowArea = this.add
      .rectangle(500, 398, 20, 20, 0x00ff00, 0.4)
      .setOrigin(0)
      .setStrokeStyle(2, 0x00ff00, 1);
    this.tweens.add({
      targets: this.glowArea,
      alpha: { from: 0.2, to: 0.8 },
      duration: 800,
      yoyo: true,
      repeat: -1,
    });

    // this.showChallengeDialog()

    // Add spacebar interaction
    this.player.setInteractive();
    this.spacebar = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    this.speed = 300;
    this.navController = new NavigationController(this);
  }

  update() {
    try {
      if (this.playerController) {
        // Update player movement and animations through the controller
        const playerStatus = this.playerController.update();
      } else {
        // Original movement code from your MainScene
        this.updateOriginalPlayer();
      }

      // Update debug text
      this.debugText.setText(
        `Player pos: ${Math.round(this.player.x)}, ${Math.round(this.player.y)}`
      );

      // Check for interactions with glowing areas
    } catch (error) {
      console.error("Error in update:", error);
    }
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
    // Update player position text
    this.debugText.setText(
      `Player pos: ${Math.round(this.player.x)}, ${Math.round(this.player.y)}`
    );

    if (
      Phaser.Input.Keyboard.JustDown(this.spacebar) &&
      Phaser.Geom.Rectangle.Overlaps(
        this.glowArea.getBounds(),
        this.player.getBounds()
      )
    ) {
      this.showChallengeDialog();
    }
  }
  createObstacles(){
    this.obstacles = this.physics.add.staticGroup();


    // this.createObstacleRect(275, 417,10,110);
  
  }
  createObstacleRect(x, y, width, height) {
    // Create the filled rectangle (semi-transparent)
    const fillRect = this.add.rectangle(x, y, width, height, 0x000000, 0.3);
    fillRect.setOrigin(0, 0);
    
    // Create the red border (stroke)
    const borderRect = this.add.rectangle(x, y, width, height);
    borderRect.setOrigin(0, 0);
    borderRect.setStrokeStyle(4, 0xFF0000);
    
    // Add only the fill rectangle to the physics group (for collision)
    this.obstacles.add(fillRect, true);
  }

  showChallengeDialog() {
    // Get scene dimensions
    const sceneWidth = this.cameras.main.width - 40;
    const sceneHeight = this.cameras.main.height - 10; // Position 10px from bottom

    // Create dialog background (white rectangle near bottom)
    this.dialogBg = this.add
      .rectangle(
        sceneWidth / 2 + 10,
        sceneHeight + 75,
        sceneWidth,
        150,
        0xffffff,
        1
      )
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setStrokeStyle(2, 0x000000, 1); // Black border

    // Add shadow for floating effect
    this.dialogShadow = this.add
      .rectangle(
        sceneWidth / 2 + 15,
        sceneHeight + 80,
        sceneWidth,
        150,
        0x000000,
        0.3
      )
      .setOrigin(0.5)
      .setScrollFactor(0);

    // Move dialog and shadow to final position with animation
    this.tweens.add({
      targets: [this.dialogBg, this.dialogShadow],
      y: sceneHeight - 75, // Adjusted to be 10px from bottom
      duration: 300,
      ease: "Power2",
    });

    // Add dialog text (black, centered)
    this.dialogText = this.add
      .text(sceneWidth / 2 + 10, sceneHeight - 125, "Jion tournament?", {
        fontSize: "24px",
        fontFamily: "Arial, sans-serif",
        color: "#000000",
        align: "center",
        wordWrap: { width: sceneWidth - 200 }, // Adjust for padding
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setAlpha(0);

    // Animate text fade-in
    this.tweens.add({
      targets: this.dialogText,
      alpha: 1,
      duration: 300,
      delay: 200,
    });

    // Add Yes button (green)
    this.yesBtn = this.add
      .text(sceneWidth / 2 - 100, sceneHeight - 45, "Yes", {
        fontSize: "20px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#28a745",
        color: "#ffffff",
        padding: { x: 20, y: 10 },
        align: "center",
        shadow: {
          offsetX: 2,
          offsetY: 2,
          color: "#000000",
          blur: 4,
          fill: true,
        },
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setInteractive({ useHandCursor: true })
      .setAlpha(0)
      .on("pointerdown", () => {
        this.destroyDialog();
        this.showTournamentInterface();
        // this.scene.start("ContentScene", {
        //     challengeAccepted: true,
        //     playerPos: { x: this.player.x, y: this.player.y }
        // });
      })
      .on("pointerover", () =>
        this.yesBtn.setStyle({ backgroundColor: "#218838" })
      )
      .on("pointerout", () =>
        this.yesBtn.setStyle({ backgroundColor: "#28a745" })
      );

    // Add No button (red)
    this.noBtn = this.add
      .text(sceneWidth / 2 + 100, sceneHeight - 45, "No", {
        fontSize: "20px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#dc3545",
        color: "#ffffff",
        padding: { x: 20, y: 10 },
        align: "center",
        shadow: {
          offsetX: 2,
          offsetY: 2,
          color: "#000000",
          blur: 4,
          fill: true,
        },
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setInteractive({ useHandCursor: true })
      .setAlpha(0)
      .on("pointerdown", () => {
        this.destroyDialog();
      })
      .on("pointerover", () =>
        this.noBtn.setStyle({ backgroundColor: "#c82333" })
      )
      .on("pointerout", () =>
        this.noBtn.setStyle({ backgroundColor: "#dc3545" })
      );

    // Animate buttons fade-in
    this.tweens.add({
      targets: [this.yesBtn, this.noBtn],
      alpha: 1,
      duration: 300,
      delay: 300,
    });
  }

  destroyDialog() {
    // Safely destroy dialog elements if they exist
    if (this.dialogBg) this.dialogBg.destroy();
    if (this.dialogShadow) this.dialogShadow.destroy();
    if (this.dialogText) this.dialogText.destroy();
    if (this.yesBtn) this.yesBtn.destroy();
    if (this.noBtn) this.noBtn.destroy();
  }

  showTournamentInterface() {
    const playerPos = { x: this.player.x, y: this.player.y };
    this.game.registry.set("playerPos", playerPos);
    if (window.showChallengeInterface) {
      window.showTournamentInterface();
      // this.scene.pause();
    } else {
      console.error("React Challengeinterface.jsx not available");
    }
  }
}