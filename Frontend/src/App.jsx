import { useState, useRef, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Game from "./components/Game";
import Home from "./pages/Home/Home";
import { RedirectToSignIn, SignedIn, SignedOut, useUser } from "@clerk/clerk-react";
import { useClerk } from "@clerk/clerk-react";

import CheckProfile from "./pages/CheckProfile";
import Profile from "./pages/profile";

function App() {

  const gameContainerRef = useRef(null);
  const [w, setW] = useState(window.innerWidth);
  const [h, setH] = useState(window.innerHeight);
  const [isFullscreen, setIsFullscreen] = useState(false);


  // Add event listener for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      console.log("app")
      const fullscreenActive = !!document.fullscreenElement;
      setIsFullscreen(fullscreenActive);

      
      // if (fullscreenActive) {
      //   setW(window.innerWidth);
      //   setH(window.innerHeight);
      // } else {
      //   setW(800); // Reset to default
      //   setH(600); // Reset to default
      // }

      setW(window.innerWidth);
      setH(window.innerHeight);
    };

    // Listen for fullscreen change event
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    // Cleanup
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      // Enter full-screen mode
      gameContainerRef.current.requestFullscreen().catch((err) => {
        console.error(`Error enabling full-screen: ${err.message}`);
      });
    } else {
      // Exit full-screen mode
      document.exitFullscreen();
    }
  };

  return (
    <>

      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/game"
            element={
              <div>
                {/* <button
                    onClick={toggleFullScreen}
                    className="fullscreen-button"
                  >
                    {isFullscreen ? "Exit Full Screen" : "Full Screen"}
                  </button> */}
                <div ref={gameContainerRef} className="game-container">
                  <Game w={w} h={h} isFullscreen={isFullscreen} />
                </div>
              </div>
            }
          />
          <Route
            path="/profile"
            element={
              <SignedIn>
                <Profile />
              </SignedIn>
            }
          />
          <Route
            path="/profile"
            element={
              <SignedIn>
                  <Profile />
              </SignedIn>
            }  />
            
              {/* Open to all (or protected in main.tsx on redirect) */ }
             
          <Route path="/check-profile" element={<CheckProfile />} />

        </Routes>
      </Router>

    </>
  );
}

export default App;
