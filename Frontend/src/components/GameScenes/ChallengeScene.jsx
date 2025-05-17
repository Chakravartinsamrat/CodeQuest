// import NavigationController from "../Routes/NavigationController";

// export default class ChallengeScene extends Phaser.Scene {
//   constructor() {
//     super("ChallengeScene");
//   }

//   preload() {
//     this.load.image("Challenge", "/Training-Arena.webp");
//     this.load.image("player", "/BOSS.png");
//   }

//   create(data) {
//     const bg = this.add.image(0, 0, "Challenge").setOrigin(0);
//     bg.setDisplaySize(1600, 1200);

//     this.physics.world.setBounds(0, 0, 1600, 1200);
//     this.cameras.main.setBounds(0, 0, 1600, 1200);

//     // Add player
//     this.player = this.physics.add.sprite(850, 1103, "player").setScale(0.02);
//     this.player.setCollideWorldBounds(true);

//     this.cameras.main.startFollow(this.player);
//     this.cursors = this.input.keyboard.createCursorKeys();
//     this.speed = 300;

//     this.debugText = this.add
//       .text(10, 10, "Use arrow keys to move", {
//         fontSize: "16px",
//         fill: "#ffffff",
//         backgroundColor: "#000000",
//       })
//       .setScrollFactor(0);

//     this.glowArea = this.add
//       .rectangle(425, 1053, 20, 20, 0x00ff00, 0.4)
//       .setOrigin(0)
//       .setStrokeStyle(2, 0x00ff00, 1);
//     this.tweens.add({
//       targets: this.glowArea,
//       alpha: { from: 0.2, to: 0.8 },
//       duration: 800,
//       yoyo: true,
//       repeat: -1,
//     });

//     this.player.setInteractive();
//     this.spacebar = this.input.keyboard.addKey(
//       Phaser.Input.Keyboard.KeyCodes.SPACE
//     );

//     this.glowAreaBack = this.add
//     .rectangle(775, 1158, 150, 10, 0x00ff00, 0.4)
//     .setOrigin(0)
//     .setStrokeStyle(2, 0x00ff00, 1);

//   this.tweens.add({
//     targets: this.glowAreaBack,
//     alpha: { from: 0.2, to: 0.8 },
//     duration: 800,
//     yoyo: true,
//     repeat: -1,
//   });

//     this.player.setInteractive();
//     this.spacebar = this.input.keyboard.addKey(
//       Phaser.Input.Keyboard.KeyCodes.SPACE
//     );
//     this.navController = new NavigationController(this);
//   }

//   update() {
//     this.debugText.setText(
//       `Player pos: ${Math.round(this.player.x)}, ${Math.round(this.player.y)}`
//     );

//     this.player.setVelocity(0);

//     if (this.cursors.left.isDown) {
//       this.player.setVelocityX(-this.speed);
//     } else if (this.cursors.right.isDown) {
//       this.player.setVelocityX(this.speed);
//     }

//     if (this.cursors.up.isDown) {
//       this.player.setVelocityY(-this.speed);
//     } else if (this.cursors.down.isDown) {
//       this.player.setVelocityY(this.speed);
//     }

//     // Check for spacebar press and overlap with glowArea
//     if (
//       Phaser.Input.Keyboard.JustDown(this.spacebar) &&
//       Phaser.Geom.Rectangle.Overlaps(
//         this.glowArea.getBounds(),
//         this.player.getBounds()
//       )
//     ) {
//       this.showChallengeDialog();
//     }

//     if (
//   this.player.x >= 775 &&
//   this.player.x <= 925 && // 775 + 150 (rectangle width)
//   this.player.y >= 1158 &&
//   this.player.y <= 1168 // 1158 + 10 (rectangle height)
// ) {
//     console.log("Workign")
//   this.scene.start("MainScene"); // No player position data passed
// }
//   }

//   showChallengeDialog() {
//     // Get scene dimensions
//     const sceneWidth = this.cameras.main.width - 40;
//     const sceneHeight = this.cameras.main.height - 10; // Position 10px from bottom

//     // Create dialog background (white rectangle near bottom)
//     this.dialogBg = this.add
//       .rectangle(sceneWidth / 2 + 10, sceneHeight + 75, sceneWidth, 150, 0xffffff, 1)
//       .setOrigin(0.5)
//       .setScrollFactor(0)
//       .setStrokeStyle(2, 0x000000, 1); // Black border

//     // Add shadow for floating effect
//     this.dialogShadow = this.add
//       .rectangle(sceneWidth / 2 + 15, sceneHeight + 80, sceneWidth, 150, 0x000000, 0.3)
//       .setOrigin(0.5)
//       .setScrollFactor(0);

//     // Move dialog and shadow to final position with animation
//     this.tweens.add({
//       targets: [this.dialogBg, this.dialogShadow],
//       y: sceneHeight - 75, // Adjusted to be 10px from bottom
//       duration: 300,
//       ease: "Power2",
//     });

