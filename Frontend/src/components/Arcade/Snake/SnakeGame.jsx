import React, { useEffect, useRef } from "react";
import Phaser from "phaser";

// The main Snake game scene
export default class SnakeScene extends Phaser.Scene {
  constructor() {
    super("SnakeGame");
    this.snake = null;
    this.food = null;
    this.cursors = null;
    this.direction = "right";
    this.nextDirection = "right";
    this.gridSize = 16;
    this.speed = 100;
    this.moveTime = 0;
    this.score = 0;
    this.scoreText = null;
    this.gameOver = false;
  }

  preload() {
    // Create simple shapes for snake and food
    this.load.image("snake", "/api/placeholder/16/16");
    this.load.image("food", "/api/placeholder/16/16");
  }

  create() {
    // Create snake body as an array of game objects
    this.snake = [];
    // Starting position
    for (let i = 0; i < 3; i++) {
      const segment = this.add
        .image(160 - i * this.gridSize, 160, "snake")
        .setOrigin(0);

      segment.setTint(0x00ff00); // Green color for snake
      this.snake.push(segment);
    }

    // Create food with graphics instead of image for better visibility
    this.food = this.add.graphics();
    this.food.fillStyle(0xff0000, 1); // Red color with full alpha
    this.food.fillCircle(8, 8, 8); // Draw a circle with radius 8 at position 8,8
    this.food.generateTexture("foodTexture", 16, 16);
    this.food.clear();

    //navigate backwards
    this.navController = new NavigationController(this);

    // Use the generated texture for food
    this.food = this.add.image(320, 320, "foodTexture").setOrigin(0);
    this.placeFood();

    // Setup keyboard controls
    this.cursors = this.input.keyboard.createCursorKeys();

    // Add score text
    this.scoreText = this.add.text(16, 16, "Score: 0", {
      fontSize: "24px",
      fill: "#fff",
    });
  }

  update(time) {
    if (this.gameOver) return;

    // Handle keyboard input
    if (this.cursors.left.isDown && this.direction !== "right") {
      this.nextDirection = "left";
    } else if (this.cursors.right.isDown && this.direction !== "left") {
      this.nextDirection = "right";
    } else if (this.cursors.up.isDown && this.direction !== "down") {
      this.nextDirection = "up";
    } else if (this.cursors.down.isDown && this.direction !== "up") {
      this.nextDirection = "down";
    }

    // Move the snake at regular intervals
    if (time >= this.moveTime) {
      this.moveSnake();
      this.moveTime = time + this.speed;
    }
  }

  moveSnake() {
    // Update current direction
    this.direction = this.nextDirection;

    // Calculate the position for the new head
    let x = this.snake[0].x;
    let y = this.snake[0].y;

    switch (this.direction) {
      case "left":
        x -= this.gridSize;
        break;
      case "right":
        x += this.gridSize;
        break;
      case "up":
        y -= this.gridSize;
        break;
      case "down":
        y += this.gridSize;
        break;
    }

    // Check for collision with walls
    if (
      x < 0 ||
      x >= this.game.config.width ||
      y < 0 ||
      y >= this.game.config.height
    ) {
      this.gameOver = true;
      this.add
        .text(
          this.game.config.width / 2,
          this.game.config.height / 2,
          "GAME OVER",
          { fontSize: "32px", fill: "#fff" }
        )
        .setOrigin(0.5);
      return;
    }

    // Check for collision with own tail
    for (let i = 1; i < this.snake.length; i++) {
      if (x === this.snake[i].x && y === this.snake[i].y) {
        this.gameOver = true;
        this.add
          .text(
            this.game.config.width / 2,
            this.game.config.height / 2,
            "GAME OVER",
            { fontSize: "32px", fill: "#fff" }
          )
          .setOrigin(0.5);
        return;
      }
    }

    // Move the tail
    const tail = this.snake.pop();
    tail.x = x;
    tail.y = y;
    this.snake.unshift(tail);

    // Check if the snake has eaten food
    if (x === this.food.x && y === this.food.y) {
      this.eatFood();
    }
  }

  eatFood() {
    // Add a new segment to the snake
    const newSegment = this.add.image(0, 0, "snake").setOrigin(0);
    newSegment.setTint(0x00ff00); // Green color for snake
    this.snake.push(newSegment);

    // Increase score
    this.score += 10;
    this.scoreText.setText("Score: " + this.score);

    // Place new food
    this.placeFood();

    // Increase speed slightly
    if (this.speed > 30) {
      this.speed -= 2;
    }
  }

  placeFood() {
    // Generate a random position for the food
    const gridWidth = Math.floor(this.game.config.width / this.gridSize);
    const gridHeight = Math.floor(this.game.config.height / this.gridSize);

    let x, y;
    let validPosition = false;

    // Keep generating positions until we find one that doesn't overlap with the snake
    while (!validPosition) {
      x = Math.floor(Math.random() * gridWidth) * this.gridSize;
      y = Math.floor(Math.random() * gridHeight) * this.gridSize;

      validPosition = true;

      // Check if position overlaps with any snake segment
      for (let i = 0; i < this.snake.length; i++) {
        if (x === this.snake[i].x && y === this.snake[i].y) {
          validPosition = false;
          break;
        }
      }
    }

    this.food.x = x;
    this.food.y = y;
  }

  restart() {
    // Reset game state
    this.snake.forEach((segment) => segment.destroy());
    this.snake = [];
    this.direction = "right";
    this.nextDirection = "right";
    this.score = 0;
    this.scoreText.setText("Score: 0");
    this.gameOver = false;
    this.speed = 100;

    // Create new snake
    for (let i = 0; i < 3; i++) {
      const segment = this.add
        .image(160 - i * this.gridSize, 160, "snake")
        .setOrigin(0);

      segment.setTint(0x00ff00);
      this.snake.push(segment);
    }

    // Reset food
    if (this.food) this.food.destroy();

    // Recreate food with graphics for better visibility
    this.food = this.add.graphics();
    this.food.fillStyle(0xff0000, 1); // Red color with full alpha
    this.food.fillCircle(8, 8, 8); // Draw a circle with radius 8 at position 8,8
    this.food.generateTexture("foodTexture", 16, 16);
    this.food.clear();

    // Use the generated texture for food
    this.food = this.add.image(320, 320, "foodTexture").setOrigin(0);
    this.placeFood();
  }
}

// React component that wraps the Phaser game
const SnakeGame = ({ width = 480, height = 480 }) => {
  const gameRef = useRef(null);
  const gameContainerRef = useRef(null);

  useEffect(() => {
    // Phaser game configuration
    const config = {
      type: Phaser.AUTO,
      width,
      height,
      parent: gameContainerRef.current,
      backgroundColor: "#333333",
      physics: {
        default: "arcade",
        arcade: {
          debug: false,
        },
      },
      scene: [SnakeScene],
    };

    // Initialize the game
    gameRef.current = new Phaser.Game(config);

    // Cleanup function to destroy the game when component unmounts
    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [width, height]);

  const handleRestart = () => {
    const scene = gameRef.current.scene.getScene("SnakeGame");
    if (scene) {
      scene.restart();
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div
        ref={gameContainerRef}
        className="border-4 border-gray-700 rounded-lg"
      />
      <button
        onClick={handleRestart}
        className="mt-4 px-4 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700"
      >
        Restart Game
      </button>
      <div className="mt-4 text-lg">Use arrow keys to control the snake.</div>
    </div>
  );
};
