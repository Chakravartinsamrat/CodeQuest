import NavigationController from "../Routes/NavigationController";
import PlayerController from "../utils/PlayerController";
import sceneManager from "../utils/SceneManager";

export default class ArcadeHome extends Phaser.Scene {
  constructor() {
    super("ArcadeHome");
  }

  preload() {
    this.load.image("Aracde", "/Arcade.png");
    this.load.spritesheet("character", "/PlayerMovement.png", {
      frameWidth: 16,
      frameHeight: 24,
    });
  }
  create() {
    const bg = this.add.image(200, 0, "Aracde").setOrigin(0);
    bg.setDisplaySize(1600, 1000);

    this.physics.world.setBounds(200, 0, 1600, 1000);
    this.cameras.main.setBounds(0, 0, 1600, 1000);
    this.cameras.main.setZoom(0.6);

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

    this.cameras.main.startFollow(this.player);
    this.cursors = this.input.keyboard.createCursorKeys();
    this.speed = 300;

    // this.debugText = this.add
    //   .text(10, 10, "Use arrow keys to move", {
    //     fontSize: "16px",
    //     fill: "#ffffff",
    //     backgroundColor: "#000000",
    //   })
    //   .setScrollFactor(0);

    // Define the interactive areas
    this.interactiveAreas = [
      { x: 867, y: 467, width: 60, height: 40, color: 0x00ff00, scene: "TetrisScene" },
      { x: 1138, y: 667, width: 60, height: 40, color: 0x00ff00, scene: "DinoScene" },
      { x: 1675, y: 402, width: 60, height: 40, color: 0x00ff00, scene: "SnakeGame" },
    ];

    // Create glow areas for each interactive area
    this.interactiveAreas.forEach(area => {
      this.createGlowArea(area.x, area.y, area.width, area.height, area.color);
    });

    this.navController = new NavigationController(this);
    
    // Add key for interaction
    this.interactKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    
    // Add instruction text
    this.interactText = this.add
      .text(400, 10, "", {
        fontSize: "16px",
        fill: "#ffffff",
        backgroundColor: "#000000",
      })
      .setScrollFactor(0)
      .setVisible(false);
  }

  isInArea(x, y, width, height) {
    return (
      this.player.x >= x &&
      this.player.x <= x + width &&
      this.player.y >= y &&
      this.player.y <= y + height
    );
  }

  update() {
    try {
      if (this.playerController) {
        const playerStatus = this.playerController.update();
      } else {
        this.updateOriginalPlayer();
      }

      // Update debug text
      // this.debugText.setText(
      //   `Player pos: ${Math.round(this.player.x)}, ${Math.round(this.player.y)}`
      // );
      // console.log(`Player pos: ${Math.round(this.player.x)}, ${Math.round(this.player.y)}`
// )
    } catch (error) {
      console.error("Error in update:", error);
    }

    this.player.setVelocity(0);

    if (this.cursors.left.isDown) this.player.setVelocityX(-this.speed);
    else if (this.cursors.right.isDown) this.player.setVelocityX(this.speed);

    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-this.speed);
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(this.speed);
    }

    // Check if player is in any interactive area
    let playerInAnyArea = false;
    for (const area of this.interactiveAreas) {
      if (this.isInArea(area.x, area.y, area.width, area.height)) {
        playerInAnyArea = true;
        this.interactText.setText(`Press E to play ${area.scene}`);
        this.interactText.setVisible(true);
        
        // Check if E key was just pressed
        if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
          sceneManager.navigateToScene(this, area.scene);
          break;
        }
      }
    }
    
    // Hide interaction text if not in any area
    if (!playerInAnyArea) {
      this.interactText.setVisible(false);
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
}