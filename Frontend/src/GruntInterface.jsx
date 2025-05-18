import { useState, useEffect, useRef } from 'react';
import { questions as generateQuestions } from './components/Ai/Generate/generateQuote';
import { AnswerAnalyiser } from './components/Ai/Generate/AnalyseAnswer.js';

export default function GruntInterface({ topic, level, onClose, npcID, xpgained }) {
  console.log("topic in challenge interface", topic);
  console.log("NPC ID:", npcID, "XP to be gained:", xpgained);
  
  // State variables
  const [conversation, setConversation] = useState([
    { speaker: 'opponent', text: 'Challenge activated! Prepare yourself, warrior!' }
  ]);
  const [userInput, setUserInput] = useState(''); 
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0); 
  const [challengeComplete, setChallengeComplete] = useState(false);
  const [streak, setStreak] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState('');
  const [animateProgress, setAnimateProgress] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [xpUpdated, setXpUpdated] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  // Refs
  const chatContainerRef = useRef(null);
  const audioRef = useRef(null);

  // Sound effects
  const soundEffects = {
    correct: "https://cdn.freesound.org/previews/320/320181_5260872-lq.mp3",
    wrong: "https://cdn.freesound.org/previews/277/277025_5363851-lq.mp3",
    complete: "https://cdn.freesound.org/previews/270/270404_5123851-lq.mp3",
    buttonClick: "https://cdn.freesound.org/previews/242/242501_4284968-lq.mp3",
    xpGain: "https://cdn.freesound.org/previews/456/456966_5121236-lq.mp3"
  };

  // Fetch user email from localStorage or session when component mounts
  useEffect(() => {
    // Get user email from localStorage or wherever it's stored in your app
    const email = localStorage.getItem('userEmail') || sessionStorage.getItem('userEmail');
    if (email) {
      setUserEmail(email);
    } else {
      console.warn("User email not found in storage!");
    }
  }, []);

  // Choose background based on topic
  const getBackgroundForTopic = (topic) => {
    const backgrounds = {
      'JavaScript': 'bg-gradient-to-r from-yellow-900 to-yellow-600 bg-opacity-90',
      'Python': 'bg-gradient-to-r from-blue-900 to-blue-600 bg-opacity-90',
      'React': 'bg-gradient-to-r from-blue-900 to-cyan-700 bg-opacity-90',
      'CSS': 'bg-gradient-to-r from-purple-900 to-blue-700 bg-opacity-90',
      'HTML': 'bg-gradient-to-r from-orange-900 to-red-700 bg-opacity-90',
      'Java': 'bg-gradient-to-r from-red-900 to-orange-700 bg-opacity-90',
      // Default background for other topics
      'default': 'bg-gradient-to-r from-indigo-900 to-purple-700 bg-opacity-90'
    };
    
    return backgrounds[topic] || backgrounds['default'];
  };

  // Scene elements based on topic
  const getSceneElements = (topic) => {
    const elements = {
      'JavaScript': (
        <>
          <div className="absolute top-10 left-10 text-8xl opacity-20 animate-pulse">{ }</div>
          <div className="absolute bottom-20 right-10 text-9xl opacity-10 animate-bounce">{ }</div>
          <div className="absolute top-1/4 right-1/4 text-7xl opacity-15 animate-spin">()</div>
          <div className="absolute top-2/3 left-1/3 text-6xl opacity-20 animate-pulse">;</div>
        </>
      ),
      'Python': (
        <>
          <div className="absolute top-20 left-20 text-8xl opacity-20 animate-pulse">🐍</div>
          <div className="absolute bottom-30 right-20 text-7xl opacity-15 animate-bounce">def</div>
          <div className="absolute top-1/3 right-1/3 text-6xl opacity-15 animate-spin">:</div>
          <div className="absolute bottom-1/4 left-1/4 text-7xl opacity-20 animate-pulse">for</div>
        </>
      ),
      'React': (
        <>
          <div className="absolute top-20 left-20 text-8xl opacity-20 animate-pulse">⚛️</div>
          <div className="absolute bottom-30 right-20 text-7xl opacity-15 animate-bounce">&lt;/&gt;</div>
          <div className="absolute top-1/3 right-1/3 text-6xl opacity-15 animate-spin">{ }</div>
          <div className="absolute bottom-1/4 left-1/4 text-7xl opacity-20 animate-pulse">JSX</div>
        </>
      ),
      // Add more scene elements for other topics
      'default': (
        <>
          <div className="absolute top-20 left-20 text-8xl opacity-20 animate-pulse">🌟</div>
          <div className="absolute bottom-30 right-20 text-7xl opacity-15 animate-bounce">✨</div>
          <div className="absolute top-1/3 right-1/3 text-6xl opacity-15 animate-spin">💻</div>
          <div className="absolute bottom-1/4 left-1/4 text-7xl opacity-20 animate-pulse">🎯</div>
        </>
      )
    };
    
    return elements[topic] || elements['default'];
  };

  // Function to update XP via API call
  const updateXP = async () => {
    if (!userEmail || !npcID || !xpgained || xpUpdated) {
      console.error("Cannot update XP. Missing data:", { userEmail, npcID, xpgained });
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/update-xp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          useremail: userEmail,
          xpgained: xpgained,
          npcID: npcID
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("XP updated successfully:", data);
        setXpUpdated(true);
        
        // Play XP gain sound
        playSound("xpGain");
        
        // Add XP gain message to conversation
        addMessage('opponent', `Congratulations! You've earned ${xpgained} XP from this battle!`);
        
        return data;
      } else {
        console.error("Failed to update XP:", response.statusText);
        return null;
      }
    } catch (error) {
      console.error("Error updating XP:", error);
      return null;
    }
  };

  // Fetch questions when component mounts
  useEffect(() => {
    const fetchQuestions = async () => {
      setIsLoading(true);
      try {
        const data = await generateQuestions(topic, level, 5);
        console.log("questions data", data);
        setQuestions(data);
        setIsLoading(false);
        
        // Add the first question to the conversation
        if (data.length > 0) {
          setConversation(prev => [
            ...prev, 
            { speaker: 'opponent', text: data[0].question }
          ]);
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
        setIsLoading(false);
      }
    };
    
    fetchQuestions();
    
    // Initialize audio element
    audioRef.current = new Audio();
    audioRef.current.volume = 0.3;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [topic, level]);

  // Play sound effect
  const playSound = (type) => {
    if (audioRef.current) {
      audioRef.current.src = soundEffects[type];
      audioRef.current.volume = 0.3;
      audioRef.current.play().catch(e => console.error("Error playing sound:", e));
    }
  };

  // Scroll chat to bottom when new messages come in
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [conversation]);

  // Add a new message to the conversation
  const addMessage = (speaker, text) => {
    setConversation(prev => [...prev, { speaker, text }]);
  };

  // Show feedback animation
  const showFeedbackAnimation = (type) => {
    setFeedbackType(type);
    setShowFeedback(true);
    setTimeout(() => {
      setShowFeedback(false);
    }, 1500);
  };

  // Get streak message
  const getStreakMessage = (streak) => {
    const messages = {
      3: "Excellent! You're on a roll! 🔥",
      4: "Impressive! Keep it up! ⚡",
      5: "Unstoppable! 🌟",
      6: "Legendary streak! 🏆",
      7: "Absolutely dominating! 💯",
      8: "Unbelievable mastery! 🔱",
      9: "Beyond legendary! 👑",
      10: "GODLIKE STREAK!!! 🌠"
    };
    
    return messages[Math.min(streak, 10)] || "PHENOMENAL!!! 🌈";
  };

  // Get final message
  const getFinalMessage = (score, total) => {
    const percentage = (score / total) * 100;
    
    if (percentage === 100) {
      return `PERFECT VICTORY! Your score: ${score}/${total} 🏆`;
    } else if (percentage >= 80) {
      return `Challenge complete! Excellent work! Your score: ${score}/${total} 🌟`;
    } else if (percentage >= 60) {
      return `Challenge complete! Well done! Your score: ${score}/${total} ✨`;
    } else {
      return `Challenge complete! Your score: ${score}/${total}. Keep practicing! 💪`;
    }
  };

  const handleSubmit = async () => {
    if (!userInput.trim() || isLoading || questions.length === 0) return;
    
    addMessage('user', userInput);
    const currentQ = questions[currentQuestion];
    
    // Use AI to analyze the answer
    let isCorrect = false;
    try {
      const analysisResult = await AnswerAnalyiser(
        Array.isArray(currentQ.answer) ? currentQ.answer[0] : currentQ.answer,
        userInput,
        level,
        currentQuestion
      );
      
      isCorrect = analysisResult === "YES";
    } catch (error) {
      console.error("Error analyzing answer:", error);
      // Fallback to exact match in case of API error
      isCorrect = Array.isArray(currentQ.answer) 
        ? currentQ.answer.some(ans => userInput.toLowerCase().trim() === ans.toLowerCase().trim())
        : userInput.toLowerCase().trim() === currentQ.answer.toLowerCase().trim();
    }

    setTimeout(() => {
      if (isCorrect) {
        // Play sound effect
        playSound("correct");
        
        // Show feedback
        showFeedbackAnimation('correct');
        
        // Update streak
        const newStreak = streak + 1;
        setStreak(newStreak);
        
        // Generate feedback based on streak
        let feedback = 'Correct!';
        if (newStreak >= 3) {
          feedback = getStreakMessage(newStreak);
        }
        
        addMessage('opponent', feedback);
        setScore(score + 1);
        
        // Animate progress bar
        setAnimateProgress(true);
        setTimeout(() => setAnimateProgress(false), 500);
        
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(current => current + 1);
          setTimeout(() => {
            addMessage('opponent', questions[currentQuestion + 1].question);
          }, 1200);
        } else {
          // Challenge complete
          setTimeout(async () => {
            playSound("complete");
            const finalScore = score + 1;
            const message = getFinalMessage(finalScore, questions.length);
            addMessage('opponent', message);
            setChallengeComplete(true);
            
            // If this is the last question and user passed, update XP
            if (finalScore >= questions.length / 2) {
              // We make the XP API call here
              await updateXP();
            } else {
              addMessage('opponent', "You need to score at least 50% to earn XP. Try again!");
            }
          }, 1200);
        }
      } else {
        // Play sound effect
        playSound("wrong");
        
        // Show feedback
        showFeedbackAnimation('wrong');
        
        // Reset streak
        setStreak(0);
        
        addMessage('opponent', `Not quite. ${currentQ.hint}`);
      }
    }, 500);

    setUserInput('');
  };

  // Handle the close button click
  const handleClose = () => {
    playSound("buttonClick");
    onClose();
  };

  // Get scene elements for the topic
  const sceneElements = getSceneElements(topic);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[1000]" style={{backgroundColor: 'rgba(0,0,0,0.7)'}}>
      {/* Feedback Animation */}
      {showFeedback && (
        <div className="fixed inset-0 flex items-center justify-center z-[1001] pointer-events-none">
          <div className={`text-9xl animate-pulse ${feedbackType === 'correct' ? 'text-green-500' : 'text-red-500'}`}>
            {feedbackType === 'correct' ? '✓' : '✗'}
          </div>
        </div>
      )}
      
      {/* Dynamic background elements based on topic */}
      <div className="absolute inset-0 z-[1001] pointer-events-none overflow-hidden">
        {sceneElements}
      </div>
      
      {/* Main container with transparent background - INCREASED WIDTH AND HEIGHT */}
      <div className="bg-gray-900 bg-opacity-80 backdrop-blur-sm border-2 border-indigo-700 rounded-lg w-full max-w-5xl flex flex-col overflow-hidden shadow-2xl max-h-[95vh] z-[1002]">
        {/* Header with topic and level */}
        <div className="bg-gradient-to-r from-indigo-900 to-black text-white p-4 font-bold text-xl flex justify-between items-center border-b-2 border-indigo-600">
          <div className="flex items-center">
            <span className="text-indigo-400 mr-2">⚔️</span>
            <span className="animate-pulse">CHALLENGE: {topic} • Level {level}</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="mr-4 flex items-center bg-gray-800 px-3 py-1 rounded-full">
              <span className="text-yellow-400 font-bold mr-1">★</span>
              <span className="text-yellow-100">Score: {score}</span>
            </div>
            {xpUpdated && (
              <div className="mr-4 flex items-center bg-green-800 px-3 py-1 rounded-full animate-pulse">
                <span className="text-green-400 font-bold mr-1">✓</span>
                <span className="text-green-100">XP +{xpgained}</span>
              </div>
            )}
            <button onClick={onClose} className="text-white hover:text-red-400">
              ✕
            </button>
          </div>
        </div>
        
        <div className="flex flex-row h-[calc(100%-4rem)] overflow-hidden">
          {/* Left Side: Conversation Section - INCREASED HEIGHT */}
          <div className="w-1/2 p-4 bg-gray-900 bg-opacity-60 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold text-white">Conversation</h2>
              {streak >= 3 && (
                <div className="px-2 py-1 bg-orange-600 text-white rounded-full flex items-center">
                  <span className="text-yellow-300 mr-1">🔥</span> Streak: {streak}
                </div>
              )}
            </div>
            <div 
              ref={chatContainerRef}
              className="flex-grow bg-gradient-to-b from-gray-900 to-gray-800 rounded-lg p-4 overflow-y-auto mb-4 border border-gray-700 min-h-[400px]"
            >
              {conversation.map((msg, index) => (
                <div 
                  key={index} 
                  className={`mb-4 ${msg.speaker === 'user' ? 'text-right' : 'text-left'}`}
                >
                  <div 
                    className={`inline-block rounded-lg px-4 py-2 max-w-[90%] ${
                      msg.speaker === 'user' 
                        ? 'bg-blue-900 text-blue-100 border border-blue-700' 
                        : 'bg-indigo-900 text-gray-100 border border-indigo-700'
                    }`}
                    style={msg.text.includes('\n') ? { whiteSpace: 'pre-wrap', textAlign: 'left' } : {}}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            
            {!challengeComplete ? (
              <div className="flex relative">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  className="flex-grow p-3 rounded-l-lg border-2 border-indigo-700 bg-gray-800 text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your answer..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSubmit();
                    }
                  }}
                  disabled={isLoading || challengeComplete}
                />
                <button 
                  onClick={handleSubmit} 
                  className={`${isLoading || challengeComplete 
                    ? 'bg-gray-600 cursor-not-allowed' 
                    : 'bg-indigo-700 hover:bg-indigo-600'} text-white px-6 py-3 rounded-r-lg transition-colors font-bold border-2 border-indigo-700`}
                  disabled={isLoading || challengeComplete}
                >
                  SUBMIT
                </button>
              </div>
            ) : (
              <button
                onClick={onClose}
                className="w-full p-3 rounded-lg font-bold shadow-lg flex items-center justify-center bg-green-700 text-white hover:bg-green-600 border-2 border-green-800"
              >
                <span className="mr-2">🏆</span> COMPLETE CHALLENGE
              </button>
            )}
          </div>
          
          {/* Right Side: Content Section - Quiz View - INCREASED HEIGHT */}
          <div className="w-1/2 p-4 bg-black bg-opacity-50 flex flex-col">
            <h2 className="text-lg font-bold mb-2 text-indigo-400 flex items-center">
              <span className="mr-2">❓</span> Knowledge Challenge
            </h2>
            
            <div className="flex-grow bg-gradient-to-b from-gray-900 to-gray-800 rounded-lg p-6 flex flex-col items-center justify-center border border-gray-700 shadow-inner min-h-[400px]">
              {isLoading ? (
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
                  <p className="text-gray-300">Preparing challenge questions...</p>
                </div>
              ) : (
                <div className="text-center w-full">
                  <div className="text-2xl font-bold mb-4 text-white flex items-center justify-center">
                    <span className="bg-indigo-700 text-white rounded-full w-10 h-10 flex items-center justify-center mr-2">
                      {currentQuestion + 1}
                    </span>
                    <span className="text-gray-400">of</span>
                    <span className="bg-gray-700 text-gray-300 rounded-full w-10 h-10 flex items-center justify-center ml-2">
                      {questions.length}
                    </span>
                  </div>
                  
                  {questions.length > 0 ? (
                    <div className="text-xl mb-6 text-gray-100 bg-gray-800 p-4 rounded-lg border-l-4 border-indigo-700">
                      {questions[currentQuestion]?.question || ''}
                    </div>
                  ) : (
                    <div className="text-xl mb-6 text-gray-300">
                      No questions available. The challenge awaits...
                    </div>
                  )}
                  
                  {challengeComplete && (
                    <div className="bg-indigo-900 border border-indigo-700 text-indigo-100 px-6 py-4 rounded-lg shadow-lg">
                      <div className="font-bold text-xl mb-2">
                        CHALLENGE COMPLETE!
                      </div>
                      <div className="text-lg mb-2">
                        You've conquered this challenge with a score of {score}/{questions.length}!
                      </div>
                      <div className="text-xl font-bold mt-3">
                        Final Score: {score}
                      </div>
                      {xpUpdated && (
                        <div className="bg-green-800 text-white px-4 py-2 rounded-lg mt-3 font-bold animate-pulse">
                          XP EARNED: +{xpgained}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4 bg-gray-800 p-3 rounded-lg text-white border border-gray-700">
              <div className="flex justify-between">
                <div className="font-bold text-indigo-400">CHALLENGE PROGRESS:</div>
                <div>{isLoading ? '...' : `Question ${currentQuestion + 1} of ${questions.length}`}</div>
              </div>
              <div className="w-full bg-black rounded-full h-4 mt-2 border border-gray-700">
                <div 
                  className={`bg-gradient-to-r from-indigo-900 via-blue-600 to-indigo-500 h-4 rounded-full transition-all duration-500 ease-out ${
                    animateProgress ? 'animate-pulse' : ''
                  }`}
                  style={{ width: `${isLoading || questions.length === 0 
                    ? '0%' 
                    : `${((currentQuestion) / questions.length) * 100}%`}` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add CSS for the floating animation
const styleTag = document.createElement('style');
styleTag.textContent = `
  @keyframes float {
    0% {
      transform: translateY(0) translateX(0);
    }
    25% {
      transform: translateY(-20px) translateX(10px);
    }
    50% {
      transform: translateY(0) translateX(25px);
    }
    75% {
      transform: translateY(20px) translateX(10px);
    }
    100% {
      transform: translateY(0) translateX(0);
    }
  }
`;
document.head.appendChild(styleTag);