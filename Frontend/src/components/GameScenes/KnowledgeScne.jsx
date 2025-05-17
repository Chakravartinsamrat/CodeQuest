import NavigationController from "../Routes/NavigationController";
import PlayerController from "../utils/PlayerController";
export default class KnowledgeScene extends Phaser.Scene {
  constructor() {
    super("KnowledgeScene");
    
    // Define the knowledge areas data
    this.knowledgeAreas = [
      { x: 625, y: 1073, topic: "math", id:1, subtopic: "algebra", hardness: "easy" },
      { x: 300, y: 950, topic: "physics", subtopic: "mechanics", hardness: "medium" },
      { x: 900, y: 900, topic: "biology", subtopic: "genetics", hardness: "hard" },
      { x: 500, y: 750, topic: "chemistry", subtopic: "elements", hardness: "medium" },
      { x: 1100, y: 700, topic: "geography", subtopic: "countries", hardness: "easy" },
      { x: 800, y: 500, topic: "history", subtopic: "world wars", hardness: "hard" },
      { x: 400, y: 400, topic: "literature", subtopic: "classics", hardness: "medium" },
      { x: 1200, y: 300, topic: "programming", subtopic: "algorithms", hardness: "hard" },
      { x: 600, y: 200, topic: "art", subtopic: "renaissance", hardness: "medium" },
      { x: 1000, y: 100, topic: "astronomy", subtopic: "planets", hardness: "easy" }
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
  }

  create() {
    const bg = this.add.image(0, 0, "Knowledge-Arena.webp").setOrigin(0);
    bg.setDisplaySize(1600, 1200);

    this.physics.world.setBounds(0, 0, 1600, 1200);
    this.cameras.main.setBounds(0, 0, 1600, 1200);

      //ABOUT TO CREATE OBSTACLES
      this.createObstacles();

      //add collision
      this.physics.add.collider(this.player, this.obstacles);

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
          `${area.topic.toUpperCase()}\n${area.hardness}`, {
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


    this.createObstacleRect(275, 417,10,110);
  
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
    const borderRect = this.add.rectangle(x, y, width, height);
    borderRect.setOrigin(0, 0);
    borderRect.setStrokeStyle(4, 0xFF0000);
    
    // Add only the fill rectangle to the physics group (for collision)
    this.obstacles.add(fillRect, true);
  }

  showChallengeDialog(areaData) {
    // Get scene dimensions
    const sceneWidth = this.cameras.main.width - 40;
    const sceneHeight = this.cameras.main.height - 10;

    // Create dialog background
    this.dialogBg = this.add
      .rectangle(sceneWidth / 2 + 10, sceneHeight + 75, sceneWidth, 180, 0xffffff, 1)
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setStrokeStyle(2, 0x000000, 1);

    // Add shadow for floating effect
    this.dialogShadow = this.add
      .rectangle(sceneWidth / 2 + 15, sceneHeight + 80, sceneWidth, 180, 0x000000, 0.3)
      .setOrigin(0.5)
      .setScrollFactor(0);

    // Move dialog and shadow to final position with animation
    this.tweens.add({
      targets: [this.dialogBg, this.dialogShadow],
      y: sceneHeight - 75,
      duration: 300,
      ease: "Power2",
    });

    // Format the challenge text
    const challengeText = `Challenge: ${areaData.topic.toUpperCase()} - ${areaData.subtopic} Difficulty: ${areaData.hardness.toUpperCase()}\n\nDo you want to accept this challenge?`;

    // Add dialog text
    this.dialogText = this.add
      .text(sceneWidth / 2 + 10, sceneHeight - 125, challengeText, {
        fontSize: "24px",
        fontFamily: "Arial, sans-serif",
        color: "#000000",
        align: "center",
        wordWrap: { width: sceneWidth - 200 },
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
        this.showLearningDialog(areaData);
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
