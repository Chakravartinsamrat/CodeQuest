import { useState, useRef, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Game from "./components/Game";
import Home from "./pages/Home/Home";

function App() {
  const gameContainerRef = useRef(null);
  const [w, setW] = useState(1200);
  const [h, setH] = useState(800);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Add event listener for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
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
      <h1 class="text-3xl font-bold underline">
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/game"
              element={
                <div>
                  <button
                    onClick={toggleFullScreen}
                    className="fullscreen-button"
                  >
                    {isFullscreen ? "Exit Full Screen" : "Full Screen"}
                  </button>
                  <div ref={gameContainerRef} className="game-container">
                    <Game w={w} h={h} isFullscreen={isFullscreen} />
                  </div>
                </div>
              }
            />
          </Routes>
        </Router>
      </h1>
    </>
  );
}

export default App;
