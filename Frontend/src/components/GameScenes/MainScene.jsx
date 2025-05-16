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
    
    // Create player with physics
    this.player = this.physics.add.sprite(675, 950, "player").setScale(0.01);

    this.player.setCollideWorldBounds(true);
    
    // Create obstacles
    this.obstacleManager = new ObstacleManager(this);
    this.obstacleManager.createAllObstacles();
    this.obstacles = this.obstacleManager.getObstacles();
    
    // Add collision between player and obstacles
    this.physics.add.collider(this.player, this.obstacles);
    
    // Setup camera to follow player
    this.cameras.main.startFollow(this.player);

    // Setup controls
    this.cursors = this.input.keyboard.createCursorKeys();
    this.speed = 300;
    
    // Debug text to confirm update is running
    this.debugText = this.add.text(10, 10, "Use arrow keys to move", {
      fontSize: '16px',
      fill: '#ffffff',
      backgroundColor: '#000000'
    }).setScrollFactor(0);


    // Create a glowing area using a semi-transparent green rectangle
    this.glowArea = this.add.rectangle(630, 870, 60, 40, 0x00ff00, 0.4)
      .setOrigin(0)
      .setStrokeStyle(2, 0x00ff00, 1);

    // Optionally, make it pulse using tween
    this.tweens.add({
      targets: this.glowArea,
      alpha: { from: 0.2, to: 0.8 },
      duration: 800,
      yoyo: true,
      repeat: -1,
    });
    this.navController = new NavigationController(this);
  }

  update() {
    // Update debug text
    this.debugText.setText(`Player pos: ${Math.round(this.player.x)}, ${Math.round(this.player.y)}`);
    
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

    if (
      this.player.x > 630 &&
      this.player.x < 690 &&  // 630 + 60
      this.player.y > 870 &&
      this.player.y < 910     // 870 + 40
    ) {
      sceneManager.navigateToScene(this, "KnowledgeScene");
    }

  }
}
