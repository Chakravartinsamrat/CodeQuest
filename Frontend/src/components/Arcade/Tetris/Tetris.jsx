import React, { useEffect, useRef } from 'react';
import * as Phaser from 'phaser';

import NavigationController from '../../Routes/NavigationController';

// Define the Tetris piece shapes
const SHAPES = [
  [
    [1, 1, 1, 1]    // I piece
  ],
  [
    [1, 1, 1],      // J piece
    [0, 0, 1]
  ],
  [
    [1, 1, 1],      // L piece
    [1, 0, 0]
  ],
  [
    [1, 1],         // O piece
    [1, 1]
  ],
  [
    [0, 1, 1],      // S piece
    [1, 1, 0]
  ],
  [
    [1, 1, 1],      // T piece
    [0, 1, 0]
  ],
  [
    [1, 1, 0],      // Z piece
    [0, 1, 1]
  ]
];

// Colors for each piece type
const COLORS = [
  0x00ffff,  // Cyan (I)
  0x0000ff,  // Blue (J)
  0xff7f00,  // Orange (L)
  0xffff00,  // Yellow (O)
  0x00ff00,  // Green (S)
  0x800080,  // Purple (T)
  0xff0000   // Red (Z)
];

// Game constants
const BLOCK_SIZE = 30;
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const GAME_WIDTH = BLOCK_SIZE * BOARD_WIDTH;
const GAME_HEIGHT = BLOCK_SIZE * BOARD_HEIGHT;
const UI_WIDTH = 150; // Width for UI elements

