import Phaser from 'phaser';

class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });

        // Config options
        this.musicVolume = 0.7; // Default music volume
        this.isOpen = false;

        // Theme colors - Enhanced modern color scheme
        this.colors = {
            background: 0x0f1123,        // Darker blue background
            panel: 0x1a1c2c,             // Darker panel
            accent: 0x4d5bf9,            // Vibrant blue accent
            accentHover: 0x7b86ff,       // Lighter blue for hover states
            text: 0xffffff,              // White text
            textDim: 0x9a9cb5,           // Dimmed text
            buttonBg: 0x2a2c44,          // Button background
            destructive: 0xf25f5c        // Red for close/cancel actions
        };
    }

    init() {
        this.isOpen = false;
    }

    create() {
        // Set up event to close menu when Escape key is pressed
        this.input.keyboard.on('keydown-ESC', () => {
            this.closeMenu();
        });

        // Semi-transparent background overlay with blur effect simulation
        this.overlay = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000, 0.7)
            .setOrigin(0)
            .setInteractive()
            .on('pointerdown', () => this.closeMenu());

        // Add subtle pattern to overlay for visual interest
        this.createPatternOverlay();
            
        // Create the menu panel
        this.createMenuPanel();

        // Animation for opening the menu (slide up with bounce)
        this.tweens.add({
            targets: [this.menuPanel],
            y: this.cameras.main.height / 2 - 220,  // Moved up by 150px from center
            alpha: { from: 0, to: 1 },
            duration: 600,
            ease: 'Back.easeOut',
            onComplete: () => {
                this.isOpen = true;
            }
        });
    }

    createPatternOverlay() {
        // Create a subtle grid pattern for the background
        const gridGraphics = this.add.graphics();
        gridGraphics.lineStyle(1, 0xffffff, 0.05);
        
        const cellSize = 30;
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // Draw vertical lines
        for (let x = 0; x <= width; x += cellSize) {
            gridGraphics.moveTo(x, 0);
            gridGraphics.lineTo(x, height);
        }
        
        // Draw horizontal lines
        for (let y = 0; y <= height; y += cellSize) {
            gridGraphics.moveTo(0, y);
            gridGraphics.lineTo(width, y);
        }
        
        gridGraphics.strokePath();
    }

    createMenuPanel() {
        // Calculate panel dimensions - reduced width and vertically centered
        const panelWidth = this.cameras.main.width * 0.35; // Reduced from 0.4 to 0.35
        const panelHeight = 480; // Increased height for better spacing
        
        // Center the panel horizontally and position it above screen for animation
        const x = this.cameras.main.width / 2 - panelWidth / 2;
        const y = -panelHeight; // Start above screen for animation

        // Create the container
        this.menuPanel = this.add.container(x, y);
        this.menuPanel.setSize(panelWidth, panelHeight);

        // Menu panel background with modern glass-like effect
        const background = this.add.graphics();
        background.fillStyle(this.colors.panel, 0.95);
        background.fillRoundedRect(0, 0, panelWidth, panelHeight, 24); // Increased border radius
        
        // Add subtle gradient to background for depth
        const bgGradient = this.add.graphics();
        bgGradient.fillGradientStyle(
            this.colors.panel, this.colors.panel,
            0x121420, 0x121420,
            0.95, 0.95, 1, 1
        );
        bgGradient.fillRoundedRect(0, 0, panelWidth, panelHeight, 24);
        
        // Glossy effect at top
        const highlight = this.add.graphics();
        highlight.fillGradientStyle(0xffffff, 0xffffff, 0xffffff, 0xffffff, 0.12, 0.06, 0.03, 0);
        highlight.fillRoundedRect(4, 4, panelWidth - 8, panelHeight / 6, { tl: 20, tr: 20, bl: 0, br: 0 });

        // Add a subtle inner shadow at bottom
        const shadow = this.add.graphics();
        shadow.fillGradientStyle(0x000000, 0x000000, 0x000000, 0x000000, 0, 0, 0.05, 0.1);
        shadow.fillRoundedRect(4, panelHeight - panelHeight / 6, panelWidth - 8, panelHeight / 6, { tl: 0, tr: 0, bl: 20, br: 20 });

        // Add glowing accent border
        const border = this.add.graphics();
        border.lineStyle(2, this.colors.accent, 0.5);
        border.strokeRoundedRect(0, 0, panelWidth, panelHeight, 24);
        
        // Add a second subtle outer glow
        const outerGlow = this.add.graphics();
        outerGlow.lineStyle(1, this.colors.accent, 0.2);
        outerGlow.strokeRoundedRect(-2, -2, panelWidth + 4, panelHeight + 4, 26);

        // Add horizontal dividing lines between sections
        const dividers = this.add.graphics();
        dividers.lineStyle(1, this.colors.accent, 0.2);
        
        // Space the dividers evenly
        const dividerPadding = 30;
        dividers.moveTo(dividerPadding, 70);  // Below title
        dividers.lineTo(panelWidth - dividerPadding, 70);
        
        dividers.moveTo(dividerPadding, 150); // Below audio section
        dividers.lineTo(panelWidth - dividerPadding, 150);
        
        dividers.moveTo(dividerPadding, 320); // Below navigation buttons
        dividers.lineTo(panelWidth - dividerPadding, 320);

        this.menuPanel.add([background, bgGradient, highlight, shadow, border, outerGlow, dividers]);

        // Menu title with enhanced styling
        const menuTitle = this.add.text(panelWidth / 2, 35, "GAME MENU", {
            fontFamily: 'Arial',
            fontSize: '22px',
            fontWeight: 'bold',
            color: '#' + this.colors.accent.toString(16).padStart(6, '0')
        }).setOrigin(0.5);
        
        // Add subtle text shadow to title
        menuTitle.setShadow(0, 2, 'rgba(0,0,0,0.5)', 3);
        this.menuPanel.add(menuTitle);

        // Add menu sections in vertical layout with better spacing
        this.addVolumeControl(panelWidth);
        this.addNavigationButtons();
        this.addProfileButton();
        this.addCloseButton();
    }

    addVolumeControl(panelWidth) {
        const width = panelWidth - 60; // Width relative to panel (increased margin space)
        const padding = 30;
        const startX = padding;
        const sectionY = 95; // Positioned below title and first divider

        // "Audio" label with icon
        const label = this.add.text(panelWidth / 2, sectionY - 15, "🎵 AUDIO", {
            fontFamily: 'Arial',
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#' + this.colors.textDim.toString(16).padStart(6, '0')
        }).setOrigin(0.5);

        // Volume slider track with refined design
        const sliderBg = this.add.graphics();
        sliderBg.fillStyle(0x3a3a5a, 0.6);
        sliderBg.fillRoundedRect(startX, sectionY, width, 8, 4); // Slightly taller

        // Volume slider fill with enhanced gradient
        const sliderFill = this.add.graphics();
        sliderFill.fillGradientStyle(
            this.colors.accent, this.colors.accentHover, 
            this.colors.accent, this.colors.accentHover, 
            1, 1, 0.8, 0.8
        );
        sliderFill.fillRoundedRect(startX, sectionY, width * this.musicVolume, 8, 4);

        // Modern slider handle with subtle glow effect
        const handleGlow = this.add.circle(startX + width * this.musicVolume, sectionY + 4, 12, this.colors.accentHover, 0.3);
        const handle = this.add.circle(startX + width * this.musicVolume, sectionY + 4, 10, this.colors.accent);
        
        // Add white dot in center of handle for detail
        const handleDot = this.add.circle(startX + width * this.musicVolume, sectionY + 4, 3, 0xffffff, 0.9);
        
        // Both handle elements are interactive
        handle.setInteractive({ useHandCursor: true });
        handleDot.setInteractive({ useHandCursor: true });

        // Make the entire slider area interactive - taller for easier use
        const sliderArea = this.add.rectangle(startX + width / 2, sectionY + 4, width, 30, 0xffffff, 0)
            .setInteractive({ useHandCursor: true });

        // Better volume icon with current percentage
        const volumeIcon = this.add.text(startX, sectionY + 25, "🔊", {
            fontSize: '20px'
        });

        // Volume percentage display with modern styling
        const volumeText = this.add.text(startX + 30, sectionY + 25, `${Math.round(this.musicVolume * 100)}%`, {
            fontFamily: 'Arial',
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#' + this.colors.text.toString(16).padStart(6, '0')
        });

        // Handle slider interaction
        sliderArea.on('pointerdown', (pointer) => {
            this.dragging = true;
            this.updateVolumeSlider(pointer.x - this.menuPanel.x, startX, width, sliderFill, handle, handleDot, handleGlow, volumeText);
        });

        sliderArea.on('pointermove', (pointer) => {
            if (this.dragging) {
                this.updateVolumeSlider(pointer.x - this.menuPanel.x, startX, width, sliderFill, handle, handleDot, handleGlow, volumeText);
            }
        });

        this.input.on('pointerup', () => {
            this.dragging = false;
        });

        this.menuPanel.add([label, sliderBg, sliderFill, handleGlow, handle, handleDot, sliderArea, volumeIcon, volumeText]);
    }

    updateVolumeSlider(pointerX, startX, width, sliderFill, handle, handleDot, handleGlow, volumeText) {
        // Calculate new volume based on pointer position
        let volume = (pointerX - startX) / width;
        volume = Phaser.Math.Clamp(volume, 0, 1);
        this.musicVolume = volume;

        // Enhanced visual feedback for slider adjustment
        this.tweens.killTweensOf(handle);
        this.tweens.add({
            targets: [handle, handleDot],
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 100,
            yoyo: true,
            ease: 'Sine.easeOut'
        });
        
        // Glow effect when dragging
        this.tweens.add({
            targets: handleGlow,
            scaleX: 1.5,
            scaleY: 1.5,
            alpha: 0.6,
            duration: 100,
            yoyo: true,
            ease: 'Sine.easeOut'
        });

        // Update slider visuals
        sliderFill.clear();
        sliderFill.fillGradientStyle(
            this.colors.accent, this.colors.accentHover, 
            this.colors.accent, this.colors.accentHover, 
            1, 1, 0.8, 0.8
        );
        sliderFill.fillRoundedRect(startX, 95, width * volume, 8, 4);

        // Update handle positions
        handle.x = startX + width * volume;
        handleDot.x = handle.x;
        handleGlow.x = handle.x;
        
        // Update volume percentage text with animation
        volumeText.setText(`${Math.round(volume * 100)}%`);
        this.tweens.add({
            targets: volumeText,
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 50,
            yoyo: true
        });

        // Update game music volume (uncomment when music is implemented)
        // this.sound.get('backgroundMusic').setVolume(volume);
    }

    addNavigationButtons() {
        const panelWidth = this.menuPanel.width;
        const startY = 170; // Position below volume control
        const buttonWidth = panelWidth - 60;
        const buttonHeight = 45; // Slightly smaller height
        const buttonSpacing = 12; // Reduced spacing
        const x = 30; // Centered margin
        
        // Navigation buttons with modern look
        const buttons = [
            { icon: '🏠', label: 'Home', action: 'Home' },
            { icon: '🎮', label: 'Games', action: 'Levels' },
            { icon: '⚙️', label: 'Settings', action: 'Settings' }
        ];

        buttons.forEach((button, index) => {
            const y = startY + (index * (buttonHeight + buttonSpacing));
            
            // Button container for grouping
            const buttonContainer = this.add.container(x, y);
            
            // Modern capsule-shaped button with subtle gradient
            const buttonBg = this.add.graphics();
            buttonBg.fillGradientStyle(
                this.colors.buttonBg, this.colors.buttonBg,
                0x252738, 0x252738,
                1, 1, 1, 1
            );
            buttonBg.fillRoundedRect(0, 0, buttonWidth, buttonHeight, 12);
            buttonBg.setInteractive(new Phaser.Geom.Rectangle(0, 0, buttonWidth, buttonHeight), Phaser.Geom.Rectangle.Contains, { useHandCursor: true });
            
            // Button highlight effect for hover
            const buttonGlow = this.add.graphics();
            buttonGlow.fillStyle(this.colors.accent, 0.2);
            buttonGlow.fillRoundedRect(0, 0, buttonWidth, buttonHeight, 12);
            buttonGlow.visible = false;
            
            // Subtle button outline
            const buttonOutline = this.add.graphics();
            buttonOutline.lineStyle(1, this.colors.accent, 0.3);
            buttonOutline.strokeRoundedRect(0, 0, buttonWidth, buttonHeight, 12);
            
            // Button icon - on left side with better positioning
            const icon = this.add.text(25, buttonHeight/2, button.icon, {
                fontSize: '24px'
            }).setOrigin(0.5);
            
            // Button label text - centered with enhanced styling
            const label = this.add.text(buttonWidth/2 + 10, buttonHeight/2, button.label, {
                fontFamily: 'Arial',
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#' + this.colors.text.toString(16).padStart(6, '0')
            }).setOrigin(0.5);

            // Handle interactions
            buttonBg.on('pointerover', () => {
                buttonGlow.visible = true;
                this.tweens.add({
                    targets: [icon, label],
                    x: '+=5',
                    duration: 100
                });
            });

            buttonBg.on('pointerout', () => {
                buttonGlow.visible = false;
                this.tweens.add({
                    targets: [icon, label],
                    x: '-=5',
                    duration: 100
                });
            });

            buttonBg.on('pointerdown', () => {
                // Add click effect
                this.tweens.add({
                    targets: buttonContainer,
                    scaleX: 0.95,
                    scaleY: 0.95,
                    duration: 50,
                    yoyo: true,
                    onComplete: () => {
                        console.log(`Navigating to ${button.action}`);
                        this.closeMenu();
                        // Implement scene navigation here
                        // this.scene.start(`${button.action}Scene`);
                    }
                });
            });

            buttonContainer.add([buttonBg, buttonOutline, buttonGlow, icon, label]);
            this.menuPanel.add(buttonContainer);
        });
    }

    addProfileButton() {
        const panelWidth = this.menuPanel.width;
        const buttonWidth = panelWidth - 60;
        const buttonHeight = 45;
        const x = 30; // Centered margin
        const y = 340; // Position below the navigation buttons and divider
        
        // Button container for grouping
        const buttonContainer = this.add.container(x, y);
        
        // Profile button background with gradient
        const buttonBg = this.add.graphics();
        buttonBg.fillGradientStyle(
            this.colors.accent, this.colors.accent,
            0x3e4bd7, 0x3e4bd7,
            1, 1, 1, 1
        );
        buttonBg.fillRoundedRect(0, 0, buttonWidth, buttonHeight, 12);
        buttonBg.setInteractive(new Phaser.Geom.Rectangle(0, 0, buttonWidth, buttonHeight), Phaser.Geom.Rectangle.Contains, { useHandCursor: true });
        
        // Button highlight effect for hover
        const buttonGlow = this.add.graphics();
        buttonGlow.fillStyle(this.colors.accentHover, 0.3);
        buttonGlow.fillRoundedRect(0, 0, buttonWidth, buttonHeight, 12);
        buttonGlow.visible = false;
        
        // Avatar circle with border
        const avatarBorder = this.add.circle(25, buttonHeight/2, 20, this.colors.accentHover);
        const avatarBg = this.add.circle(25, buttonHeight/2, 18, 0xffffff);
        
        // Profile icon (user initial)
        const userInitial = this.add.text(25, buttonHeight/2, 'P', {
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#' + this.colors.accent.toString(16).padStart(6, '0'),
            fontWeight: 'bold'
        }).setOrigin(0.5);
        
        // Profile text
        const label = this.add.text(buttonWidth/2 + 10, buttonHeight/2, 'Profile', {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#ffffff',
            fontWeight: 'bold'
        }).setOrigin(0.5);

        // Handle interactions
        buttonBg.on('pointerover', () => {
            buttonGlow.visible = true;
            this.tweens.add({
                targets: [avatarBg, avatarBorder, userInitial, label],
                x: '+=5',
                duration: 100
            });
        });

        buttonBg.on('pointerout', () => {
            buttonGlow.visible = false;
            this.tweens.add({
                targets: [avatarBg, avatarBorder, userInitial, label],
                x: '-=5',
                duration: 100
            });
        });

        buttonBg.on('pointerdown', () => {
            // Add click effect
            this.tweens.add({
                targets: buttonContainer,
                scaleX: 0.95,
                scaleY: 0.95,
                duration: 50,
                yoyo: true,
                onComplete: () => {
                    console.log('Navigating to profile page');
                    this.closeMenu();
                    
                    // Get the current URL and navigate to profile
                    // This ensures it works in both development and production
                    const currentUrl = window.location.href;
                    
                    // Extract the base URL (removing the '/game' part if present)
                    let baseUrl;
                    if (currentUrl.includes('/game')) {
                        baseUrl = currentUrl.substring(0, currentUrl.indexOf('/game'));
                    } else {
                        // Fallback to current origin if '/game' not found
                        baseUrl = window.location.origin;
                    }
                    
                    // Navigate to the profile page
                    window.location.href = `${baseUrl}/profile`;
                }
            });
        });

        buttonContainer.add([buttonBg, buttonGlow, avatarBorder, avatarBg, userInitial, label]);
        this.menuPanel.add(buttonContainer);
    }

    addCloseButton() {
        const panelWidth = this.menuPanel.width;
        const buttonWidth = panelWidth - 60;
        const buttonHeight = 45;
        const x = 30; // Centered margin
        const y = 395; // Position at the bottom with space
        
        // Button container for grouping
        const buttonContainer = this.add.container(x, y);
        
        // Close button background with gradient
        const buttonBg = this.add.graphics();
        buttonBg.fillGradientStyle(
            this.colors.destructive, this.colors.destructive,
            0xd14240, 0xd14240,
            1, 1, 1, 1
        );
        buttonBg.fillRoundedRect(0, 0, buttonWidth, buttonHeight, 12);
        buttonBg.setInteractive(new Phaser.Geom.Rectangle(0, 0, buttonWidth, buttonHeight), Phaser.Geom.Rectangle.Contains, { useHandCursor: true });
        
        // Button highlight effect for hover
        const buttonGlow = this.add.graphics();
        buttonGlow.fillStyle(0xff0000, 0.3);
        buttonGlow.fillRoundedRect(0, 0, buttonWidth, buttonHeight, 12);
        buttonGlow.visible = false;
        
        // Close icon - 'X' symbol
        const closeIcon = this.add.text(25, buttonHeight/2, '✕', {
            fontSize: '20px',
            fontFamily: 'Arial',
            color: '#ffffff',
            fontWeight: 'bold'
        }).setOrigin(0.5);
        
        // Close text
        const label = this.add.text(buttonWidth/2 + 10, buttonHeight/2, 'Close Menu', {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#ffffff',
            fontWeight: 'bold'
        }).setOrigin(0.5);

        // Handle interactions
        buttonBg.on('pointerover', () => {
            buttonGlow.visible = true;
            this.tweens.add({
                targets: [closeIcon, label],
                x: '+=5',
                duration: 100
            });
        });

        buttonBg.on('pointerout', () => {
            buttonGlow.visible = false;
            this.tweens.add({
                targets: [closeIcon, label],
                x: '-=5',
                duration: 100
            });
        });

        buttonBg.on('pointerdown', () => {
            // Add click effect
            this.tweens.add({
                targets: buttonContainer,
                scaleX: 0.95,
                scaleY: 0.95,
                duration: 50,
                yoyo: true,
                onComplete: () => {
                    this.closeMenu();
                }
            });
        });

        buttonContainer.add([buttonBg, buttonGlow, closeIcon, label]);
        this.menuPanel.add(buttonContainer);
    }

    closeMenu() {
        if (!this.isOpen) return;

        // More dynamic close animation
        this.tweens.add({
            targets: [this.menuPanel],
            y: this.cameras.main.height + 50, // Slide down instead of up
            alpha: 0,
            duration: 500,
            ease: 'Back.easeIn',
            onComplete: () => {
                this.isOpen = false;
                this.scene.stop();
            }
        });
        
        // Fade out overlay
        this.tweens.add({
            targets: [this.overlay],
            alpha: 0,
            duration: 300,
        });
    }
}

export default MenuScene;