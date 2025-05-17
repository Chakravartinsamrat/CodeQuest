import NavigationController from "../Routes/NavigationController";
import PlayerController from "../utils/PlayerController";
export default class GymScene extends Phaser.Scene {
  constructor() {
    super("GymScene");
  }

  preload() {
    this.load.image("Gym-Arena.webp", "/Gym-Arena.webp");
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
    const bg = this.add.image(0, 0, "Gym-Arena.webp").setOrigin(0);
    bg.setDisplaySize(1600, 1200);

    this.physics.world.setBounds(0, 0, 1600, 1200);
    this.cameras.main.setBounds(0, 0, 1600, 1200);

    // Add player
    // this.player = this.physics.add.sprite(745, 1169, "player").setScale(0.02);
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
      .rectangle(625, 1073, 20, 20, 0x00ff00, 0.4)
      .setOrigin(0)
      .setStrokeStyle(2, 0x00ff00, 1);
    this.tweens.add({
      targets: this.glowArea,
      alpha: { from: 0.2, to: 0.8 },
      duration: 800,
      yoyo: true,
      repeat: -1,
    });
    
    // New glowArea for GruntInterface at 940, 1060
    this.gruntGlowArea = this.add
      .rectangle(940, 1060, 40, 40, 0xff0000, 0.4)  // Increased size for better collision detection
      .setOrigin(0)
      .setStrokeStyle(2, 0xff0000, 1);
    this.tweens.add({
      targets: this.gruntGlowArea,
      alpha: { from: 0.2, to: 0.8 },
      duration: 800,
      yoyo: true,
      repeat: -1,
    });

    // this.showChallengeDialog()

    // Add spacebar interaction
    this.player.setInteractive();
    this.spacebar = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    this.speed = 300;
    this.navController = new NavigationController(this);
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
    // Update player position text
    this.debugText.setText(
      `Player pos: ${Math.round(this.player.x)}, ${Math.round(this.player.y)}`
    );

    // Check for spacebar press
    if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
      // Check overlap with gym area
      if (Phaser.Geom.Rectangle.Overlaps(
        this.glowArea.getBounds(),
        this.player.getBounds()
      )) {
        this.showChallengeDialog("gym");
      }
      
      // Check overlap with grunt area
      else if (Phaser.Geom.Rectangle.Overlaps(
        this.gruntGlowArea.getBounds(),
        this.player.getBounds()
      )) {
        this.showChallengeDialog("grunt");
      }
      
      // Debug overlap detection
      this.debugText.setText(
        `Player pos: ${Math.round(this.player.x)}, ${Math.round(this.player.y)}\n` +
        `Gym overlap: ${Phaser.Geom.Rectangle.Overlaps(this.glowArea.getBounds(), this.player.getBounds())}\n` +
        `Grunt overlap: ${Phaser.Geom.Rectangle.Overlaps(this.gruntGlowArea.getBounds(), this.player.getBounds())}`
      );
    } else {
      // Update player position text
      this.debugText.setText(
        `Player pos: ${Math.round(this.player.x)}, ${Math.round(this.player.y)}`
      );
    }
  }

  showChallengeDialog(type) {
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
    const dialogMessage = type === "gym" 
      ? "Do you want to challenge me?" 
      : "Do you want to fight me?";  // Changed text for grunt challenge

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
          this.startPokemonBattleTransition("gym");
        } else {
          this.startPokemonBattleTransition("grunt");
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

  startPokemonBattleTransition(interfaceType) {
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
          
          // Show the appropriate interface based on type
          if (interfaceType === "gym") {
            this.showGymInterface();
          } else {
            this.showGruntInterface();
          }
        });
      });
    });
  }

  showGymInterface() {
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
  
  showGruntInterface() {
    if (window.showGruntInterface) {
      window.showGruntInterface({
        // Pass any necessary parameters similar to gym interface
        quizHeights: {
          computerScience: 500,
          physics: 500,
          english: 500,
          math: 500
        }
      });
    } else {
      console.error("React Grunt Interface not available");
    }
  }
}
