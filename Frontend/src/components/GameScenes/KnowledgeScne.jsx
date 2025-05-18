import NavigationController from "../Routes/NavigationController";
import PlayerController from "../utils/PlayerController";
export default class KnowledgeScene extends Phaser.Scene {
  constructor() {
    super("KnowledgeScene");
    
    // Define the knowledge areas data
    this.knowledgeAreas = [
      { x: 625, y: 1073, topic: "math", id:1, subtopic: "algebra", hardness: "easy" },
      { x: 925, y: 1002, topic: "physics", subtopic: "mechanics", hardness: "medium" },
      { x: 925, y: 827, topic: "biology", subtopic: "genetics", hardness: "hard" },
      { x: 575, y: 752, topic: "chemistry", subtopic: "elements", hardness: "medium" },
      { x: 780, y: 612, topic: "geography", subtopic: "countries", hardness: "easy" },
      { x: 330, y: 332, topic: "history", subtopic: "world wars", hardness: "hard" },
      { x: 1175, y: 377, topic: "literature", subtopic: "classics", hardness: "medium" },
      { x: 975, y: 242, topic: "programming", subtopic: "algorithms", hardness: "hard" },
      { x: 625, y: 197, topic: "art", subtopic: "renaissance", hardness: "medium" },
      { x: 780, y: 112, topic: "astronomy", subtopic: "planets", hardness: "hard" }
    ];
    
    // Color mapping for hardness levels
    this.hardnessColors = {
      "easy": 0x00ff00,    // Green
      "medium": 0xffff00,  // Yellow
      "hard": 0xff0000     // Red
    };
  }

  init(data){
    if (data && data.gameId) {
      this.gameId = data.gameId;
      console.log('MainScene: Using gameId from scene data:', this.gameId);
    } else if (this.game && this.game.gameId) {
      this.gameId = this.game.gameId;
      console.log('MainScene: Using gameId from game instance:', this.gameId);
    } else if (window.gameId) {
      this.gameId = window.gameId;
      console.log('MainScene: Using gameId from window object:', this.gameId);
    } else {
      this.gameId = 'DSA'; // Default fallback
      console.log('MainScene: Using default gameId:', this.gameId);
    }
  }

  preload() {
    this.load.image("Knowledge-Arena.webp", "/Knowledge-Arena.webp");
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

     this.load.audio('Knowledge', '/KnowledgeScene.mp3');
  }

