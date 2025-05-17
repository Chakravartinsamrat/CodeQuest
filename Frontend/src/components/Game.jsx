import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import MainScene from './GameScenes/MainScene.jsx';
import KnowledgeScene from './GameScenes/KnowledgeScne.jsx'; // Fixed typo
import ContentScene from './GameScenes/ContentScene.jsx';
import ChallengeScene from './GameScenes/ChallengeScene.jsx';
import MenuScene from './GameScenes/menuScene.jsx'; // Fixed casing
import TournamentScene from './GameScenes/TournamentScene.jsx';
import GymScene from './GameScenes/GymScene.jsx';

const Game = ({ w, h, isFullscreen }) => {
  const gameRef = useRef(null);
  const gameInstanceRef = useRef(null);
  
  // Get gameId from URL parameters
  const params = new URLSearchParams(window.location.search);
  const gameId = params.get('gameId') || 'DSA'; // Provide a default if none exists
  
  // Create state for gameId so it can be shared with scenes
  const [currentGameId, setCurrentGameId] = useState(gameId);
  
  console.log('Game ID from URL:', currentGameId);

  useEffect(() => {
    // Make gameId available globally for Phaser scenes
    window.gameId = currentGameId;
    
    // Game configuration
    const config = {
      type: Phaser.AUTO,
      width: w,
      height: h,
      parent: gameRef.current,
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
      // Add custom data to the game instance
      callbacks: {
        preBoot: (game) => {
          // Add gameId directly to the game instance
          game.gameId = currentGameId;
        }
      }
    };

    if (!gameInstanceRef.current) {
      // Create game instance
      gameInstanceRef.current = new Phaser.Game(config);
      
      // Add all scenes manually so we can pass data
      gameInstanceRef.current.scene.add('MainScene', MainScene);
      gameInstanceRef.current.scene.add('KnowledgeScene', KnowledgeScene);
      gameInstanceRef.current.scene.add('ContentScene', ContentScene);
      gameInstanceRef.current.scene.add('ChallengeScene', ChallengeScene);
      gameInstanceRef.current.scene.add('MenuScene', MenuScene);
      gameInstanceRef.current.scene.add('TournamentScene', TournamentScene);
      gameInstanceRef.current.scene.add('GymScene', GymScene);

      // Start MainScene with gameId parameter
      console.log('Starting MainScene with gameId:', currentGameId);
      gameInstanceRef.current.scene.start('MainScene', { gameId: currentGameId });
    } else {
      // Just resize if the game already exists
      gameInstanceRef.current.scale.resize(w, h);
    }

    // Cleanup function
    return () => {
      if (gameInstanceRef.current) {
        gameInstanceRef.current.destroy(true);
        gameInstanceRef.current = null;
      }
      // Clean up global variable
      delete window.gameId;
    };
  }, [w, h, currentGameId]); // Add currentGameId as dependency

  return <div ref={gameRef} style={{ width: w, height: h }} />;
};

export default Game;