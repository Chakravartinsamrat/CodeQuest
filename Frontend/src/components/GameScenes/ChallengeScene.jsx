import NavigationController from "../Routes/NavigationController";
import PlayerController from "../utils/PlayerController";
export default class ChallengeScene extends Phaser.Scene {
  constructor() {
    super("ChallengeScene");
  }

  init(data){
    if (data && data.gameId) {
      this.gameId = data.gameId;
      console.log('ChallengeScene: Using gameId from scene data:', this.gameId);
    } else if (this.game && this.game.gameId) {
      this.gameId = this.game.gameId;
      console.log('ChallengeScene: Using gameId from game instance:', this.gameId);
    } else if (window.gameId) {
      this.gameId = window.gameId;
      console.log('ChallengeScene: Using gameId from window object:', this.gameId);
    } else {
      console.log('ChallengeScene: Gameid not found');
    }
  }

  preload() {
    this.load.image("Challenge", "/Training-Arena.webp");
    this.load.image("player", "/BOSS.png");
    this.load.image("npc", "/NPC.png"); // Add NPC sprite loading
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


    // Add player
    // this.player = this.physics.add.sprite(850, 1103, "player").setScale(0.02);
    try {
      this.playerController = new PlayerController(
        this,
        "character",
        850,
        1100,
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
          this.physics.add.collider(this.player, this.obstacles);


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

    this.setupNPCs()
  }

  setupNPCs() {
    // Create an array to store our NPCs and their interaction areas
    this.npcAreas = [];

    // Define NPC positions - placed in different corners of the gym
    const npcPositions = [
      { x: 630, y: 640, level: 1, topic: "basics" }, // Original grunt position
      { x: 830, y: 805, level: 2, topic: "intermediate" },
      { x: 1075, y: 860, level: 3, topic: "advanced" },
      { x: 1075, y: 680, level: 4, topic: "expert" },
      { x: 1075, y: 430, level: 5, topic: "expert" },
      { x: 1075, y: 165, level: 2, topic: "intermediate" },
      { x: 835, y: 70, level: 5, topic: "expert" },
      { x: 625, y: 135, level: 1, topic: "expert" },
      { x: 625, y: 405, level: 2, topic: "intermediate" },
      // { x: 625, y: 660, level: 4, topic: "expert" },
    ];

    // Create NPCs and their interaction areas
    npcPositions.forEach((pos, index) => {
      // Create NPC sprite
      const npc = this.physics.add.sprite(pos.x, pos.y, "npc")
        .setScale(0.03)
        .setImmovable(true);
      
      // Create colored glow area for interaction
      // Use different colors for different NPCs
      const colors = [0xff0000, 0x0000ff, 0xffff00, 0xff00ff];
      const glowArea = this.add
        .rectangle(pos.x - 20, pos.y - 20, 40, 40, colors[index], 0.4)
        .setOrigin(0)
        .setStrokeStyle(2, colors[index], 1);
      
      // Add glow animation
      this.tweens.add({
        targets: glowArea,
        alpha: { from: 0.2, to: 0.8 },
        duration: 800,
        yoyo: true,
        repeat: -1,
      });

      // Add level text above NPC
      const levelText = this.add
        .text(pos.x, pos.y - 30, `Level ${pos.level}`, {
          fontSize: "14px",
          fill: "#ffffff",
          backgroundColor: "#000000",
          padding: { x: 3, y: 2 }
        })
        .setOrigin(0.5);

      // Store NPC data for interaction checking
      this.npcAreas.push({
        npc,
        glowArea,
        levelText,
        level: pos.level,
        topic: pos.topic || this.gameId // Use provided topic or fall back to gameId
      });
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

    // Check for spacebar press
    if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
      // Check overlap with training area
      if (Phaser.Geom.Rectangle.Overlaps(
        this.glowArea.getBounds(),
        this.player.getBounds()
      )) {
        this.showChallengeDialog();
      }
      
      // Check overlaps with all NPC areas
      else {
        for (let i = 0; i < this.npcAreas.length; i++) {
          const npcData = this.npcAreas[i];
          if (Phaser.Geom.Rectangle.Overlaps(
            npcData.glowArea.getBounds(),
            this.player.getBounds()
          )) {
            // Call showChallengeDialog with NPC's level and topic
            this.showChallengeDialog(npcData.level, npcData.topic);
            break; // Exit loop once we've found an overlap
          }
        }
      }
    }

    // Check for overlap with the exit area
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

  showNPCChallengeDialog(type, level = 1, topic = null) {
    // Get scene dimensions
    const sceneWidth = this.cameras.main.width - 40;
    const sceneHeight = this.cameras.main.height - 10; // Position 10px from bottom

    // Create dialog background (white rectangle near bottom)
    this.dialogBg = this.add
      .rectangle(
        sceneWidth / 2 + 10,
        sceneHeight + 75,
        sceneWidth,
        150,
        0xffffff,
        1
      )
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setStrokeStyle(2, 0x000000, 1); // Black border

    // Add shadow for floating effect
    this.dialogShadow = this.add
      .rectangle(
        sceneWidth / 2 + 15,
        sceneHeight + 80,
        sceneWidth,
        150,
        0x000000,
        0.3
      )
      .setOrigin(0.5)
      .setScrollFactor(0);

    // Move dialog and shadow to final position with animation
    this.tweens.add({
      targets: [this.dialogBg, this.dialogShadow],
      y: sceneHeight - 75, // Adjusted to be 10px from bottom
      duration: 300,
      ease: "Power2",
    });

    // Customize dialog text based on NPC level
    let dialogMessage = `Level ${level} Trainer: Ready for some training?`;

    // Add dialog text (black, centered)
    this.dialogText = this.add
      .text(sceneWidth / 2 + 10, sceneHeight - 125, dialogMessage, {
        fontSize: "24px",
        fontFamily: "Arial, sans-serif",
        color: "#000000",
        align: "center",
        wordWrap: { width: sceneWidth - 200 }, // Adjust for padding
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
        this.startTrainingBattleTransition("grunt", level, topic);
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

  startTrainingBattleTransition(interfaceType, level = 1, topic = null) {
    // Store player position for later use
    const playerPos = { x: this.player.x, y: this.player.y };
    this.game.registry.set("playerPos", playerPos);
    
    // Create a camera flash effect
    this.cameras.main.flash(300, 255, 255, 255);
    
    // Create horizontal line transition effects (Pokémon style)
    const lines = [];
    const lineCount = 10;
    const lineHeight = this.cameras.main.height / lineCount;
    
    for (let i = 0; i < lineCount; i++) {
      const isEvenLine = i % 2 === 0;
      const line = this.add.rectangle(
        this.cameras.main.centerX,
        i * lineHeight + lineHeight / 2,
        0, // Start with zero width
        lineHeight,
        0x000000,
        1
      ).setScrollFactor(0);
      
      lines.push(line);
      
      // Animate lines growing from center
      this.tweens.add({
        targets: line,
        width: this.cameras.main.width + 100,
        duration: 600,
        delay: i * 60,
        ease: 'Sine.easeInOut'
      });
    }
    
    // After all lines finish animating, show screen shake and fade to battle
    this.time.delayedCall(1100, () => {
      // Add screen shake
      this.cameras.main.shake(300, 0.005);
      
      // After shake, fade to white and launch battle interface
      this.time.delayedCall(350, () => {
        this.cameras.main.fade(400, 255, 255, 255);
        
        // When fade completes, clean up and launch appropriate interface
        this.time.delayedCall(450, () => {
          // Destroy transition effects
          lines.forEach(line => line.destroy());
          
          // Launch training battle interface with NPC
          console.log("Starting training battle with level:", level);
          console.log("Topic:", topic || this.gameId);
          
          if (window.showTrainerInterface) {
            window.showTrainerInterface({ 
              topic: topic || this.gameId,
              level: level 
            });
          } else {
            // Fall back to grunt interface if trainer interface is not available
            window.showGruntInterface({ 
              topic: topic || this.gameId,
              level: level 
            });
          }
        });
      });
    });
  }

  fallbackToOriginalPlayer() {
    // Implement the fallback player if the sprite sheet doesn't work
    this.player = this.physics.add.sprite(850, 1103, "player").setScale(0.02);
    this.player.setCollideWorldBounds(true);
  }

  updateOriginalPlayer() {
    // Update fallback player movement if needed
    // This is empty because player movement is already handled in the main update method
  }
}