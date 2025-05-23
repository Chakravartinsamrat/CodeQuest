import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import Challengeinterface from './ChallengeInterface.jsx';
import LearningScene from './LearningInterface.jsx';
import GymInterface from './GymInterface.jsx';
import GruntInterface from './GruntInterface';
import TournamentScene from './TournamentInterface.jsx';
import { ClerkProvider, PUBLISHABLE_KEY } from './config/clerkConfig.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/" CLERK_SIGN_IN_FORCE_REDIRECT_URL="/check-profile"
  CLERK_SIGN_UP_FORCE_REDIRECT_URL="/check-profile">
      <App />
    </ClerkProvider>
  </StrictMode>
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
window.showLearningInterface = ({topic, level}) => {
  const challengeReactRoot = createRoot(challengeRoot);
  challengeReactRoot.render(
    <LearningScene topic={topic} level={level}
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
window.showGymInterface = ({ topic, level }) => {
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
window.showGruntInterface = ({ topic, level, npcID, xpgained }) => {  // Change npcId to npcID
  const challengeReactRoot = createRoot(challengeRoot);
  console.log("topic, level, npcID, xpgained: ", topic, level, npcID, xpgained)  // Change npcId to npcID
  challengeReactRoot.render(
    <GruntInterface
      topic={topic}
      level={level}
      npcID={npcID}  // This was already correct
      xpgained={xpgained}
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

