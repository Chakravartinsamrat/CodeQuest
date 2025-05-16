// src/components/Game.js
import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import MainScene from './GameScenes/MainScene.jsx'; // Adjust the import path as necessary
import KnowledgeScene from './GameScenes/KnowledgeScne.jsx'; // Adjust the import path as necessary
import ContentScene from './GameScenes/ContentScene.jsx'; // Adjust the import path as necessary
import ChallengeScene from './GameScenes/ChallengeScene.jsx';

const Game = () => {
  const gameRef = useRef(null);

  useEffect(() => {

    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: gameRef.current,
      scene: [MainScene, KnowledgeScene, ContentScene, ChallengeScene], // Add your scenes here
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
          debug: false,
        },
      },
    };

    const game = new Phaser.Game(config);

    return () => {
      game.destroy(true); // Clean up on unmount
    };
  }, []);

  return <div ref={gameRef} />;
};

export default Game;
