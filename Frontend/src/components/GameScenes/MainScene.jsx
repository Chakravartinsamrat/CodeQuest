
import ObstacleManager from "../utils/ObstracleManager";
import NavigationController from "../Routes/NavigationController";
import sceneManager from "../utils/SceneManager";
import PlayerController from "../utils/PlayerController.js";


export default class MainScene extends Phaser.Scene {
  constructor() {
    super("MainScene");
    this.trainingSpots = [];
    this.inTrainingCooldown = false;
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
    


    
    this.player.setCollideWorldBounds(true);

    // Create obstacles
    this.obstacleManager = new ObstacleManager(this);
    this.obstacleManager.createAllObstacles();
    this.obstacles = this.obstacleManager.getObstacles();
    this.physics.add.collider(this.player, this.obstacles);

    // Camera follows player
    this.cameras.main.startFollow(this.player);
        this.cameras.main.setZoom(1.5)


    // Controls
    this.cursors = this.input.keyboard.createCursorKeys();
    this.speed = 300;

    // Debug text
    this.debugText = this.add
      .text(10, 10, "Use arrow keys to move", {
        fontSize: "16px",
        fill: "#ffffff",
        backgroundColor: "#000000",
      })
      .setScrollFactor(0);

    // Glowing zones
    this.createGlowArea(630, 870, 60, 40, 0x00ff00);
    this.createGlowArea(650, 850, 60, 40, 0x00ff00);
    this.createGlowArea(955, 875, 20, 10, 0x0000ff);
    this.createGlowArea(585, 665, 50, 10, 0x0000ff);
    this.createGlowArea(1150, 879, 20, 10, 0x0000ff);

    this.navController = new NavigationController(this);

    // Handle P key
    this.input.keyboard.on("keydown-P", (event) => {
      if (event.shiftKey) {
        this.scene.launch("MenuScene");
      }
    });

    this.activeNpcZone = null;
    this.activeNpcMessage = null;
    
    // Properly define space key - moved here from constructor
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    
    // Fix: Add specific space key event listener for NPC dialog
    this.input.keyboard.on('keydown-SPACE', () => {
      if (this.activeNpcZone && this.activeNpcMessage) {
        this.showNpcDialog(this.activeNpcMessage);
        this.interactHint?.destroy();
        this.interactHint = null;
      }
    });

    this.addNpcTrigger(1065, 523, "Welcome, hero! Be careful ahead.");
    this.addNpcTrigger(790, 555, "I once saw a monster around here...");
    this.addNpcTrigger(1190, 655, "I once saw a monster around here...");

    // Define grass regions - you may need to adjust these based on your actual map
    this.grassRegions = [
      { x: 940, y: 608, width: 300, height: 190 },  // Main grass field
      { x: 215, y: 720, width: 120, height: 120 },  // Small grass patch
      { x: 345, y: 291, width: 300, height: 100 },  // Right side grass
      { x: 845, y: 280, width: 500, height: 100 },  // Right side grass
      { x: 1200, y: 380, width: 200, height: 500 }  // Right side grass
    ];
    
    // Generate random training spots in grass regions
    this.generateTrainingSpots();
    
    // Generate new training spots every 30 seconds
    this.time.addEvent({
      delay: 30000,
      callback: this.generateTrainingSpots,
      callbackScope: this,
      loop: true
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
  

    // Reset velocity
    this.player.setVelocity(0);

    if (this.cursors.left.isDown) this.player.setVelocityX(-this.speed);
    else if (this.cursors.right.isDown) this.player.setVelocityX(this.speed);

    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-this.speed);
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(this.speed);
    }

      if (this.cursors.up.isDown) this.player.setVelocityY(-this.speed);
    else if (this.cursors.down.isDown) this.player.setVelocityY(this.speed);

    // Navigation to different scenes
    if (this.isInArea(630, 870, 60, 40)) {
      sceneManager.navigateToScene(this, "KnowledgeScene");
    }

    if (this.isInArea(955, 875, 20, 10)) {
      this.scene.start("ChallengeScene", { playerX: 855, playerY: 1003 });
      sceneManager.navigateToScene(this,"ChallengeScene");
    }

    if (this.isInArea(585, 665, 50, 10)) {
      sceneManager.navigateToScene(this, "GymScene");
    }

    if(this.isInArea(1150, 879, 20, 10)) {
      sceneManager.navigateToScene(this, "TournamentScene");
    }

    // Check if player is in any training spot
    if (!this.inTrainingCooldown) {
      for (const spot of this.trainingSpots) {
        if (this.isInArea(spot.x, spot.y, spot.width, spot.height)) {
          this.startTrainingChallenge();
          break;
        }
      }
    }

    // NPC interaction
    if (this.activeNpcZone) {
      if (this.interactHint) {
        this.interactHint.setPosition(this.player.x, this.player.y - 40);
      }
      
      // Removed the space key check from here since we're handling it with the event listener
    }

    // Exit zone if player walks away
    if (
      this.activeNpcZone &&
      !Phaser.Geom.Intersects.RectangleToRectangle(
        this.player.getBounds(),
        this.activeNpcZone.getBounds()
      )
    ) {
      this.activeNpcZone = null;
      this.activeNpcMessage = null;
      this.interactHint?.destroy();
      this.interactHint = null;
    }
    if (
      this.player.x >= 1020 &&
      this.player.x <= 1080 && // 955 + 20 (rectangle width)
      this.player.y >= 1065 &&
      this.player.y <= 1125    // 875 + 10 (rectangle height)
    ) {
      sceneManager.navigateToScene(this, "GruntScene");
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

  
  isInArea(x, y, width, height) {
    return (
      this.player.x >= x &&
      this.player.x <= x + width &&
      this.player.y >= y &&
      this.player.y <= y + height
    );
  }

  showNpcDialog(text) {
    // First, clear any existing dialog
    this.destroyDialog();
    
    const sceneWidth = this.cameras.main.width - 40;
    const sceneHeight = this.cameras.main.height - 10;

    this.npcDialogShadow = this.add
      .rectangle(
        sceneWidth / 2 + 15,
        sceneHeight + 80,
        sceneWidth,
        120,
        0x000000,
        0.3
      )
      .setOrigin(0.5)
      .setScrollFactor(0);

    this.npcDialogBg = this.add
      .rectangle(
        sceneWidth / 2 + 10,
        sceneHeight + 75,
        sceneWidth,
        120,
        0xffffff,
        0.8
      )
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setStrokeStyle(1, 0x000000, 0.6);

    this.npcDialogText = this.add
      .text(sceneWidth / 2 + 10, sceneHeight + 75, text, {
        fontSize: "20px",
        fontFamily: "Arial",
        color: "#000000",
        align: "center",
        wordWrap: { width: sceneWidth - 100 },
      })
      .setOrigin(0.5)
      .setScrollFactor(0);

    // Make dialog more visible by positioning it better
    this.npcDialogShadow.setPosition(
      this.cameras.main.width / 2 + 5,
      this.cameras.main.height - 80
    );
    this.npcDialogBg.setPosition(
      this.cameras.main.width / 2,
      this.cameras.main.height - 80
    );
    this.npcDialogText.setPosition(
      this.cameras.main.width / 2,
      this.cameras.main.height - 80
    );

    this.time.delayedCall(3000, () => {
      this.destroyDialog();
    });
  }

  addNpcTrigger(x, y, message) {
    const npcZone = this.add.zone(x, y, 50, 50);
    this.add.rectangle(x, y, 50, 50, 0xff0000, 0.5).setOrigin(0);
    this.physics.world.enable(npcZone);
    npcZone.body.setAllowGravity(false);
    npcZone.body.moves = false;

    this.physics.add.overlap(this.player, npcZone, () => {
      if (!this.activeNpcZone) {
        this.activeNpcZone = npcZone;
        this.activeNpcMessage = message;

        if (!this.interactHint) {
          this.interactHint = this.add
            .text(this.player.x, this.player.y - 40, "Press SPACE to interact", {
              fontSize: "14px",
              fill: "#fff",
              backgroundColor: "#000",
              padding: { x: 5, y: 2 },
            })
            .setOrigin(0.5);
        }
      }
    });
  }

  destroyDialog() {
    // Clear both regular and NPC dialog elements
    this.dialogBg?.destroy();
    this.dialogShadow?.destroy();
    this.dialogText?.destroy();
    this.yesBtn?.destroy();
    this.noBtn?.destroy();
    
    this.npcDialogBg?.destroy();
    this.npcDialogShadow?.destroy();
    this.npcDialogText?.destroy();
  }

  // Generate random training spots in grass regions
  generateTrainingSpots() {
    // Clear existing training spots
    this.trainingSpots.forEach(spot => {
      if (spot.rectangle) {
        spot.rectangle.destroy();
      }
    });
    this.trainingSpots = [];

    // Generate new training spots
    this.grassRegions.forEach(region => {
      // Define how many spots to create (30% coverage)
      const area = region.width * region.height;
      const spotSize = 30; // Size of each training spot
      const spotArea = spotSize * spotSize;
      const totalSpots = Math.floor((area * 0.3) / spotArea);
      
      for (let i = 0; i < totalSpots; i++) {
        // Generate random position within the region
        const x = region.x + Math.floor(Math.random() * (region.width - spotSize));
        const y = region.y + Math.floor(Math.random() * (region.height - spotSize));
        
        // Create a green rectangle for debugging
        const rectangle = this.add.rectangle(x, y, spotSize, spotSize, 0x00ff00, 0.4)
          .setOrigin(0)
          .setStrokeStyle(1, 0x00ff00, 1);
          
        // Add pulsing effect for visibility
        this.tweens.add({
          targets: rectangle,
          alpha: { from: 0.2, to: 0.6 },
          duration: 1000,
          yoyo: true,
          repeat: -1,
        });
        
        // Add to training spots array
        this.trainingSpots.push({
          x,
          y,
          width: spotSize,
          height: spotSize,
          rectangle
        });
      }
    });
    
    console.log(`Generated ${this.trainingSpots.length} training spots`);
  }

  // Start a training challenge when player enters a training spot
  startTrainingChallenge() {
    if (this.inTrainingCooldown) return;
    
    // Set cooldown to prevent multiple triggers
    this.inTrainingCooldown = true;
    
    // Pause player movement
    const currentVelocity = { x: this.player.body.velocity.x, y: this.player.body.velocity.y };
    this.player.setVelocity(0, 0);
    
    // Show question dialog
    this.showQuestionDialog();
    
    // Set cooldown timer (prevent multiple triggers in succession)
    this.time.delayedCall(5000, () => {
      this.inTrainingCooldown = false;
    });
  }
  
  showQuestionDialog() {
    // Clear any existing dialogs
    this.destroyDialog();
    
    // Get a random question
    const question = this.getRandomQuestion();
    
    const sceneWidth = this.cameras.main.width;
    const sceneHeight = this.cameras.main.height;
    
    // Create dialog background
    this.dialogShadow = this.add
      .rectangle(
        sceneWidth / 2 + 5,
        sceneHeight / 2 + 5,
        500,
        300,
        0x000000,
        0.5
      )
      .setOrigin(0.5)
      .setScrollFactor(0);
      
    this.dialogBg = this.add
      .rectangle(
        sceneWidth / 2,
        sceneHeight / 2,
        500,
        300,
        0xffffff,
        0.9
      )
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setStrokeStyle(2, 0x000000, 1);
      
    // Add question text
    this.dialogText = this.add
      .text(
        sceneWidth / 2,
        sceneHeight / 2 - 60,
        `TRAINING CHALLENGE:\n\n${question.text}`,
        {
          fontSize: "24px",
          fontFamily: "Arial",
          color: "#000000",
          align: "center",
          wordWrap: { width: 450 }
        }
      )
      .setOrigin(0.5)
      .setScrollFactor(0);
      
    // Add answer buttons
    this.yesBtn = this.add
      .text(
        sceneWidth / 2 - 100,
        sceneHeight / 2 + 80,
        question.options[0],
        {
          fontSize: "20px",
          fontFamily: "Arial",
          color: "#ffffff",
          backgroundColor: "#2196f3",
          padding: {
            left: 20,
            right: 20,
            top: 10,
            bottom: 10
          }
        }
      )
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setInteractive({ useHandCursor: true });
      
    this.noBtn = this.add
      .text(
        sceneWidth / 2 + 100,
        sceneHeight / 2 + 80,
        question.options[1],
        {
          fontSize: "20px",
          fontFamily: "Arial",
          color: "#ffffff",
          backgroundColor: "#2196f3",
          padding: {
            left: 20,
            right: 20,
            top: 10,
            bottom: 10
          }
        }
      )
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setInteractive({ useHandCursor: true });
      
    // Add button event listeners
    this.yesBtn.on("pointerup", () => {
      if (question.answer === 0) {
        this.handleCorrectAnswer();
      } else {
        this.handleWrongAnswer();
      }
    });
    
    this.noBtn.on("pointerup", () => {
      if (question.answer === 1) {
        this.handleCorrectAnswer();
      } else {
        this.handleWrongAnswer();
      }
    });
  }
  
  handleCorrectAnswer() {
    this.destroyDialog();
    
    // Show success message
    this.showNpcDialog("Correct answer! You gained 10 XP.");
    
    // Here you would add XP to the player or trigger other rewards
    // For example: this.player.addXP(10);
  }
  
  handleWrongAnswer() {
    this.destroyDialog();
    
    // Show failure message
    this.showNpcDialog("That's not correct. Try again next time!");
  }
  
  getRandomQuestion() {
    // Sample questions - you can expand this list
    const questions = [
      {
        text: "Is Phaser a JavaScript game framework?",
        options: ["Yes", "No"],
        answer: 0
      },
      {
        text: "Does HTML5 support canvas element?",
        options: ["Yes", "No"],
        answer: 0
      },
      {
        text: "Is 2 + 2 = 5?",
        options: ["Yes", "No"],
        answer: 1
      },
      {
        text: "Is JavaScript a compiled language?",
        options: ["Yes", "No"],
        answer: 1
      },
      {
        text: "Can Phaser create 3D games?",
        options: ["Yes", "No"],
        answer: 1
      }
    ];
    
    return questions[Math.floor(Math.random() * questions.length)];
  }
}



  

  