// Tetris Scene Class
export default class TetrisScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TetrisScene' });
    
    // Game state
    this.board = Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(0));
    this.currentPiece = null;
    this.currentPieceType = 0;
    this.currentX = 0;
    this.currentY = 0;
    this.score = 0;
    this.level = 1;
    this.gameOver = false;
    this.dropSpeed = 1000; // Initial speed in ms
    this.dropTimer = null;
    this.isPaused = false;
    
    // Graphics objects
    this.boardGraphics = null;
    this.pieceGraphics = null;
    this.scoreText = null;
    this.levelText = null;
    this.gameOverText = null;
    this.pauseText = null;
    
    // Controls
    this.cursors = null;
    this.spaceKey = null;
    this.pKey = null;
    this.lastMoveTime = 0;
    this.moveDelay = 100; // Delay between moves in ms
  }

  create() {
    // Calculate centering position
    const centerX = (this.sys.game.config.width - (GAME_WIDTH + UI_WIDTH)) / 2;
    const centerY = (this.sys.game.config.height - GAME_HEIGHT) / 2;
    
    // Create a container for the game board
    this.gameContainer = this.add.container(centerX, centerY);
    
    // Initialize graphics objects
    this.boardGraphics = this.add.graphics();
    this.pieceGraphics = this.add.graphics();
    this.gameContainer.add(this.boardGraphics);
    this.gameContainer.add(this.pieceGraphics);
    
    // Initialize UI - position relative to centered game board
    this.scoreText = this.add.text(centerX + GAME_WIDTH + 20, centerY + 20, 'Score: 0', { fontSize: '18px', fill: '#fff' });
    this.levelText = this.add.text(centerX + GAME_WIDTH + 20, centerY + 50, 'Level: 1', { fontSize: '18px', fill: '#fff' });
    
    // Center game over text
    this.gameOverText = this.add.text(centerX + GAME_WIDTH / 2, centerY + GAME_HEIGHT / 2, 'GAME OVER\nPress SPACE to restart', { 
      fontSize: '24px', 
      fill: '#fff',
      align: 'center'
    }).setOrigin(0.5);
    this.gameOverText.visible = false;
    
    // Center pause text
    this.pauseText = this.add.text(centerX + GAME_WIDTH / 2, centerY + GAME_HEIGHT / 2, 'PAUSED\nPress P to continue', { 
      fontSize: '24px', 
      fill: '#fff',
      align: 'center'
    }).setOrigin(0.5);
    this.pauseText.visible = false;
    
    // Initialize controls
    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.pKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
    
    this.pKey.on('down', () => {
      this.togglePause();
    });
    
    this.spaceKey.on('down', () => {
      if (this.gameOver) {
        this.resetGame();
      } else if (!this.isPaused) {
        this.hardDrop();
      }
    });
    this.navController = new NavigationController(this);
    
    // Start the game
    this.resetGame();
  }
  
  resetGame() {
    // Clear the board
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      for (let x = 0; x < BOARD_WIDTH; x++) {
        this.board[y][x] = 0;
      }
    }
    
    this.score = 0;
    this.level = 1;
    this.dropSpeed = 1000;
    this.gameOver = false;
    this.gameOverText.visible = false;
    
    this.updateScoreDisplay();
    this.spawnPiece();
    
    // Clear any existing timer
    if (this.dropTimer) {
      this.time.removeEvent(this.dropTimer);
    }
    
    // Set up drop timer
    this.dropTimer = this.time.addEvent({
      delay: this.dropSpeed,
      callback: this.dropPiece,
      callbackScope: this,
      loop: true
    });
  }
  
  togglePause() {
    this.isPaused = !this.isPaused;
    this.pauseText.visible = this.isPaused;
    
    if (this.isPaused) {
      this.dropTimer.paused = true;
    } else {
      this.dropTimer.paused = false;
    }
  }
  
  spawnPiece() {
    // Select a random piece
    this.currentPieceType = Math.floor(Math.random() * SHAPES.length);
    this.currentPiece = SHAPES[this.currentPieceType];
    
    // Position the piece at the top center of the board
    this.currentX = Math.floor(BOARD_WIDTH / 2) - Math.floor(this.currentPiece[0].length / 2);
    this.currentY = 0;
    
    // Check if new piece can be placed
    if (!this.isValidMove(this.currentX, this.currentY, this.currentPiece)) {
      this.gameOver = true;
      this.gameOverText.visible = true;
      if (this.dropTimer) {
        this.time.removeEvent(this.dropTimer);
        this.dropTimer = null;
      }
    }
  }
  
  rotatePiece() {
    if (this.gameOver || this.isPaused) return;
    
    const rotated = [];
    const M = this.currentPiece.length;
    const N = this.currentPiece[0].length;
    
    // Create rotated matrix
    for (let y = 0; y < N; y++) {
      rotated[y] = [];
      for (let x = 0; x < M; x++) {
        rotated[y][x] = this.currentPiece[M - 1 - x][y];
      }
    }
    
    // Check if rotation is valid
    if (this.isValidMove(this.currentX, this.currentY, rotated)) {
      this.currentPiece = rotated;
    } else {
      // Try wall kicks (shifting left or right if rotation isn't valid)
      const kicks = [-1, 1, -2, 2];
      for (const kick of kicks) {
        if (this.isValidMove(this.currentX + kick, this.currentY, rotated)) {
          this.currentPiece = rotated;
          this.currentX += kick;
          break;
        }
      }
    }
  }
  
  isValidMove(x, y, piece) {
    for (let py = 0; py < piece.length; py++) {
      for (let px = 0; px < piece[py].length; px++) {
        if (piece[py][px]) {
          const boardX = x + px;
          const boardY = y + py;
          
          // Check if out of bounds
          if (boardX < 0 || boardX >= BOARD_WIDTH || boardY >= BOARD_HEIGHT) {
            return false;
          }
          
          // Check if overlaps with a fixed piece
          if (boardY >= 0 && this.board[boardY][boardX]) {
            return false;
          }
        }
      }
    }
    return true;
  }
  
  dropPiece() {
    if (this.gameOver || this.isPaused) return;
    
    // Try to move down
    if (this.isValidMove(this.currentX, this.currentY + 1, this.currentPiece)) {
      this.currentY++;
    } else {
      // Lock the piece in place
      this.lockPiece();
      // Clear completed lines
      this.clearLines();
      // Spawn a new piece
      this.spawnPiece();
    }
  }
  
  hardDrop() {
    if (this.gameOver || this.isPaused) return;
    
    let dropDistance = 0;
    while (this.isValidMove(this.currentX, this.currentY + dropDistance + 1, this.currentPiece)) {
      dropDistance++;
    }
    
    this.currentY += dropDistance;
    this.lockPiece();
    this.clearLines();
    this.spawnPiece();
    
    // Award points for hard drop
    this.score += dropDistance * 2;
    this.updateScoreDisplay();
  }
  
  lockPiece() {
    for (let y = 0; y < this.currentPiece.length; y++) {
      for (let x = 0; x < this.currentPiece[y].length; x++) {
        if (this.currentPiece[y][x]) {
          const boardY = this.currentY + y;
          const boardX = this.currentX + x;
          
          if (boardY >= 0) {  // Don't add blocks above the top
            this.board[boardY][boardX] = this.currentPieceType + 1;  // +1 to avoid 0 (empty)
          }
        }
      }
    }
  }
  
  clearLines() {
    let linesCleared = 0;
    
    for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
      let isLineFull = true;
      
      for (let x = 0; x < BOARD_WIDTH; x++) {
        if (!this.board[y][x]) {
          isLineFull = false;
          break;
        }
      }
      
      if (isLineFull) {
        linesCleared++;
        
        // Move all lines above down
        for (let moveY = y; moveY > 0; moveY--) {
          for (let x = 0; x < BOARD_WIDTH; x++) {
            this.board[moveY][x] = this.board[moveY - 1][x];
          }
        }
        
        // Clear the top line
        for (let x = 0; x < BOARD_WIDTH; x++) {
          this.board[0][x] = 0;
        }
        
        // Check this row again since we moved everything down
        y++;
      }
    }
    
    // Score calculation based on lines cleared (original NES scoring)
    if (linesCleared > 0) {
      const points = [0, 40, 100, 300, 1200];
      this.score += points[linesCleared] * this.level;
      
      // Level up every 10 lines
      const totalLinesCleared = Math.floor(this.score / 1000); // Simplified for demo
      const newLevel = Math.min(10, Math.floor(totalLinesCleared / 10) + 1);
      
      if (newLevel > this.level) {
        this.level = newLevel;
        this.dropSpeed = Math.max(100, 1000 - (this.level - 1) * 100);
        
        // Update the drop timer
        if (this.dropTimer) {
          this.time.removeEvent(this.dropTimer);
        }
        
        this.dropTimer = this.time.addEvent({
          delay: this.dropSpeed,
          callback: this.dropPiece,
          callbackScope: this,
          loop: true
        });
      }
      
      this.updateScoreDisplay();
    }
  }
  
  updateScoreDisplay() {
    this.scoreText.setText(`Score: ${this.score}`);
    this.levelText.setText(`Level: ${this.level}`);
  }
  
  update(time) {
    if (this.gameOver || this.isPaused) return;
    
    // Handle input with delay to prevent too rapid movement
    const canMove = time - this.lastMoveTime > this.moveDelay;
    
    if (canMove) {
      if (this.cursors.left.isDown) {
        if (this.isValidMove(this.currentX - 1, this.currentY, this.currentPiece)) {
          this.currentX--;
          this.lastMoveTime = time;
        }
      } else if (this.cursors.right.isDown) {
        if (this.isValidMove(this.currentX + 1, this.currentY, this.currentPiece)) {
          this.currentX++;
          this.lastMoveTime = time;
        }
      }
      
      if (this.cursors.down.isDown) {
        if (this.isValidMove(this.currentX, this.currentY + 1, this.currentPiece)) {
          this.currentY++;
          this.lastMoveTime = time;
          this.score += 1; // Small bonus for manual soft drop
          this.updateScoreDisplay();
        }
      }
      
      if (this.cursors.up.isDown) {
        this.rotatePiece();
        this.lastMoveTime = time;
      }
    }
    
    // Draw the game state
    this.drawGame();
  }
  
  drawGame() {
    // Clear previous drawings
    this.boardGraphics.clear();
    this.pieceGraphics.clear();
    
    // Draw the board grid and fixed blocks
    this.boardGraphics.lineStyle(1, 0x333333, 0.8);
    
    // Vertical grid lines
    for (let x = 0; x <= BOARD_WIDTH; x++) {
      this.boardGraphics.beginPath();
      this.boardGraphics.moveTo(x * BLOCK_SIZE, 0);
      this.boardGraphics.lineTo(x * BLOCK_SIZE, BOARD_HEIGHT * BLOCK_SIZE);
      this.boardGraphics.closePath();
      this.boardGraphics.strokePath();
    }
    
    // Horizontal grid lines
    for (let y = 0; y <= BOARD_HEIGHT; y++) {
      this.boardGraphics.beginPath();
      this.boardGraphics.moveTo(0, y * BLOCK_SIZE);
      this.boardGraphics.lineTo(BOARD_WIDTH * BLOCK_SIZE, y * BLOCK_SIZE);
      this.boardGraphics.closePath();
      this.boardGraphics.strokePath();
    }
    
    // Draw fixed blocks
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      for (let x = 0; x < BOARD_WIDTH; x++) {
        if (this.board[y][x]) {
          const colorIndex = this.board[y][x] - 1;
          this.drawBlock(this.boardGraphics, x, y, COLORS[colorIndex]);
        }
      }
    }
    
    // Draw current piece
    if (this.currentPiece) {
      for (let y = 0; y < this.currentPiece.length; y++) {
        for (let x = 0; x < this.currentPiece[y].length; x++) {
          if (this.currentPiece[y][x]) {
            const boardX = this.currentX + x;
            const boardY = this.currentY + y;
            
            if (boardY >= 0) { // Only draw if on screen
              this.drawBlock(this.pieceGraphics, boardX, boardY, COLORS[this.currentPieceType]);
            }
          }
        }
      }
      
      // Draw ghost piece (shadow of where piece will land)
      let ghostY = this.currentY;
      while (this.isValidMove(this.currentX, ghostY + 1, this.currentPiece)) {
        ghostY++;
      }
      
      if (ghostY !== this.currentY) {
        this.pieceGraphics.lineStyle(2, COLORS[this.currentPieceType], 0.5);
        for (let y = 0; y < this.currentPiece.length; y++) {
          for (let x = 0; x < this.currentPiece[y].length; x++) {
            if (this.currentPiece[y][x]) {
              const boardX = this.currentX + x;
              const boardY = ghostY + y;
              
              if (boardY >= 0) { // Only draw if on screen
                this.pieceGraphics.strokeRect(
                  boardX * BLOCK_SIZE,
                  boardY * BLOCK_SIZE,
                  BLOCK_SIZE,
                  BLOCK_SIZE
                );
              }
            }
          }
        }
      }
    }
  }
  
  drawBlock(graphics, x, y, color) {
    // Draw filled block with border
    graphics.fillStyle(color, 1);
    graphics.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    
    // Draw highlight (top and left edges)
    graphics.lineStyle(2, 0xffffff, 0.5);
    graphics.beginPath();
    graphics.moveTo(x * BLOCK_SIZE, y * BLOCK_SIZE);
    graphics.lineTo((x + 1) * BLOCK_SIZE, y * BLOCK_SIZE);
    graphics.lineTo((x + 1) * BLOCK_SIZE, (y + 1) * BLOCK_SIZE);
    graphics.lineTo(x * BLOCK_SIZE, (y + 1) * BLOCK_SIZE);
    graphics.lineTo(x * BLOCK_SIZE, y * BLOCK_SIZE);
    graphics.closePath();
    graphics.strokePath();
  }
}

