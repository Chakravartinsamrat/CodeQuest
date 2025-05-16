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
    this.player = this.physics.add.sprite(100, 100, "player").setScale(0.01);
    this.player.setCollideWorldBounds(true);
    
    // Create obstacles
    this.createObstacles();
    
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
  }
  
  createObstacles() {
    // Create a static physics group for obstacles
    this.obstacles = this.physics.add.staticGroup();
    
    // Add map border obstacles with red outlines
    this.createBorders();
    
    // Add some obstacle rectangles in the map
    this.createObstacleRect(300, 200, 200, 50);
    this.createObstacleRect(335, 359, 135, 120);
    this.createObstacleRect(700, 400, 100, 300);
    this.createObstacleRect(400, 600, 350, 80);
    this.createObstacleRect(1000, 200, 50, 400);
  }
  
  createBorders() {
    const thickness = 20;
    const worldWidth = 1600;
    const worldHeight = 1200;
    this.createBorderRect(0, 0, worldWidth, thickness); //top
    this.createBorderRect(0, worldHeight - thickness, worldWidth, thickness); //bottom
    this.createBorderRect(0, 0, thickness, worldHeight);    //left
    this.createBorderRect(worldWidth - thickness, 0, thickness, worldHeight); //right
  }
  
  createBorderRect(x, y, width, height) {
    const rect = this.add.rectangle(x, y, width, height, 0xFF0000, 0.5); //red fill
    rect.setOrigin(0, 0);
    this.obstacles.add(rect, true);
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
}