//     // Add dialog text (black, centered)
//     this.dialogText = this.add
//       .text(sceneWidth / 2 + 10, sceneHeight - 125, "Do you want to challenge me?", {
//         fontSize: "24px",
//         fontFamily: "Arial, sans-serif",
//         color: "#000000",
//         align: "center",
//         wordWrap: { width: sceneWidth - 200 }, // Adjust for padding
//       })
//       .setOrigin(0.5)
//       .setScrollFactor(0)
//       .setAlpha(0);

//     // Animate text fade-in
//     this.tweens.add({
//       targets: this.dialogText,
//       alpha: 1,
//       duration: 300,
//       delay: 200,
//     });

//     // Add Yes button (green)
//     this.yesBtn = this.add
//       .text(sceneWidth / 2 - 100, sceneHeight - 45, "Yes", {
//         fontSize: "20px",
//         fontFamily: "Arial, sans-serif",
//         backgroundColor: "#28a745",
//         color: "#ffffff",
//         padding: { x: 20, y: 10 },
//         align: "center",
//         shadow: { offsetX: 2, offsetY: 2, color: "#000000", blur: 4, fill: true },
//       })
//       .setOrigin(0.5)
//       .setScrollFactor(0)
//       .setInteractive({ useHandCursor: true })
//       .setAlpha(0)
//       .on("pointerdown", () => {
//         this.destroyDialog();
//         this.scene.start("ContentScene", {
//             challengeAccepted: true,
//             playerPos: { x: this.player.x, y: this.player.y }
//         });
//       })
//       .on("pointerover", () => this.yesBtn.setStyle({ backgroundColor: "#218838" }))
//       .on("pointerout", () => this.yesBtn.setStyle({ backgroundColor: "#28a745" }));

//     // Add No button (red)
//     this.noBtn = this.add
//       .text(sceneWidth / 2 + 100, sceneHeight - 45, "No", {
//         fontSize: "20px",
//         fontFamily: "Arial, sans-serif",
//         backgroundColor: "#dc3545",
//         color: "#ffffff",
//         padding: { x: 20, y: 10 },
//         align: "center",
//         shadow: { offsetX: 2, offsetY: 2, color: "#000000", blur: 4, fill: true },
//       })
//       .setOrigin(0.5)
//       .setScrollFactor(0)
//       .setInteractive({ useHandCursor: true })
//       .setAlpha(0)
//       .on("pointerdown", () => {
//         this.destroyDialog();
//       })
//       .on("pointerover", () => this.noBtn.setStyle({ backgroundColor: "#c82333" }))
//       .on("pointerout", () => this.noBtn.setStyle({ backgroundColor: "#dc3545" }));

//     // Animate buttons fade-in
//     this.tweens.add({
//       targets: [this.yesBtn, this.noBtn],
//       alpha: 1,
//       duration: 300,
//       delay: 300,
//     });
//   }

//   destroyDialog() {
//     // Safely destroy dialog elements if they exist
//     if (this.dialogBg) this.dialogBg.destroy();
//     if (this.dialogShadow) this.dialogShadow.destroy();
//     if (this.dialogText) this.dialogText.destroy();
//     if (this.yesBtn) this.yesBtn.destroy();
//     if (this.noBtn) this.noBtn.destroy();
//   }
// }
import NavigationController from "../Routes/NavigationController";

export default class ChallengeScene extends Phaser.Scene {
  constructor() {
    super("ChallengeScene");
  }

  preload() {
    this.load.image("Challenge", "/Training-Arena.webp");
    this.load.image("player", "/BOSS.png");
  }

  create(data) {
    const bg = this.add.image(0, 0, "Challenge").setOrigin(0);
    bg.setDisplaySize(1600, 1200);

    this.physics.world.setBounds(0, 0, 1600, 1200);
    this.cameras.main.setBounds(0, 0, 1600, 1200);

    // Add player
    this.player = this.physics.add.sprite(850, 1103, "player").setScale(0.02);
    this.player.setCollideWorldBounds(true);

    // If returning from challenge, restore player position
    if (data && data.playerPos) {
      this.player.x = data.playerPos.x;
      this.player.y = data.playerPos.y;
    }

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
  }

  update() {
    this.debugText.setText(
      `Player pos: ${Math.round(this.player.x)}, ${Math.round(this.player.y)}`
    );

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

    // Check for spacebar press and overlap with glowArea
    if (
      Phaser.Input.Keyboard.JustDown(this.spacebar) &&
      Phaser.Geom.Rectangle.Overlaps(
        this.glowArea.getBounds(),
        this.player.getBounds()
      )
    ) {
      this.showChallengeDialog();
    }

    if (
      this.player.x >= 775 &&
      this.player.x <= 925 &&
      this.player.y >= 1158 &&
      this.player.y <= 1168
    ) {
      this.scene.start("MainScene");
    }
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
}