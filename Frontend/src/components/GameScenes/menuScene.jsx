import Phaser from 'phaser';

class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });

        // Config options
        this.musicVolume = 0.7; // Default music volume
        this.isOpen = false;

        // Theme colors
        this.colors = {
            background: 0x1e1e2f,
            panel: 0x27293d,
            accent: 0x00d0ff,
            accentHover: 0x00a8ff,
            text: 0xffffff,
            textDim: 0x9a9cb5
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

        // Semi-transparent background overlay
        this.overlay = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000, 0.8)
            .setOrigin(0)
            .setInteractive()
            .on('pointerdown', () => this.closeMenu());

        // Create the horizontal menu panel
        this.createMenuPanel();

        // Animation for opening the menu (slide from top)
        this.tweens.add({
            targets: [this.menuPanel],
            y: this.cameras.main.height / 2 - 80, // Center vertically
            alpha: { from: 0, to: 1 },
            duration: 500,
            ease: 'Power3',
            onComplete: () => {
                this.isOpen = true;
            }
        });
    }

    createMenuPanel() {
        // Calculate panel dimensions
        const panelWidth = this.cameras.main.width * 0.8; // 80% of screen width
        const panelHeight = 120; // Fixed height for horizontal layout
        const x = this.cameras.main.width / 2 - panelWidth / 2;
        const y = -panelHeight; // Start above screen for animation

        // Create the container
        this.menuPanel = this.add.container(x, y);
        this.menuPanel.setSize(panelWidth, panelHeight);

        // Menu panel background with gradient effect
        const background = this.add.graphics();
        background.fillStyle(this.colors.panel, 1);
        background.fillRoundedRect(0, 0, panelWidth, panelHeight, 20);

        // Add subtle gradient highlight
        const highlight = this.add.graphics();
        highlight.fillGradientStyle(0xffffff, 0xffffff, 0xffffff, 0xffffff, 0.15, 0.1, 0.05, 0);
        highlight.fillRoundedRect(0, 0, panelWidth, panelHeight / 2, { tl: 20, tr: 20, bl: 0, br: 0 });

        // Add subtle border
        const border = this.add.graphics();
        border.lineStyle(2, this.colors.accent, 0.6);
        border.strokeRoundedRect(0, 0, panelWidth, panelHeight, 20);

        this.menuPanel.add([background, highlight, border]);

        // Add content sections
        this.addVolumeControl();
        this.addNavigationButtons();
        this.addProfileButton();
        this.addCloseButton();
    }

    addVolumeControl() {
        const width = 200; // Fixed width for volume slider
        const padding = 30;
        const startX = padding;

        // Volume slider background
        const sliderBg = this.add.graphics();
        sliderBg.fillStyle(0x3a3a5a, 1);
        sliderBg.fillRoundedRect(startX, 55, width, 8, 4);

        // Volume slider fill
        const sliderFill = this.add.graphics();
        sliderFill.fillStyle(this.colors.accent, 1);
        sliderFill.fillRoundedRect(startX, 55, width * this.musicVolume, 8, 4);

        // Slider handle
        const handle = this.add.circle(startX + width * this.musicVolume, 59, 12, this.colors.accent)
            .setInteractive({ useHandCursor: true });

        // Make the slider interactive
        const sliderArea = this.add.rectangle(startX + width / 2, 59, width, 40, 0xffffff, 0)
            .setInteractive({ useHandCursor: true });

        // Volume icon
        const volumeIcon = this.add.text(startX - 25, 59, '🔊', {
            fontSize: '24px'
        }).setOrigin(0.5);

        // Handle slider interaction
        sliderArea.on('pointerdown', (pointer) => {
            this.dragging = true;
            this.updateVolumeSlider(pointer.x - this.menuPanel.x, startX, width, sliderFill, handle);
        });

        sliderArea.on('pointermove', (pointer) => {
            if (this.dragging) {
                this.updateVolumeSlider(pointer.x - this.menuPanel.x, startX, width, sliderFill, handle);
            }
        });

        this.input.on('pointerup', () => {
            this.dragging = false;
        });

        this.menuPanel.add([sliderBg, sliderFill, handle, sliderArea, volumeIcon]);
    }

    updateVolumeSlider(pointerX, startX, width, sliderFill, handle) {
        // Calculate new volume based on pointer position
        let volume = (pointerX - startX) / width;
        volume = Phaser.Math.Clamp(volume, 0, 1);
        this.musicVolume = volume;

        // Update slider visuals
        sliderFill.clear();
        sliderFill.fillStyle(this.colors.accent, 1);
        sliderFill.fillRoundedRect(startX, 55, width * volume, 8, 4);

        handle.x = startX + width * volume;

        // Update game music volume (uncomment when music is implemented)
        // this.sound.get('backgroundMusic').setVolume(volume);
    }

    addNavigationButtons() {
        const buttonSize = 60;
        const spacing = 20;
        const startX = 260; // After volume control
        const centerY = 60;

        // Navigation buttons data (icons only)
        const buttons = [
            { icon: '🏠', action: 'Home' },
            { icon: '🎮', action: 'Levels' },
            { icon: '⚙️', action: 'Settings' }
        ];

        buttons.forEach((button, index) => {
            const x = startX + (index * (buttonSize + spacing));

            // Button background
            const buttonBg = this.add.circle(x + buttonSize / 2, centerY, buttonSize / 2, 0x3a3a5a)
                .setInteractive({ useHandCursor: true });

            // Button highlight for hover effect
            const buttonHighlight = this.add.circle(x + buttonSize / 2, centerY, buttonSize / 2, this.colors.accent, 0.3);
            buttonHighlight.visible = false;

            // Button icon
            const icon = this.add.text(x + buttonSize / 2, centerY, button.icon, {
                fontSize: '28px'
            }).setOrigin(0.5);

            // Handle interactions
            buttonBg.on('pointerover', () => {
                buttonHighlight.visible = true;
                this.tweens.add({
                    targets: buttonBg,
                    scale: 1.1,
                    duration: 100
                });
            });

            buttonBg.on('pointerout', () => {
                buttonHighlight.visible = false;
                this.tweens.add({
                    targets: buttonBg,
                    scale: 1,
                    duration: 100
                });
            });

            buttonBg.on('pointerdown', () => {
                console.log(`Navigating to ${button.action}`);
                this.closeMenu();
                // Implement scene navigation here
                // this.scene.start(`${button.action}Scene`);
            });

            this.menuPanel.add([buttonBg, buttonHighlight, icon]);
        });
    }

    addProfileButton() {
        const buttonSize = 60;
        const panelWidth = this.menuPanel.width;
        const x = panelWidth - 120; // Position before close button
        const centerY = 60;

        // Profile button background
        const buttonBg = this.add.circle(x + buttonSize / 2, centerY, buttonSize / 2, this.colors.accent)
            .setInteractive({ useHandCursor: true });

        // Profile icon (user initial)
        const userInitial = this.add.text(x + buttonSize / 2, centerY, 'P', {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: this.colors.panel,
            fontWeight: 'bold'
        }).setOrigin(0.5);

        // Handle interactions
        buttonBg.on('pointerover', () => {
            buttonBg.setFillStyle(this.colors.accentHover);
            this.tweens.add({
                targets: buttonBg,
                scale: 1.1,
                duration: 100
            });
        });

        buttonBg.on('pointerout', () => {
            buttonBg.setFillStyle(this.colors.accent);
            this.tweens.add({
                targets: buttonBg,
                scale: 1,
                duration: 100
            });
        });

        buttonBg.on('pointerdown', () => {
            console.log('Opening full profile');
            // Navigate to profile scene
            // this.scene.start('ProfileScene');
        });

        this.menuPanel.add([buttonBg, userInitial]);
    }

    addCloseButton() {
        const buttonSize = 60;
        const panelWidth = this.menuPanel.width;
        const x = panelWidth - 60;
        const centerY = 60;

        // Close button background
        const buttonBg = this.add.circle(x + buttonSize / 2, centerY, buttonSize / 2, 0xff3333)
            .setInteractive({ useHandCursor: true });

        // Close icon
        const closeIcon = this.add.text(x + buttonSize / 2, centerY, 'X', {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: this.colors.text
        }).setOrigin(0.5);

        // Handle interactions
        buttonBg.on('pointerover', () => {
            buttonBg.setFillStyle(0xcc0000);
            this.tweens.add({
                targets: buttonBg,
                scale: 1.1,
                duration: 100
            });
        });

        buttonBg.on('pointerout', () => {
            buttonBg.setFillStyle(0xff3333);
            this.tweens.add({
                targets: buttonBg,
                scale: 1,
                duration: 100
            });
        });

        buttonBg.on('pointerdown', () => {
            this.closeMenu();
        });

        this.menuPanel.add([buttonBg, closeIcon]);
    }

    closeMenu() {
        if (!this.isOpen) return;

        this.tweens.add({
            targets: [this.menuPanel],
            y: -150, // Slide back up
            alpha: 0,
            duration: 400,
            ease: 'Power2',
            onComplete: () => {
                this.isOpen = false;
                this.scene.stop();
            }
        });
    }
}

export default MenuScene;