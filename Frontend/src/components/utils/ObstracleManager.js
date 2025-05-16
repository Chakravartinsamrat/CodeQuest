export default class ObstacleManager {
  constructor(scene) {
    this.scene = scene;
    
    // Create a static physics group for obstacles
    this.obstacles = scene.physics.add.staticGroup();
  }
  
  createAllObstacles() {
    // Add map border obstacles with red outlines
    this.createBorders();
    
    // Create city obstacles
    this.createCityObstacles();
  }
  
  createBorders() {
    const thickness = 20;
    const worldWidth = 1600;
    const worldHeight = 1200;
    
    // Create borders on all four sides
    this.createBorderRect(0, 0, worldWidth, thickness); // top
    this.createBorderRect(0, worldHeight - thickness, worldWidth, thickness); // bottom
    this.createBorderRect(0, 0, thickness, worldHeight); // left
    this.createBorderRect(worldWidth - thickness, 0, thickness, worldHeight); // right
  }
  
  createBorderRect(x, y, width, height) {
    const rect = this.scene.add.rectangle(x, y, width, height, 0xFF0000, 0.5); // red fill
    rect.setOrigin(0, 0);
    this.obstacles.add(rect, true);
  }
  
  createObstacleRect(x, y, width, height) {
    // Create the filled rectangle (semi-transparent)
    const fillRect = this.scene.add.rectangle(x, y, width, height, 0x000000, 0.3);
    fillRect.setOrigin(0, 0);
    
    // Create the red border (stroke)
    const borderRect = this.scene.add.rectangle(x, y, width, height);
    borderRect.setOrigin(0, 0);
    borderRect.setStrokeStyle(4, 0xFF0000);
    
    // Add only the fill rectangle to the physics group (for collision)
    this.obstacles.add(fillRect, true);
  }
  
  createCityObstacles() {
    // Grass TOP TO BOTTOM LEFT SIDE
    this.createObstacleRect(345, 220, 300, 40);
    this.createObstacleRect(300, 200, 30, 90);
    this.createObstacleRect(650, 20, 50, 190);
    this.createObstacleRect(170, 270, 120, 30);
    this.createObstacleRect(160, 344, 50, 700);
    this.createObstacleRect(170, 600, 180, 100);
    this.createObstacleRect(375, 644, 60, 20);

    // Buildings
    this.createObstacleRect(335, 370, 130, 75);
    this.createObstacleRect(585, 590, 180, 30);
    this.createObstacleRect(835, 385, 100, 50);
    this.createObstacleRect(1010, 397, 100, 40);
    this.createObstacleRect(590, 780, 150, 50);
    this.createObstacleRect(945, 800, 100, 50);
    this.createObstacleRect(1115, 793, 100, 50);
    this.createObstacleRect(285, 814, 80, 30);

    // Grass bottom
    this.createObstacleRect(185, 1060, 260, 120);
    this.createObstacleRect(555, 1080, 700, 50);
    this.createObstacleRect(775, 968, 200, 100);
    this.createObstacleRect(1295, 989, 200, 200);
    this.createObstacleRect(1000, 1049, 270, 10);
    this.createObstacleRect(235, 1025, 50, 20);

    // Grass on right side
    this.createObstacleRect(1420, 254, 40, 1300);
    this.createObstacleRect(1270, 569, 120, 70);

    // Grass top right
    this.createObstacleRect(800, 229, 1000, 20);
    this.createObstacleRect(800, 21, 20, 200);

    // Inside city trees
    this.createObstacleRect(560, 419, 60, 50);
    this.createObstacleRect(890, 719, 60, 50);
    this.createObstacleRect(970, 280, 100, 10);
    this.createObstacleRect(1275, 280, 100, 10);
  }
  
  getObstacles() {
    return this.obstacles;
  }
}