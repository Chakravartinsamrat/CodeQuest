export default class PlayerController {
  constructor(scene, spriteKey, x, y, scale = 1) {
    this.scene = scene;
    this.spriteKey = spriteKey;
    
    // Create player sprite with physics
    this.player = scene.physics.add.sprite(x, y, spriteKey).setScale(scale);
    this.player.setCollideWorldBounds(true);
    
    // Movement properties
    this.speed = 300;
    
    // Directions array should match your sprite sheet's actual layout
    // Based on your sprite sheet image, it appears to be organized as:
    this.directions = [
  'UP',        // 0   down-up
  'RIGHT',        // 1       left-right
  'DOWN',       // 2       right-down
  'LEFT',          // 3    Up-Left
  'UP_LEFT',      // 6
    'UP_RIGHT',     // 7
  'DOWN_LEFT',   // 4
  'DOWN_RIGHT',  // 5
       
];
    
    // Character variant/color (0=blue, 1=light blue, 2=orange)
    this.currentColor = 2;
    
    // Current direction and movement state
    this.currentDirection = 'DOWN';
    this.isMoving = false;
    
    // For debugging
    // this.debugText = scene.add.text(10, 40, "", {
    //   fontSize: '16px',
    //   fill: '#ffff00',
    //   backgroundColor: '#000000',
    //   padding: { x: 3, y: 3 }
    // }).setScrollFactor(0).setDepth(1000);
    
    // Setup controls
    this.cursors = scene.input.keyboard.createCursorKeys();
    
    // Create animations
    this.createAnimations();
    
    // Initial animation
    this.player.play('idle-down-0');
  }
  
  createAnimations() {
    const scene = this.scene;
    
    console.log("Creating animations for character");
    
    // For each character color (0=blue, 1=light blue, 2=orange)
    for (let color = 0; color < 3; color++) {
      // For each direction
      for (let dirIndex = 0; dirIndex < 4; dirIndex++) {
        const direction = this.directions[dirIndex].toLowerCase();
        
        // Calculate start frame based on sprite sheet organization
        // Each color has 32 frames total (8 directions × 4 frames per direction)
        const startFrame = (color * 24) + (dirIndex * 2);
        
        // Log the frame calculation for debugging
        console.log(`Color ${color}, Direction ${direction}, Start frame: ${startFrame}`);
        
        // Walking animation (4 frames)
        const walkKey = `walk-${direction}-${color}`;
        scene.anims.create({
          key: walkKey,
          frames: scene.anims.generateFrameNumbers(this.spriteKey, { 
            start: startFrame, 
            end: startFrame + 1 ,
          }),
          frameRate: 5,
          repeat: -1
        });
        console.log(`Created animation: ${walkKey}, frames ${startFrame}-${startFrame+3}`);
        
        // Idle animation (first frame only)
        const idleKey = `idle-${direction}-${color}`;
        scene.anims.create({
          key: idleKey,
          frames: [{ key: this.spriteKey, frame: startFrame }],
          frameRate: 1
        });
        console.log(`Created animation: ${idleKey}, frame ${startFrame}`);
      }
    }
  }
  
  getPlayer() {
    return this.player;
  }
  
  setColor(color) {
    if (color >= 0 && color <= 2) {
      this.currentColor = color;
      // Force animation update
      this.updateAnimation(true);
    }
  }
  
  updateAnimation(forceUpdate = false) {
    const dirLower = this.currentDirection.toLowerCase();
    const prefix = this.isMoving ? 'walk' : 'idle';
    const newAnim = `${prefix}-${dirLower}-${this.currentColor}`;
    
    // Only change animation if it's different or forced
    if (forceUpdate || this.player.anims.currentAnim?.key !== newAnim) {
      console.log(`Playing animation: ${newAnim}`);
      this.player.play(newAnim, true);
    }
  }
  
  update() {
    // Reset velocity
    this.player.setVelocity(0);
    
    // Determine movement from input
    let vx = 0;
    let vy = 0;
    
    if (this.cursors.left.isDown) vx = -1;
    else if (this.cursors.right.isDown) vx = 1;
    
    if (this.cursors.up.isDown) vy = -1;
    else if (this.cursors.down.isDown) vy = 1;
    
    // Update movement status
    const wasMoving = this.isMoving;
    this.isMoving = (vx !== 0 || vy !== 0);
    
    // Apply velocity (normalized for diagonals)
    if (this.isMoving) {
      if (vx !== 0 && vy !== 0) {
        // Normalize diagonal speed
        vx *= 0.7071;
        vy *= 0.7071;
      }
      this.player.setVelocity(vx * this.speed, vy * this.speed);
      
      // Map input to direction based on the new directions array
      let newDir;
      if (vx > 0) {
        if (vy < 0) newDir = 'UP_RIGHT';
        else if (vy > 0) newDir = 'DOWN_RIGHT';
        else newDir = 'RIGHT';
      } else if (vx < 0) {
        if (vy < 0) newDir = 'UP_LEFT';
        else if (vy > 0) newDir = 'DOWN_LEFT';
        else newDir = 'LEFT';
      } else {
        if (vy < 0) newDir = 'UP';
        else newDir = 'DOWN';
      }
      
      // Update direction if changed
      if (newDir !== this.currentDirection) {
        this.currentDirection = newDir;
        // Force animation update when direction changes
        this.updateAnimation(true);
      } else if (!wasMoving) {
        // Started moving in same direction
        this.updateAnimation(true);
      }
    } else if (wasMoving) {
      // Stopped moving, switch to idle
      this.updateAnimation(true);
    }
    
    // Update debug text with more animation info
    // this.debugText.setText(
    //   `Dir: ${this.currentDirection}\n` +
    //   `Moving: ${this.isMoving}\n` +
    //   `Anim: ${this.player.anims.currentAnim?.key}\n` +
    //   `Frame: ${this.player.anims.currentFrame?.index}\n` +
    //   `V: ${Math.round(this.player.body.velocity.x)},${Math.round(this.player.body.velocity.y)}`
    // );
    
    return {
      x: this.player.x,
      y: this.player.y,
      isMoving: this.isMoving
    };
  }
}