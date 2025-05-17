import NavigationController from "../Routes/NavigationController";
import PlayerController from "../utils/PlayerController";
export default class GymScene extends Phaser.Scene {
  constructor() {
    super("GymScene");
  }

  init(data){
    if (data && data.gameId) {
      this.gameId = data.gameId;
      console.log('GymScene: Using gameId from scene data:', this.gameId);
    } else if (this.game && this.game.gameId) {
      this.gameId = this.game.gameId;
      console.log('GymScene: Using gameId from game instance:', this.gameId);
    } else if (window.gameId) {
      this.gameId = window.gameId;
      console.log('GymScene: Using gameId from window object:', this.gameId);
    } else {
      console.log('GymScene: Gameid not found');
    }
  }

  preload() {
    this.load.image("Gym-Arena.webp", "/Gym-Arena.webp");
    this.load.image("player", "/BOSS.png");
    this.load.image("npc", "/NPC.png"); // Add NPC sprite
    this.load.spritesheet(
      "character",
      "/PlayerMovement.png",
      {
        frameWidth: 16, 
        frameHeight: 24, 
      }
    );
  }

  create() {
    const bg = this.add.image(0, 0, "Gym-Arena.webp").setOrigin(0);
    bg.setDisplaySize(1600, 1200);

    this.physics.world.setBounds(0, 0, 1600, 1200);
    this.cameras.main.setBounds(0, 0, 1600, 1200);

    // Add player
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

    this.debugText = this.add
      .text(10, 10, "Use arrow keys to move", {
        fontSize: "16px",
        fill: "#ffffff",
        backgroundColor: "#000000",
      })
      .setScrollFactor(0);

    // Original glowArea for GymInterface
    this.glowArea = this.add
      .rectangle(355, 145, 40, 40, 0x00ff00, 0.4)
      .setOrigin(0)
      .setStrokeStyle(2, 0x00ff00, 1);
    this.tweens.add({
      targets: this.glowArea,
      alpha: { from: 0.2, to: 0.8 },
      duration: 800,
      yoyo: true,
      repeat: -1,
    });
    
    // Setup NPCs with their interaction areas
    this.setupNPCs();

    // Add spacebar interaction
    this.player.setInteractive();
    this.spacebar = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    this.speed = 300;
    this.navController = new NavigationController(this);
  }

  setupNPCs() {
    // Create an array to store our NPCs and their interaction areas
    this.npcAreas = [];

    // Define NPC positions - placed in different corners of the gym
    const npcPositions = [
      { x: 775, y: 995, level: 1, topic: "basics", npcID: "NPC001", xpgained: "15" }, // Original grunt position
      { x: 1175, y: 815, level: 2, topic: "intermediate", npcID: "NPC002", xpgained: "20" },
      { x: 425, y: 825, level: 3, topic: "advanced", npcID: "NPC003", xpgained: "25" },
      { x: 680, y: 370, level: 4, topic: "expert", npcID: "NPC004", xpgained: "30" }
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
        const playerStatus = this.playerController.update();
      } else {
        this.updateOriginalPlayer();
      }

      // Update debug text
      this.debugText.setText(
        `Player pos: ${Math.round(this.player.x)}, ${Math.round(this.player.y)}`
      );

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
      // Check overlap with gym area
      if (Phaser.Geom.Rectangle.Overlaps(
        this.glowArea.getBounds(),
        this.player.getBounds()
      )) {
        this.showChallengeDialog("gym");
      }
      
      // Check overlaps with all NPC areas
      else {
        for (let i = 0; i < this.npcAreas.length; i++) {
          const npcData = this.npcAreas[i];
          if (Phaser.Geom.Rectangle.Overlaps(
            npcData.glowArea.getBounds(),
            this.player.getBounds()
          )) {
            this.showChallengeDialog("grunt", npcData.level, npcData.topic);
            break; // Exit loop once we've found an overlap
          }
        }
      }
    }
  }

  showChallengeDialog(type, level = 1, topic = null) {
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

    // Customize dialog text based on interface type
    let dialogMessage = type === "gym" 
      ? "Do you want to challenge the Gym Leader?" 
      : `Level ${level} Grunt: Do you want to fight me?`;

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
        if (type === "gym") {
          this.launchGymInterface();
        } else {
          this.launchGruntInterface(level, topic);
        }
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

  // Simplified direct interface launch methods without transitions
  launchGymInterface() {
    // Store player position for later use
    const playerPos = { x: this.player.x, y: this.player.y };
    this.game.registry.set("playerPos", playerPos);
    
    // Directly show the Gym interface
    if (window.showGymInterface) {
      window.showGymInterface({
        // Pass consistent height parameters for all quiz types
        quizHeights: {
          computerScience: 500, // Base height that all quizzes should match
          physics: 500,
          english: 500,
          math: 500
        }
      });
    } else {
      console.error("React Gym Interface not available");
    }
  }

  launchGruntInterface(level, topic) {
    // Store player position for later use
    const playerPos = { x: this.player.x, y: this.player.y };
    this.game.registry.set("playerPos", playerPos);
    
    // Directly show the Grunt interface
    if (window.showGruntInterface) {
      console.log("Starting grunt battle with level:", level);
      console.log("Topic:", topic || this.gameId);
      window.showGruntInterface({ 
        topic: window.gameId,
        level: level 
      });
    } else {
      console.error("React Grunt Interface not available");
    }
  }
}