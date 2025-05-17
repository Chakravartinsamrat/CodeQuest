import Phaser from 'phaser';
import React from 'react';
import { createRoot } from 'react-dom/client';

class TournamentScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TournamentScene' });

        // Tournament state
        this.timer = 300; // 5-minute countdown in seconds
        this.score = { left: 0, right: 0 };
        this.activeEditor = 'left'; // Track which editor is active
        this.rightOutputRef = null; // Ref for Right.jsx

        // Bind methods to ensure `this` context
        this.createGradientBackground = this.createGradientBackground.bind(this);
        this.createGridPattern = this.createGridPattern.bind(this);
        this.createHeader = this.createHeader.bind(this);
        this.createPanels = this.createPanels.bind(this);
        this.createPanel = this.createPanel.bind(this);
        this.createTabButton = this.createTabButton.bind(this);
        this.createDivider = this.createDivider.bind(this);
        this.createDecorations = this.createDecorations.bind(this);
        this.setupControls = this.setupControls.bind(this);
        this.setupKeyboardListeners = this.setupKeyboardListeners.bind(this);
        this.showHelp = this.showHelp.bind(this);
        this.updateScore = this.updateScore.bind(this);
        this.formatTime = this.formatTime.bind(this);
        this.handleRunCode = this.handleRunCode.bind(this);
    }

    // Removed preload since no images are used
    preload() {
        // No assets to load
    }

    create() {
        const { width, height } = this.cameras.main;

        // Create gradient backgrounds for each half
        this.createGradientBackground(width, height);

        // Add header bar with placeholder (no logo image)
        this.createHeader(width);

        // Add interactive panels for both sides
        this.createPanels(width, height);

        // Add connecting elements and decorations (no particles)
        this.createDecorations(width, height);

        // Setup editor/output tabs and controls
        this.setupControls(width, height);

        // Add divider line with animated elements
        this.createDivider(width, height);

        // Setup keyboard listeners for demo
        this.setupKeyboardListeners();

        // Add timer display
        this.timerText = this.add.text(width - 100, 30, this.formatTime(this.timer), {
            fontSize: '16px',
            fontFamily: 'monospace',
            color: '#00d0ff',
        }).setOrigin(1, 0.5);
    }

    update(time, delta) {
        // Update timer
        this.timer -= delta / 1000;
        if (this.timer <= 0) this.timer = 0;
        this.timerText.setText(this.formatTime(Math.ceil(this.timer)));
    }

    createGradientBackground(width, height) {
        // Left panel - dark blue gradient
        const leftPanel = this.add.graphics();
        leftPanel.fillGradientStyle(0x1a1a2e, 0x16213e, 0x1a1a2e, 0x16213e, 1);
        leftPanel.fillRect(0, 0, width / 2, height);

        // Right panel - dark purple gradient
        const rightPanel = this.add.graphics();
        rightPanel.fillGradientStyle(0x241b2f, 0x1f1b2f, 0x241b2f, 0x1f1b2f, 1);
        rightPanel.fillRect(width / 2, 0, width / 2, height);

        // Add subtle grid patterns to both sides
        this.createGridPattern(0, 0, width / 2, height, 0xffffff, 0.03);
        this.createGridPattern(width / 2, 0, width / 2, height, 0xffffff, 0.03);
    }

    createGridPattern(x, y, width, height, color, alpha) {
        const graphics = this.add.graphics();
        graphics.lineStyle(1, color, alpha);

        // Draw vertical lines
        for (let i = 0; i <= width; i += 20) {
            graphics.moveTo(x + i, y);
            graphics.lineTo(x + i, y + height);
        }

        // Draw horizontal lines
        for (let j = 0; j <= height; j += 20) {
            graphics.moveTo(x, y + j);
            graphics.lineTo(x + width, y + j);
        }

        graphics.strokePath();
    }

    createHeader(width) {
        // Header background
        const headerHeight = 60;
        const headerPanel = this.add.rectangle(0, 0, width, headerHeight, 0x0a0a1a).setOrigin(0);

        // Add glowing border at bottom of header
        const headerBorder = this.add.rectangle(0, headerHeight, width, 2, 0x00d0ff).setOrigin(0);

        // Placeholder circle instead of logo
        const logoPlaceholder = this.add.circle(30, headerHeight / 2, 20, 0x00d0ff).setAlpha(0.9);

        // Title text with shadow
        const headerTitle = this.add
            .text(60, headerHeight / 2, 'INTERACTIVE DEVELOPMENT ENVIRONMENT', {
                fontSize: '22px',
                fontFamily: 'Arial, sans-serif',
                color: '#ffffff',
                fontWeight: 'bold',
            })
            .setOrigin(0, 0.5);

        headerTitle.setShadow(0, 2, 'rgba(0,200,255,0.5)', 5);
    }

    createPanels(width, height) {
        const panelPadding = 20;
        const headerHeight = 60;
        const panelWidth = width / 2 - panelPadding * 2;
        const panelHeight = height - headerHeight - panelPadding * 2;
        const panelY = headerHeight + panelPadding;

        // Create panels for both sides
        this.createPanel(panelPadding, panelY, panelWidth, panelHeight, 'LEFT EDITOR', 'left');
        this.createPanel(width / 2 + panelPadding, panelY, panelWidth, panelHeight, 'RIGHT OUTPUT', 'right');
    }

    createPanel(x, y, width, height, title, side) {
        // Panel background with border
        const panel = this.add
            .rectangle(x, y, width, height, 0x000000, 0.3)
            .setOrigin(0)
            .setStrokeStyle(1, 0x00d0ff, 0.3);

        panel.setInteractive();

        // Panel header
        const panelHeader = this.add
            .rectangle(x, y, width, 40, 0x000000, 0.5)
            .setOrigin(0)
            .setStrokeStyle(1, 0x00d0ff, 0.5);

        // Title text
        const panelTitle = this.add
            .text(x + 15, y + 20, title, {
                fontSize: '16px',
                fontFamily: 'Arial, sans-serif',
                color: '#ffffff',
                fontWeight: 'bold',
            })
            .setOrigin(0, 0.5);

        // Tab buttons
        if (side === 'left') {
            this.createTabButton(x + width - 160, y + 20, 'CODE', true, side);
            this.createTabButton(x + width - 80, y + 20, 'PREVIEW', false, side);
        } else {
            this.createTabButton(x + width - 160, y + 20, 'OUTPUT', true, side);
            this.createTabButton(x + width - 80, y + 20, 'CONSOLE', false, side);
        }

        // Content area for React component
        const contentY = y + 50;
        const contentHeight = height - 50;

        // Create DOM container
        this[`${side}Iframe`] = this.add.dom(x + 10, contentY, 'div', {
            width: width - 20,
            height: contentHeight - 10,
            style: `
                background-color: rgba(10, 10, 20, 0.7);
                border-radius: 4px;
                padding: 8px;
                color: white;
                font-family: monospace;
                overflow: auto;
                box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.5);
            `,
        });

        // Render React component
        this.time.delayedCall(100, () => {
            const container = this[`${side}Iframe`].node;
            const root = createRoot(container);
            if (side === 'left') {
                root.render(<Left onRunCode={(code) => this.handleRunCode(code)} />);
            } else {
                root.render(<Right ref={(ref) => (this.rightOutputRef = ref)} />);
            }
        });
    }

    createTabButton(x, y, label, isActive, side) {
        const width = 70;
        const height = 30;

        // Background
        const tabBackground = this.add
            .rectangle(x, y, width, height, isActive ? 0x00d0ff : 0x000000, isActive ? 0.3 : 0.2)
            .setOrigin(0.5)
            .setStrokeStyle(1, 0x00d0ff, isActive ? 0.8 : 0.3);

        // Text
        const tabText = this.add
            .text(x, y, label, {
                fontSize: '12px',
                fontFamily: 'Arial, sans-serif',
                color: isActive ? '#ffffff' : '#aaaaaa',
                fontWeight: isActive ? 'bold' : 'normal',
            })
            .setOrigin(0.5);

        // Make interactive
        tabBackground
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => {
                if (!isActive) {
                    tabBackground.setFillStyle(0x00d0ff, 0.1);
                    tabText.setColor('#cccccc');
                }
            })
            .on('pointerout', () => {
                if (!isActive) {
                    tabBackground.setFillStyle(0x000000, 0.2);
                    tabText.setColor('#aaaaaa');
                }
            })
            .on('pointerdown', () => {
                console.log(`${side} tab ${label} clicked`);
            });
    }

    createDivider(width, height) {
        // Center divider line with glow effect
        const dividerWidth = 4;
        const divider = this.add
            .rectangle(width / 2 - dividerWidth / 2, 0, dividerWidth, height, 0x00d0ff)
            .setOrigin(0);

        // Add decorative nodes
        for (let y = 120; y < height; y += 120) {
            const node = this.add.circle(width / 2, y, 8, 0x00d0ff).setAlpha(0.8);
            this.tweens.add({
                targets: node,
                scale: 1.3,
                alpha: 0.4,
                duration: 1500,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut',
            });
        }
    }

    createDecorations(width, height) {
        // No particles since images are removed
        // Add minimal decorative elements if needed
        const decorLine = this.add
            .rectangle(width / 2, height - 50, width, 2, 0x00d0ff)
            .setAlpha(0.5);
    }

    setupControls(width, height) {
        // Footer panel
        const footerHeight = 40;
        const footerY = height - footerHeight;

        // Footer background
        const footer = this.add
            .rectangle(0, footerY, width, footerHeight, 0x0a0a1a, 0.7)
            .setOrigin(0);

        // Status text
        this.statusText = this.add
            .text(20, footerY + footerHeight / 2, 'Ready', {
                fontSize: '14px',
                fontFamily: 'monospace',
                color: '#00d0ff',
            })
            .setOrigin(0, 0.5);

        // Score display
        this.scoreText = this.add
            .text(width / 2, footerY + footerHeight / 2, `Left: ${this.score.left} | Right: ${this.score.right}`, {
                fontSize: '14px',
                fontFamily: 'monospace',
                color: '#ffffff',
            })
            .setOrigin(0.5);

        // Help button
        const helpButton = this.add
            .text(width - 20, footerY + footerHeight / 2, 'HELP [?]', {
                fontSize: '14px',
                fontFamily: 'monospace',
                color: '#00d0ff',
            })
            .setOrigin(1, 0.5);

        helpButton
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => helpButton.setColor('#ffffff'))
            .on('pointerout', () => helpButton.setColor('#00d0ff'))
            .on('pointerdown', () => {
                this.showHelp();
            });
    }

    setupKeyboardListeners() {
        this.input.keyboard.on('keydown-SPACE', () => {
            this.score.left += 1;
            this.updateScore();
        });

        this.input.keyboard.on('keydown-ENTER', () => {
            this.score.right += 1;
            this.updateScore();
        });

        this.input.keyboard.on('keydown-TAB', (event) => {
            event.preventDefault();
            this.activeEditor = this.activeEditor === 'left' ? 'right' : 'left';
            this.statusText.setText(`Editing: ${this.activeEditor.toUpperCase()}`);
        });
    }

    showHelp() {
        const { width, height } = this.cameras.main;

        // Darken background
        const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.8).setOrigin(0).setInteractive();

        // Help panel
        const panelWidth = 500;
        const panelHeight = 300;
        const panel = this.add
            .rectangle(width / 2, height / 2, panelWidth, panelHeight, 0x1a1a2e)
            .setStrokeStyle(2, 0x00d0ff, 1);

        // Title
        const title = this.add
            .text(width / 2, height / 2 - 120, 'KEYBOARD SHORTCUTS', {
                fontSize: '20px',
                fontFamily: 'Arial, sans-serif',
                color: '#00d0ff',
                fontWeight: 'bold',
            })
            .setOrigin(0.5);

        // Help content
        const helpContent = [
            'SPACE - Increment left score',
            'ENTER - Increment right score',
            'TAB - Switch active panel',
            'CLICK RUN CODE - Execute left panel code',
            '? - Show this help dialog',
        ];

        // Add help text
        let yPos = height / 2 - 80;
        const helpTexts = helpContent.map((item) =>
            this.add
                .text(width / 2, yPos, item, {
                    fontSize: '16px',
                    fontFamily: 'monospace',
                    color: '#ffffff',
                })
                .setOrigin(0.5)
        );
        yPos += 30;

        // Close button
        const closeButton = this.add
            .text(width / 2, height / 2 + 100, 'CLOSE', {
                fontSize: '16px',
                fontFamily: 'Arial, sans-serif',
            color: '#00d0ff',
            backgroundColor: '#0a0a1a',
            padding: { x: 20, y: 10 },
            })
            .setOrigin(0.5);

        closeButton
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => closeButton.setColor('#ffffff'))
            .on('pointerout', () => closeButton.setColor('#00d0ff'))
            .on('pointerdown', () => {
                overlay.destroy();
                panel.destroy();
                title.destroy();
                closeButton.destroy();
                helpTexts.forEach((text) => text.destroy());
            });

        overlay.on('pointerdown', () => {
            overlay.destroy();
            panel.destroy();
            title.destroy();
            closeButton.destroy();
            helpTexts.forEach((text) => text.destroy());
        });
    }

    updateScore() {
        this.scoreText.setText(`Left: ${this.score.left} | Right: ${this.score.right}`);
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    handleRunCode(code) {
        try {
            const outputContainer = this.rightIframe.node;
            const outputElement = outputContainer.querySelector('#output') || document.createElement('div');
            outputElement.id = 'output';
            outputElement.style = `
                flex-grow: 1;
                background-color: rgba(10, 10, 24, 0.6);
                padding: 15px;
                border-radius: 4px;
                font-size: 16px;
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
            `;
            if (!outputContainer.contains(outputElement)) {
                outputContainer.appendChild(outputElement);
            }

            const executeCode = new Function('document', code);
            executeCode({
                getElementById: (id) => (id === 'output' ? outputElement : null),
            });

            if (this.rightOutputRef && this.rightOutputRef.updateOutput) {
                this.rightOutputRef.updateOutput(outputElement.innerHTML);
            }
        } catch (error) {
            const outputElement = this.rightIframe.node.querySelector('#output');
            if (outputElement) {
                outputElement.innerHTML = `<span style="color: #ff5555">Error: ${error.message}</span>`;
            }
        }
    }
}

export default TournamentScene;