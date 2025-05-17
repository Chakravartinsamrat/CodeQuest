import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import Challengeinterface from './Challengeinterface.jsx';
import LearningScene from './LearningInterface.jsx';
import GymInterface from './GymInterface.jsx';
import TournamentScene from './TournamentInterface.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

const challengeRoot = document.createElement('div');
challengeRoot.id = 'challenge-root';
document.body.appendChild(challengeRoot);

window.showChallengeInterface = () => {
  const challengeReactRoot = createRoot(challengeRoot);
  challengeReactRoot.render(
    <Challengeinterface
      onClose={() => {
        challengeReactRoot.unmount();
        const game = window.game;
        if (game && game.registry) {
          const currentScene = game.registry.get('currentScene');
          if (currentScene) {
            currentScene.scene.resume();
          }
        }
      }}
    />
  );
};
window.showLearningInterface = () => {
  const challengeReactRoot = createRoot(challengeRoot);
  challengeReactRoot.render(
    <LearningScene
      onClose={() => {
        challengeReactRoot.unmount();
        const game = window.game;
        if (game && game.registry) {
          const currentScene = game.registry.get('currentScene');
          if (currentScene) {
            currentScene.scene.resume();
          }
        }
      }}
    />
  );
};
window.showGymInterface = () => {
  const challengeReactRoot = createRoot(challengeRoot);
  challengeReactRoot.render(
    <GymInterface
      onClose={() => {
        challengeReactRoot.unmount();
        const game = window.game;
        if (game && game.registry) {
          const currentScene = game.registry.get('currentScene');
          if (currentScene) {
            currentScene.scene.resume();
          }
        }
      }}
    />
  );
};
window.showTournamentInterface = () => {
  const challengeReactRoot = createRoot(challengeRoot);
  challengeReactRoot.render(
    <TournamentScene
      onClose={() => {
        challengeReactRoot.unmount();
        const game = window.game;
        if (game && game.registry) {
          const currentScene = game.registry.get('currentScene');
          if (currentScene) {
            currentScene.scene.resume();
          }
        }
      }}
    />
  );
};