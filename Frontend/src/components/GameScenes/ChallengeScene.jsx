import NavigationController from "../Routes/NavigationController";
import PlayerController from "../utils/PlayerController";
export default class ChallengeScene extends Phaser.Scene {
  constructor() {
    super("ChallengeScene");
  }

  preload() {
    this.load.image("Challenge", "/Training-Arena.webp");
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

  create(data) {
    const bg = this.add.image(0, 0, "Challenge").setOrigin(0);
    bg.setDisplaySize(1600, 1200);

    this.physics.world.setBounds(0, 0, 1600, 1200);
    this.cameras.main.setBounds(0, 0, 1600, 1200);

    //CREATE OBSTACLES
    this.createObstacles();

      //add collision
      this.physics.add.collider(this.player, this.obstacles);


    // Add player
    // this.player = this.physics.add.sprite(850, 1103, "player").setScale(0.02);
    try {
          this.playerController = new PlayerController(
            this,
            "character",
            675,
            950,
            4
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

    // If returning from challenge, restore player position
    if (data && data.playerPos) {
      this.player.x = data.playerPos.x;
      this.player.y = data.playerPos.y;
    }

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
      .rectangle(425, 1053, 20, 20, 0x00ff00, 0.4)
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

    this.glowAreaBack = this.add
      .rectangle(775, 1158, 150, 10, 0x00ff00, 0.4)
      .setOrigin(0)
      .setStrokeStyle(2, 0x00ff00, 1);

    this.tweens.add({
      targets: this.glowAreaBack,
      alpha: { from: 0.2, to: 0.8 },
      duration: 800,
      yoyo: true,
      repeat: -1,
    });

    this.navController = new NavigationController(this);

    // Register scene with game's global registry for React integration
    if (this.game.registry) {
      this.game.registry.set('currentScene', this);
    }
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

    // Check for spacebar press and overlap with glowArea
    if (
      Phaser.Input.Keyboard.JustDown(this.spacebar) &&
      Phaser.Geom.Rectangle.Overlaps(
        this.glowArea.getBounds(),
        this.player.getBounds()
      )
    ) {
      this.showChallengeDialog();
    }

    if (
      this.player.x >= 775 &&
      this.player.x <= 925 &&
      this.player.y >= 1158 &&
      this.player.y <= 1168
    ) {
      this.scene.start("MainScene");
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
  const playerPos = { x: this.player.x, y: this.player.y };
  this.game.registry.set('playerPos', playerPos);
  if (window.showChallengeInterface) {
    window.showChallengeInterface();
    // this.scene.pause();
  } else {
    console.error("React Challengeinterface.jsx not available");
  }
}
}