  create() {
    this.sound.stopAll();
    const music = this.sound.add('Knowledge', {
      loop: true,  // optional: loop music
      volume: 0.5  // optional: control volume
    });

    music.play();

    const bg = this.add.image(0, 0, "Knowledge-Arena.webp").setOrigin(0);
    bg.setDisplaySize(1600, 1200);

    this.physics.world.setBounds(0, 0, 1600, 1200);
    this.cameras.main.setBounds(0, 0, 1600, 1200);

      //ABOUT TO CREATE OBSTACLES
      this.createObstacles();

      //add collision
      

    // Add player
    // this.player = this.physics.add.sprite(745, 1169, "player").setScale(0.02);
    // OPTION 1: Use the PlayerController with your character sprite sheet
    try {
      this.playerController = new PlayerController(
        this,
        "character",
        745,
        1169,
        4
      );
      this.player = this.playerController.getPlayer();
    } catch (error) {
      console.error(
        "Error creating PlayerController, falling back to original player:",
        error
      );
    }
    this.player.setCollideWorldBounds(true);

    this.cameras.main.startFollow(this.player);
    this.cursors = this.input.keyboard.createCursorKeys();
    this.speed = 300;
this.physics.add.collider(this.player, this.obstacles);
    this.debugText = this.add
      .text(10, 10, "Use arrow keys to move", {
        fontSize: "16px",
        fill: "#ffffff",
        backgroundColor: "#000000",
      })
      .setScrollFactor(0);

    // Create all glow areas
    this.glowAreas = [];
    this.areaTexts = [];
    
    this.knowledgeAreas.forEach((area, index) => {
      // Create the glow area
      const glowColor = this.hardnessColors[area.hardness];
      const glowArea = this.add
        .rectangle(area.x, area.y, 40, 40, glowColor, 0.4)
        .setOrigin(0.5)
        .setStrokeStyle(2, glowColor, 1);
      
      // Add pulsing animation
      this.tweens.add({
        targets: glowArea,
        alpha: { from: 0.2, to: 0.8 },
        duration: 800,
        yoyo: true,
        repeat: -1,
      });
      
      // Add text label above the glow area
      const areaText = this.add
        .text(area.x, area.y - 30, 
          `${area.hardness}`, {
          fontSize: "12px",
          fontFamily: "Arial, sans-serif",
          color: "#ffffff",
          backgroundColor: "#000000",
          padding: { x: 4, y: 2 },
          align: "center",
        })
        .setOrigin(0.5);
      
      // Store references
      this.glowAreas.push({
        rect: glowArea,
        data: area
      });
      this.areaTexts.push(areaText);
    });

    this.player.setInteractive();
    this.spacebar = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    this.navController = new NavigationController(this);
    
    // Add info text
    this.infoText = this.add
      .text(this.cameras.main.width / 2, 50, "Find knowledge areas and press SPACE to challenge!", {
        fontSize: "18px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#000000",
        color: "#ffffff",
        padding: { x: 10, y: 5 },
      })
      .setOrigin(0.5)
      .setScrollFactor(0);
    
    // Fade out the info text after a few seconds
    this.tweens.add({
      targets: this.infoText,
      alpha: 0,
      delay: 5000,
      duration: 1000
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

    // Check for spacebar press and overlap with any glow area
    if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
      this.checkGlowAreaInteraction();
    }
  }
  createObstacles(){
    this.obstacles = this.physics.add.staticGroup();


    this.createObstacleRect(275, 417,10,150);
    this.createObstacleRect(10, 417,10,150);

    this.createObstacleRect(423, 167, 40, 40);
    this.createObstacleRect(1123, 167, 40, 40);
    this.createObstacleRect(715, 202, 170, 20);
    this.createObstacleRect(108,761, 290, 48);
    this.createObstacleRect(1326, 421, 140, 90);
    this.createObstacleRect(1217, 761,290, 48);
    this.createObstacleRect(1220, 997, 340, 70);
    this.createObstacleRect(10, 997, 340, 70)
  }

  checkGlowAreaInteraction() {
    for (let i = 0; i < this.glowAreas.length; i++) {
      const area = this.glowAreas[i];
      if (Phaser.Geom.Rectangle.Overlaps(
        area.rect.getBounds(),
        this.player.getBounds()
      )) {
        this.showChallengeDialog(area.data);
        break;
      }
    }
  }
  createObstacleRect(x, y, width, height) {
    // Create the filled rectangle (semi-transparent)
    const fillRect = this.add.rectangle(x, y, width, height, 0x000000, 0.3);
    fillRect.setOrigin(0, 0);
    
    // Create the red border (stroke)
    // const borderRect = this.add.rectangle(x, y, width, height);
    // borderRect.setOrigin(0, 0);
    // borderRect.setStrokeStyle(4, 0xFF0000);
    
    // Add only the fill rectangle to the physics group (for collision)
    this.obstacles.add(fillRect, true);
  }

  showChallengeDialog(areaData) {
  // Get responsive dimensions based on screen size
  const gameWidth = this.cameras.main.width;
  const gameHeight = this.cameras.main.height;
  
  // Calculate responsive dialog size
  const dialogWidth = Math.min(gameWidth * 0.85, 600);
  const dialogHeight = Math.min(gameHeight * 0.2, 200);
  const dialogX = gameWidth / 2;
  const dialogY = gameHeight + dialogHeight / 2;
  const finalY = gameHeight - dialogHeight / 2 - 20;
  
  // Add semi-transparent overlay
  this.overlay = this.add
    .rectangle(gameWidth / 2, gameHeight / 2, gameWidth, gameHeight, 0x000000, 0.5)
    .setOrigin(0.5)
    .setScrollFactor(0)
    .setDepth(10)
    .setAlpha(0);
    
  // Fade in overlay
  this.tweens.add({
    targets: this.overlay,
    alpha: 1,
    duration: 200,
    ease: 'Power2'
  });

  // Create dialog container group for easier cleanup
  this.dialogGroup = this.add.group();
  
  // Dialog background with rounded corners and gradient
  const graphics = this.add.graphics().setDepth(15);
  
  // Dialog shadow (drawn first)
  graphics.fillStyle(0x000000, 0.3);
  graphics.fillRoundedRect(dialogX - dialogWidth / 2 + 8, finalY - dialogHeight / 2 + 8, dialogWidth, dialogHeight, 16);
  
  // Main dialog background
  graphics.fillStyle(0xffffff, 1);
  graphics.fillRoundedRect(dialogX - dialogWidth / 2, finalY - dialogHeight / 2, dialogWidth, dialogHeight, 16);
  graphics.lineStyle(2, 0x4a90e2, 1);
  graphics.strokeRoundedRect(dialogX - dialogWidth / 2, finalY - dialogHeight / 2, dialogWidth, dialogHeight, 16);
  
  this.dialogGroup.add(graphics);
  graphics.setScrollFactor(0);
  
  // Create decorative header bar
  const headerHeight = dialogHeight * 0.2;
  const headerGraphics = this.add.graphics().setDepth(16);
  headerGraphics.fillStyle(0x4a90e2, 1);
  headerGraphics.fillRoundedRect(
    dialogX - dialogWidth / 2, 
    finalY - dialogHeight / 2, 
    dialogWidth, 
    headerHeight, 
    { tl: 16, tr: 16, bl: 0, br: 0 }
  );
  this.dialogGroup.add(headerGraphics);
  headerGraphics.setScrollFactor(0);
  
  // Header title text
  const headerTitle = this.add
    .text(dialogX, finalY - dialogHeight / 2 + headerHeight / 2, "NEW CHALLENGE", {
      fontFamily: 'Arial, sans-serif',
      fontSize: Math.max(16, Math.min(24, gameWidth * 0.03)) + 'px',
      fontWeight: 'bold',
      color: '#ffffff'
    })
    .setDepth(17)
    .setOrigin(0.5)
    .setScrollFactor(0);
  this.dialogGroup.add(headerTitle);

  // Challenge details with badge styling
  const topicBadge = this.add
    .text(dialogX, finalY - dialogHeight / 4, {
      fontFamily: 'Arial, sans-serif',
      fontSize: Math.max(16, Math.min(28, gameWidth * 0.035)) + 'px',
      fontWeight: 'bold',
      color: '#ffffff',
      backgroundColor: '#ff9f43',
      padding: { x: 0, y: 0 },
      borderRadius: 0
    })
    .setDepth(0)
    .setOrigin(0)
    .setScrollFactor(0);
  this.dialogGroup.add(topicBadge);
  
  // Subtopic text
  const subtopicText = this.add
    .text(dialogX, finalY - dialogHeight / 4 + topicBadge.height + 8, {
      fontFamily: 'Arial, sans-serif',
      fontSize: Math.max(14, Math.min(22, gameWidth * 0.025)) + 'px',
      color: '#333333'
    })
    .setDepth(16)
    .setOrigin(0.5)
    .setScrollFactor(0);
  this.dialogGroup.add(subtopicText);
  
  // Difficulty indicator with colored badge
  let difficultyColor;
  switch(areaData.hardness.toLowerCase()) {
    case 'easy': difficultyColor = '#2ecc71'; break;
    case 'medium': difficultyColor = '#f39c12'; break;
    default: difficultyColor = '#e74c3c'; break;
  }
  
  const difficultyText = this.add
    .text(dialogX, finalY - dialogHeight / 4 + topicBadge.height + subtopicText.height + 16, 
      " " + areaData.hardness.toUpperCase(), {
      fontFamily: 'Arial, sans-serif',
      fontSize: Math.max(12, Math.min(18, gameWidth * 0.02)) + 'px',
      fontWeight: 'bold',
      color: '#ffffff',
      backgroundColor: difficultyColor,
      padding: { x: 10, y: 5 },
      borderRadius: 5
    })
    .setDepth(16)
    .setOrigin(0.5)
    .setScrollFactor(0);
  this.dialogGroup.add(difficultyText);
  
  // Calculate button sizes and positions based on screen dimensions
  const buttonWidth = Math.min(dialogWidth * 0.3, 120);
  const buttonHeight = Math.min(dialogHeight * 0.2, 40);
  const buttonY = finalY + dialogHeight / 2 - buttonHeight - 15;
  const buttonSpacing = Math.min(dialogWidth * 0.2, 100);
  
  // Accept button with modern styling and hover effects
  const acceptButtonGraphics = this.add.graphics().setDepth(16);
  acceptButtonGraphics.fillStyle(0x2ecc71, 1);
  acceptButtonGraphics.fillRoundedRect(dialogX - buttonSpacing - buttonWidth/2, buttonY, buttonWidth, buttonHeight, 10);
  this.dialogGroup.add(acceptButtonGraphics);
  acceptButtonGraphics.setScrollFactor(0);
  
  const acceptText = this.add
    .text(dialogX - buttonSpacing, buttonY + buttonHeight/2, "ACCEPT", {
      fontFamily: 'Arial, sans-serif',
      fontSize: Math.max(14, Math.min(18, gameWidth * 0.022)) + 'px',
      fontWeight: 'bold',
      color: '#ffffff'
    })
    .setDepth(17)
    .setOrigin(0.5)
    .setScrollFactor(0)
    .setInteractive({ useHandCursor: true });
  this.dialogGroup.add(acceptText);
  
  // Decline button
  const declineButtonGraphics = this.add.graphics().setDepth(16);
  declineButtonGraphics.fillStyle(0xe74c3c, 1);
  declineButtonGraphics.fillRoundedRect(dialogX + buttonSpacing - buttonWidth/2, buttonY, buttonWidth, buttonHeight, 10);
  this.dialogGroup.add(declineButtonGraphics);
  declineButtonGraphics.setScrollFactor(0);
  
  const declineText = this.add
    .text(dialogX + buttonSpacing, buttonY + buttonHeight/2, "DECLINE", {
      fontFamily: 'Arial, sans-serif',
      fontSize: Math.max(14, Math.min(18, gameWidth * 0.022)) + 'px',
      fontWeight: 'bold',
      color: '#ffffff'
    })
    .setDepth(17)
    .setOrigin(0.5)
    .setScrollFactor(0)
    .setInteractive({ useHandCursor: true });
  this.dialogGroup.add(declineText);
  
  // Set initial positions for animation
  this.dialogGroup.getChildren().forEach(child => {
    if (child !== this.overlay) {
      child.y += dialogHeight + 50;
    }
  });
  
  // Create a collective tween for all dialog elements
  this.tweens.add({
    targets: this.dialogGroup.getChildren().filter(child => child !== this.overlay),
    y: '-=' + (dialogHeight + 50),
    duration: 500,
    ease: 'Back.easeOut',
    delay: 200
  });
  
  // Button hover effects
  acceptText.on('pointerover', () => {
    acceptButtonGraphics.clear();
    acceptButtonGraphics.fillStyle(0x27ae60, 1); // Darker green on hover
    acceptButtonGraphics.fillRoundedRect(dialogX - buttonSpacing - buttonWidth/2, buttonY, buttonWidth, buttonHeight, 10);
    this.tweens.add({
      targets: acceptText,
      scaleX: 1.05,
      scaleY: 1.05,
      duration: 100
    });
  });
  
  acceptText.on('pointerout', () => {
    acceptButtonGraphics.clear();
    acceptButtonGraphics.fillStyle(0x2ecc71, 1); // Original green
    acceptButtonGraphics.fillRoundedRect(dialogX - buttonSpacing - buttonWidth/2, buttonY, buttonWidth, buttonHeight, 10);
    this.tweens.add({
      targets: acceptText,
      scaleX: 1,
      scaleY: 1,
      duration: 100
    });
  });
  
  declineText.on('pointerover', () => {
    declineButtonGraphics.clear();
    declineButtonGraphics.fillStyle(0xc0392b, 1); // Darker red on hover
    declineButtonGraphics.fillRoundedRect(dialogX + buttonSpacing - buttonWidth/2, buttonY, buttonWidth, buttonHeight, 10);
    this.tweens.add({
      targets: declineText,
      scaleX: 1.05,
      scaleY: 1.05,
      duration: 100
    });
  });
  
  declineText.on('pointerout', () => {
    declineButtonGraphics.clear();
    declineButtonGraphics.fillStyle(0xe74c3c, 1); // Original red
    declineButtonGraphics.fillRoundedRect(dialogX + buttonSpacing - buttonWidth/2, buttonY, buttonWidth, buttonHeight, 10);
    this.tweens.add({
      targets: declineText,
      scaleX: 1,
      scaleY: 1,
      duration: 100
    });
  });
  
  // Setup button click events
  acceptText.on('pointerdown', () => {
    this.destroyDialog();
    this.showLearningDialog(areaData);
  });
  
  declineText.on('pointerdown', () => {
    this.destroyDialog();
  });
  
  // Method to destroy dialog with animation
  this.destroyDialog = () => {
    // Animate dialog out
    this.tweens.add({
      targets: this.dialogGroup.getChildren().filter(child => child !== this.overlay),
      y: '+=' + (dialogHeight + 50),
      alpha: 0,
      duration: 300,
      ease: 'Back.easeIn'
    });
    
    // Fade out overlay
    this.tweens.add({
      targets: this.overlay,
      alpha: 0,
      duration: 300,
      onComplete: () => {
        // Destroy all dialog elements
        this.dialogGroup.clear(true, true);
        this.overlay.destroy();
      }
    });
  };
  
  // Handle window resize for responsiveness
  const resizeListener = () => {
    this.destroyDialog();
    this.showChallengeDialog(areaData);
  };
  
  // Listen for resize events while dialog is active
  window.addEventListener('resize', resizeListener);
  
  // Make sure to remove listener when dialog is destroyed
  const originalDestroyDialog = this.destroyDialog;
  this.destroyDialog = () => {
    window.removeEventListener('resize', resizeListener);
    originalDestroyDialog();
  };
}
  // destroyDialog() {
  //   // Safely destroy dialog elements if they exist
  //   if (this.dialogBg) this.dialogBg.destroy();
  //   if (this.dialogShadow) this.dialogShadow.destroy();
  //   if (this.dialogText) this.dialogText.destroy();
  //   if (this.yesBtn) this.yesBtn.destroy();
  //   if (this.noBtn) this.noBtn.destroy();
  // }

  showLearningDialog(areaData) {
    const playerPos = { x: this.player.x, y: this.player.y };
    // Store both player position and challenge data
    this.game.registry.set("playerPos", playerPos);
    this.game.registry.set("challengeData", areaData);
    
    if (window.showLearningInterface) {
      window.showLearningInterface(areaData);
    } else {
      console.error("React Learning Interface not available");
    }
  }
}