// The React component that wraps the Phaser game
const TetrisGame = ({ width = 600, height = 700 }) => {
  const gameContainerRef = useRef(null);
  const gameInstanceRef = useRef(null);

  useEffect(() => {
    if (gameContainerRef.current && !gameInstanceRef.current) {
      // Calculate the total width and height needed
      const totalWidth = GAME_WIDTH + UI_WIDTH;
      const totalHeight = GAME_HEIGHT;
      
      // Phaser config
      const config = {
        type: Phaser.AUTO,
        width: totalWidth + 40, // Add some padding
        height: totalHeight + 40, // Add some padding
        parent: gameContainerRef.current,
        backgroundColor: '#5D3FD3',
        scene: [TetrisScene]
      };
      
      // Initialize the Phaser game
      gameInstanceRef.current = new Phaser.Game(config);
      
      // Cleanup function
      return () => {
        if (gameInstanceRef.current) {
          gameInstanceRef.current.destroy(true);
          gameInstanceRef.current = null;
        }
      };
    }
  }, []);

  return (
    <div className="flex flex-col items-center w-full">
      <h1 className="text-2xl font-bold mb-4">Tetris</h1>
      <div className="bg-gray-800 p-4 rounded-lg">
        <div className="mb-4 text-gray-200">
          <p className="mb-2"><strong>Controls:</strong></p>
          <p>Arrow Left/Right: Move piece</p>
          <p>Arrow Down: Soft drop</p>
          <p>Arrow Up: Rotate</p>
          <p>Spacebar: Hard drop</p>
          <p>P: Pause game</p>
        </div>
        <div ref={gameContainerRef} className="rounded overflow-hidden" />
      </div>
    </div>
  );
};

