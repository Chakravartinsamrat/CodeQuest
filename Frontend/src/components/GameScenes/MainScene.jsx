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
    this.cameras.main.setZoom(1.5);
    
    // Create player with physics
    this.player = this.physics.add.sprite(675, 950, "player").setScale(0.01);

    this.player.setCollideWorldBounds(true);
    
    // Create obstacles
    this.createObstacles();
    
    // Add collision between player and obstacles
    this.physics.add.collider(this.player, this.obstacles);
    
    // Setup camera to follow player
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);

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

    // Create a glowing area using a semi-transparent green rectangle
this.challengeGlowScene = this.add.rectangle(955, 875, 20, 10, 0x0000FF, 0.4)
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
  console.log("working")
    if (event.shiftKey) {
      // Launch the menu scene as an overlay
      this.scene.launch('MenuScene');
    }
  });
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
      this.scene.start("KnowledgeScene");
    }
  if (
    this.player.x >= 955 &&
    this.player.x <= 975 && // 955 + 20 (rectangle width)
    this.player.y >= 875 &&
    this.player.y <= 885    // 875 + 10 (rectangle height)
  ) {
    // Start ChallengeScene and pass player position
    this.scene.start("ChallengeScene", { playerX: 855, playerY: 1003 });
  }


  }
  
  createObstacles() {
    // Create a static physics group for obstacles
    this.obstacles = this.physics.add.staticGroup();
    
    // Add map border obstacles with red outlines
    this.createBorders();
    
    // Grass TOP TO BOTTOM LEFT SIDE
    this.createObstacleRect(345, 220, 300, 40);
    this.createObstacleRect(300, 200, 30, 90);
    this.createObstacleRect(650, 20, 50, 190);
    this.createObstacleRect(170, 270,120, 30);
    this.createObstacleRect(160, 344 ,50, 700);
    this.createObstacleRect(170, 600 ,180, 100);
    this.createObstacleRect(375, 644 ,60, 20);

    //buildings
    this.createObstacleRect(335, 370, 130, 75);
    this.createObstacleRect(585, 590, 180, 30);
    this.createObstacleRect(835, 385, 100, 50);
    this.createObstacleRect(1010, 397, 100, 40);
    this.createObstacleRect(590, 780, 150, 50);
    this.createObstacleRect(945, 800, 100, 50);
    this.createObstacleRect(1115, 793, 100, 50);
    this.createObstacleRect(285,814, 80, 30);

    //grass bottom
    this.createObstacleRect(185, 1060 ,260, 120);
    this.createObstacleRect(555, 1080, 700, 50);
    this.createObstacleRect(775, 968, 200, 100);
    this.createObstacleRect(1295, 989, 200, 200);
    this.createObstacleRect(1000, 1049, 270, 10);
    this.createObstacleRect(235, 1025, 50, 20);

    //grass anna right side
    this.createObstacleRect(1420, 254, 40, 1300);
    this.createObstacleRect(1270, 569, 120, 70);

    //grass top right
    this.createObstacleRect(800, 229, 1000, 20);
    this.createObstacleRect(800, 21, 20, 200);

    //inside city trees
    this.createObstacleRect(560, 419, 60, 50);
    this.createObstacleRect(890, 719, 60, 50);
    this.createObstacleRect(970, 280, 100, 10);
    this.createObstacleRect(1275, 280, 100, 10);

    // this.createObstacleRect(700, 400, 100, 300);
    // this.createObstacleRect(400, 600, 350, 80);
    // this.createObstacleRect(1000, 200, 50, 400);
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
