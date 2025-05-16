import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import MainScene from './GameScenes/MainScene.jsx';
import KnowledgeScene from './GameScenes/KnowledgeScne.jsx';
import ContentScene from './GameScenes/ContentScene.jsx';
import ChallengeScene from './GameScenes/ChallengeScene.jsx';
import MenuScene from './GameScenes/menuScene.jsx';

const Game = ({ w, h, isFullscreen }) => {
  const gameRef = useRef(null);
  const gameInstanceRef = useRef(null);

  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      width: w,
      height: h,
      parent: gameRef.current,
      scene: [MainScene, KnowledgeScene, ContentScene, ChallengeScene, MenuScene],
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
          debug: false,
        },
      },
      scale: {
        mode: Phaser.Scale.RESIZE,
        width: w,
        height: h,
      },
    };

    // Only create a new game if one doesn't exist
    if (!gameInstanceRef.current) {
      gameInstanceRef.current = new Phaser.Game(config);
    } else {
      // If the game exists, just resize it
      gameInstanceRef.current.scale.resize(w, h);
    }

    return () => {
      if (gameInstanceRef.current) {
        gameInstanceRef.current.destroy(true);
        gameInstanceRef.current = null;
      }
    };
  }, [w, h]); // Only recreate when dimensions change

  return <div ref={gameRef} style={{ width: w, height: h }} />;
};

export default Game;