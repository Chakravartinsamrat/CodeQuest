import ObstacleManager from "../utils/ObstracleManager";
import NavigationController from "../Routes/NavigationController";
import sceneManager from "../utils/SceneManager";
import PlayerController from "../utils/PlayerController.js";


export default class MainScene extends Phaser.Scene {
  constructor() {
    super("MainScene");
  }

  preload() {
    // Load your character sprite sheet with fixed dimensions
    this.load.spritesheet('character', 
      // Use your actual sprite sheet path here
      '/PlayerMovement.png',  
      { 
        frameWidth: 16,   // Make sure these match your sprite sheet's actual dimensions
        frameHeight: 24   // Make sure these match your sprite sheet's actual dimensions
      }
    );
    
    // Keep your original assets as well
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
    
    // OPTION 1: Use the PlayerController with your character sprite sheet
    try {
      this.playerController = new PlayerController(this, 'character', 675, 950, 2);
      this.player = this.playerController.getPlayer();
    } catch (error) {
      console.error("Error creating PlayerController, falling back to original player:", error);
      // OPTION 2: Fall back to original player if sprite sheet doesn't work
      this.fallbackToOriginalPlayer();
    }
    
    // Create obstacles
    this.obstacleManager = new ObstacleManager(this);
    this.obstacleManager.createAllObstacles();
    this.obstacles = this.obstacleManager.getObstacles();
    
    // Add collision between player and obstacles
    this.physics.add.collider(this.player, this.obstacles);
    
    // Setup camera to follow player
    this.cameras.main.startFollow(this.player);

    // Debug text to confirm update is running
    this.debugText = this.add.text(10, 10, "Use arrow keys to move", {
      fontSize: '16px',
      fill: '#ffffff',
      backgroundColor: '#000000'
    }).setScrollFactor(0);

    // Create interaction areas
    this.createInteractionAreas();
    
    // Setup navigation controller
    this.navController = new NavigationController(this);

    // Menu shortcut
    this.input.keyboard.on('keydown-P', (event) => {
      if (event.shiftKey) {
        // Launch the menu scene as an overlay
        this.scene.launch('MenuScene');
      }
    });
  }

  // Fallback to original player implementation if needed
  fallbackToOriginalPlayer() {
    this.player = this.physics.add.sprite(675, 950, "player").setScale(0.01);
    this.player.setCollideWorldBounds(true);
    this.cursors = this.input.keyboard.createCursorKeys();
    this.speed = 300;
    this.usingPlayerController = false;
  }

  createInteractionAreas() {
    // Knowledge Area
    this.knowledgeArea = this.add.rectangle(630, 870, 60, 40, 0x00ff00, 0.4)
      .setOrigin(0)
      .setStrokeStyle(2, 0x00ff00, 1);

    this.tweens.add({
      targets: this.knowledgeArea,
      alpha: { from: 0.2, to: 0.8 },
      duration: 800,
      yoyo: true,
      repeat: -1,
    });

    // Challenge Area 1
    this.challengeGlowScene1 = this.add.rectangle(955, 875, 20, 10, 0x0000FF, 0.4)
      .setOrigin(0)
      .setStrokeStyle(2, 0x00ff00, 1);

    this.tweens.add({
      targets: this.challengeGlowScene1,
      alpha: { from: 0.2, to: 0.8 },
      duration: 800,
      yoyo: true,
      repeat: -1,
    });

    // Gym Area
    this.gymArea = this.add.rectangle(585, 665, 50, 10, 0x0000FF, 0.4)
      .setOrigin(0)
      .setStrokeStyle(2, 0x00ff00, 1);

// Optionally, make it pulse using tween
this.tweens.add({
  targets: this.challengeGlowScene,
  alpha: { from: 0.2, to: 0.8 },
  duration: 800,
  yoyo: true,
  repeat: -1,
});

this.input.keyboard.on('keydown-P', (event) => {
    if (event.shiftKey) {
      // Launch the menu scene as an overlay
      this.scene.launch('MenuScene');
    }
  });
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
      this.debugText.setText(`Player pos: ${Math.round(this.player.x)}, ${Math.round(this.player.y)}`);
      
      // Check for interactions with glowing areas
      this.checkInteractions();
    } catch (error) {
      console.error("Error in update:", error);
    }
  }

  // Original player movement logic
  updateOriginalPlayer() {
    // Reset velocity
    this.player.setVelocity(0);

    // Handle player movement
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

  checkInteractions() {
    // Knowledge Area
    if (
      this.player.x > 630 &&
      this.player.x < 690 &&
      this.player.y > 870 &&
      this.player.y < 910
    ) {
      sceneManager.navigateToScene(this, "KnowledgeScene");
    }

    // Challenge Area
    if (
      this.player.x >= 955 &&
      this.player.x <= 975 &&
      this.player.y >= 875 &&
      this.player.y <= 885
    ) {
      // Start ChallengeScene and pass player position
      this.scene.start("ChallengeScene", { playerX: 855, playerY: 1003 });
    }

    // Gym Area
    if (
      this.player.x >= 585 &&
      this.player.x <= 635 &&
      this.player.y >= 665 &&
      this.player.y <= 675
    ) {
      sceneManager.navigateToScene(this, "GymScene");
    }
  }
}
