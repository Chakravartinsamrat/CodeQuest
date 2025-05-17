import React, { useEffect, useRef } from "react";
import Phaser from "phaser";

// Game assets
const ASSETS = {
  DINO: "/api/placeholder/50/50",
  OBSTACLE: "/api/placeholder/30/30",
  GROUND: "/api/placeholder/800/24",
};

// Game scene class
export default class DinoScene extends Phaser.Scene {
  constructor() {
    super("DinoScene");
    this.player = null;
    this.obstacles = null;
    this.ground = null;
    this.isGameOver = false;
    this.score = 0;
    this.scoreText = null;
    this.jumpSound = null;
    this.gameOverSound = null;
    this.scoreSound = null;
    this.spaceKey = null;
    this.restartKey = null;
    this.obstacleTimer = null;
    this.lastObstacleTime = 0;
    this.obstacleInterval = 1500;
    this.gameSpeed = 300;
  }

  preload() {
    this.load.image("dino", ASSETS.DINO);
    this.load.image("obstacle", ASSETS.OBSTACLE);
    this.load.image("ground", ASSETS.GROUND);
  }

  create() {
    // Create ground
    this.ground = this.physics.add.staticGroup();
    this.ground.create(400, 450, "ground").setScale(1).refreshBody();

    // Create player (dino)
    this.player = this.physics.add.sprite(100, 380, "dino");
    this.player.setBounce(0);
    this.player.setCollideWorldBounds(true);

    // Create obstacles group
    this.obstacles = this.physics.add.group();

    // Colliders
    this.physics.add.collider(this.player, this.ground);
    this.physics.add.collider(this.obstacles, this.ground);

    // Collision between player and obstacles
    this.physics.add.overlap(
      this.player,
      this.obstacles,
      this.gameOver,
      null,
      this
    );

    this.navController = new NavigationController(this);

    // Input events
    this.spaceKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    this.restartKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.R
    );

    // Score
    this.scoreText = this.add.text(16, 16, "Score: 0", {
      fontSize: "24px",
      fill: "#000",
    });

    // Start spawning obstacles
    this.obstacleTimer = this.time.addEvent({
      delay: this.obstacleInterval,
      callback: this.spawnObstacle,
      callbackScope: this,
      loop: true,
    });
  }

  update() {
    if (this.isGameOver) {
      if (this.restartKey.isDown) {
        this.scene.restart();
        this.isGameOver = false;
        this.score = 0;
        this.gameSpeed = 300;
      }
      return;
    }

    // Jump logic
    if (this.spaceKey.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-500);
    }

    // Update score
    this.score += 1;
    this.scoreText.setText("Score: " + Math.floor(this.score / 10));

    // Increase game speed over time
    if (this.score % 500 === 0) {
      this.gameSpeed += 25;
      this.obstacleInterval = Math.max(500, this.obstacleInterval - 100);
      if (this.obstacleTimer) {
        this.obstacleTimer.delay = this.obstacleInterval;
      }
    }

    // Move obstacles
    this.obstacles.children.iterate((obstacle) => {
      if (obstacle) {
        obstacle.setVelocityX(-this.gameSpeed);

        // Remove obstacles that are off-screen
        if (obstacle.x < -50) {
          obstacle.destroy();
        }
      }
    });
  }

  spawnObstacle() {
    if (this.isGameOver) return;

    // Create a new obstacle at the right edge of the screen
    const obstacle = this.obstacles.create(800, 410, "obstacle");
    obstacle.setOrigin(0, 1);
    obstacle.setVelocityX(-this.gameSpeed);
    obstacle.setImmovable(true);

    // Random scale for variety
    const scale = Phaser.Math.FloatBetween(0.8, 1.2);
    obstacle.setScale(scale);
  }

  gameOver() {
    this.isGameOver = true;
    this.physics.pause();

    this.player.setTint(0xff0000);

    // Game over text
    this.add
      .text(400, 300, "GAME OVER", {
        fontSize: "48px",
        fill: "#000",
        align: "center",
      })
      .setOrigin(0.5);

    this.add
      .text(400, 350, "Press R to restart", {
        fontSize: "24px",
        fill: "#000",
        align: "center",
      })
      .setOrigin(0.5);

    if (this.obstacleTimer) {
      this.obstacleTimer.remove();
    }
  }
}

// React component that integrates with Phaser
const DinoGame = ({ width = 800, height = 500, ...props }) => {
  const gameRef = useRef(null);
  const phaserGameRef = useRef(null);

  useEffect(() => {
    // Configuration for Phaser game
    const config = {
      type: Phaser.AUTO,
      width,
      height,
      parent: gameRef.current,
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 800 },
          debug: false,
        },
      },
      scene: [DinoScene],
    };

    // Create new Phaser game instance
    phaserGameRef.current = new Phaser.Game(config);

    // Cleanup
    return () => {
      if (phaserGameRef.current) {
        phaserGameRef.current.destroy(true);
      }
    };
  }, [width, height]);

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 text-2xl font-bold">Chrome Dino Game</div>
      <div
        className="border-4 border-gray-800 rounded-lg overflow-hidden"
        ref={gameRef}
      />
      <div className="mt-4 text-lg">
        Press SPACE to jump, R to restart after game over
      </div>
    </div>
  );
};
