
import { useState, useEffect, useRef } from 'react';
import { questions as generateQuestions } from './components/Ai/Generate/generateQuote';
import { AnswerAnalyiser } from './components/Ai/Generate/AnalyseAnswer.js';

export default function EpicBossChallenge({ onClose }) {
  // State variables
  const [conversation, setConversation] = useState([
    { speaker: 'boss', text: 'Welcome, challenger... Are you prepared to face your final test?' }
  ]);
  const [topic, setTopic] = useState(window.gameId);
  const [isLoading, setIsLoading] = useState(true);
  const [userInput, setUserInput] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [challengeComplete, setChallengeComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [timerRunning, setTimerRunning] = useState(true);
  const [bossHealth, setBossHealth] = useState(100);
  const [playerHealth, setPlayerHealth] = useState(100);
  const [showDamageEffect, setShowDamageEffect] = useState(false);
  const [showHealEffect, setShowHealEffect] = useState(false);
  const [bossAttackAnimation, setBossAttackAnimation] = useState(false);
  const [showBossEntrance, setShowBossEntrance] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [streak, setStreak] = useState(0);
  const [points, setPoints] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState('');

  // Refs
  const chatContainerRef = useRef(null);
  const audioRef = useRef(null);

  // Sound effects
  const soundEffects = {
    correct: "https://cdn.freesound.org/previews/320/320181_5260872-lq.mp3",
    wrong: "https://cdn.freesound.org/previews/277/277025_5363851-lq.mp3",
    complete: "https://cdn.freesound.org/previews/270/270404_5123851-lq.mp3",
    buttonClick: "https://cdn.freesound.org/previews/242/242501_4284968-lq.mp3",
    bossEntrance: "https://cdn.freesound.org/previews/366/366107_5563877-lq.mp3",
    playerDamage: "https://cdn.freesound.org/previews/344/344775_6195668-lq.mp3",
    bossDamage: "https://cdn.freesound.org/previews/75/75235_35187-lq.mp3",
    victory: "https://cdn.freesound.org/previews/456/456963_5563877-lq.mp3",
    defeat: "https://cdn.freesound.org/previews/76/76376_871591-lq.mp3"
  };

  // Fetch questions when component mounts
  useEffect(() => {
    const fetchQuestions = async () => {
      setIsLoading(true);
      try {
        // Get topic from window.gameId
        const currentTopic = window.gameId || "JavaScript";
        setTopic(currentTopic);
        
        // Generate questions
        const data = await generateQuestions(currentTopic, 7, 5);
        console.log("questions data", data);
        
        if (Array.isArray(data) && data.length > 0) {
          setQuestions(data);
          // First question will be added in the boss entrance timeout
        } else {
          console.error("Invalid questions data format");
          // Fallback handling
          addMessage('boss', "My questions aren't ready yet. Let's begin with something simple...");
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
        // Fallback handling
        addMessage('boss', "My questions aren't ready yet. Let's begin with something simple...");
      } finally {
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
  }, []);

  // Scroll chat to bottom when new messages come in
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [conversation]);

  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Play sound effect
  const playSound = (type) => {
    if (audioRef.current) {
      audioRef.current.src = soundEffects[type];
      audioRef.current.volume = 0.3;
      audioRef.current.play().catch(e => console.error("Error playing sound:", e));
    }
  };

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
      3: "Impressive! You're on a hot streak! 🔥",
      4: "Masterful! Keep it up! ⚡",
      5: "Unstoppable! The boss fears your knowledge! 🌟",
      6: "Legendary streak! 🏆",
      7: "Absolutely dominating! 💯",
      8: "Unbelievable mastery! 🔱",
      9: "Beyond legendary! 👑",
      10: "GODLIKE STREAK!!! 🌠"
    };
    
    return messages[Math.min(streak, 10)] || "PHENOMENAL!!! 🌈";
  };

  // Boss attack
  const bossAttack = () => {
    setBossAttackAnimation(true);
    setTimeout(() => {
      setBossAttackAnimation(false);
      setShowDamageEffect(true);
      playSound('playerDamage');
      setPlayerHealth(prev => Math.max(prev - 15, 0));
      setTimeout(() => setShowDamageEffect(false), 300);
    }, 500);
  };

  // Player attack
  const damageTheBoss = (streakBonus = 0) => {
    setShowHealEffect(true);
    playSound('bossDamage');
    
    // Base damage plus streak bonus
    const baseDamage = Math.floor(Math.random() * 10) + 10; // 10-20 base damage
    const damage = baseDamage + (streakBonus * 2); // Each streak level adds 2 damage
    
    setBossHealth(prev => Math.max(prev - damage, 0));
    setTimeout(() => setShowHealEffect(false), 300);
    
    return damage;
  };

  // Handle user input submission
  const handleSubmit = async () => {
    if (!userInput.trim() || isLoading || questions.length === 0 || challengeComplete) return;
    
    addMessage('user', userInput);
    
    // Get the current question
    const currentQ = questions[currentQuestion];
    
    // Use AI to analyze the answer
    let isCorrect = false;
    try {
      const analysisResult = await AnswerAnalyiser(
        Array.isArray(currentQ.answer) ? currentQ.answer[0] : currentQ.answer,
        userInput,
        7, // Using level 7 for boss challenge
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
        
        // Calculate points - base 10 points + streak bonus
        const streakBonus = Math.min(newStreak - 1, 5) * 5; // 0, 5, 10, 15, 20, 25 max
        const newPoints = points + 10 + streakBonus;
        setPoints(newPoints);
        
        // Deal damage with streak bonus
        const damage = damageTheBoss(Math.min(newStreak, 5));
        
        // Generate feedback based on streak
        let feedback = `Correct! You dealt ${damage} damage!`;
        if (newStreak >= 3) {
          feedback = `${getStreakMessage(newStreak)} You dealt ${damage} damage!`;
        }
        
        addMessage('boss', feedback);
        setScore(score + 1);
        
        // Check if boss is defeated
        if (bossHealth - damage <= 0) {
          setTimeout(() => {
            addMessage('boss', `IMPOSSIBLE! I... I've been defeated! Your final score: ${score + 1}/${questions.length}`);
            setChallengeComplete(true);
            setTimerRunning(false);
            playSound('victory');
          }, 1000);
          return;
        }
        
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(current => current + 1);
          setTimeout(() => {
            addMessage('boss', questions[currentQuestion + 1].question);
          }, 1200);
        } else {
          // Challenge complete
          setTimeout(() => {
            playSound("complete");
            const finalScore = score + 1;
            addMessage('boss', `You have... defeated me! Final score: ${finalScore}/${questions.length} and earned ${newPoints} points!`);
            setChallengeComplete(true);
            setTimerRunning(false);
          }, 1200);
        }
      } else {
        // Play sound effect
        playSound("wrong");
        
        // Show feedback
        showFeedbackAnimation('wrong');
        
        // Reset streak
        setStreak(0);
        
        addMessage('boss', `WRONG! ${currentQ.hint || "Think harder, challenger!"}`);
        bossAttack();
        
        if (playerHealth <= 15) {
          setTimeout(() => {
            addMessage('boss', 'You have been defeated! Try again if you dare!');
            setChallengeComplete(true);
            setTimerRunning(false);
            playSound('defeat');
          }, 1000);
        }
      }
    }, 500);

    setUserInput('');
  };

  // Timer effect
  useEffect(() => {
    let interval;
    if (timerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            addMessage('boss', 'Time\'s up! You have failed!');
            setChallengeComplete(true);
            playSound('defeat');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timeLeft]);

  // Capture spacebar presses in the interface
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === ' ' || e.code === 'Space') {
        // If interface is active and input is focused, use spacebar for input
        if (document.activeElement === document.getElementById('bossInputField')) {
          // Let the input field handle the spacebar
          return;
        } else {
          // Otherwise, prevent the spacebar from triggering game events
          // and use it to submit if appropriate
          e.preventDefault();
          if (!challengeComplete && userInput.trim()) {
            handleSubmit();
          }
        }
      }
    };

    // Add event listener
    window.addEventListener('keydown', handleKeyPress);

    // Notify the game that the interface is active
    if (window.interfaceActive) {
      window.interfaceActive(true);
    }

    // Cleanup function
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      // Notify the game that the interface is inactive
      if (window.interfaceActive) {
        window.interfaceActive(false);
      }
    };
  }, [userInput, challengeComplete]);

  // Boss entrance animation effect
  useEffect(() => {
    setTimeout(() => {
      setShowBossEntrance(false);
      playSound('bossEntrance');
      
      // Add the first question after entrance animation
      if (questions.length > 0) {
        setTimeout(() => {
          addMessage('boss', questions[0].question);
        }, 500);
      }
    }, 2000);
  }, [questions]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[1000]" style={{backgroundColor: 'rgba(0,0,0,0.9)'}}>
      {/* Feedback Animation */}
      {showFeedback && (
        <div className="fixed inset-0 flex items-center justify-center z-[1001] pointer-events-none">
          <div className={`text-9xl animate-pulse ${feedbackType === 'correct' ? 'text-green-500' : 'text-red-500'}`}>
            {feedbackType === 'correct' ? '✓' : '✗'}
          </div>
        </div>
      )}
      
      {showBossEntrance && (
        <div className="absolute inset-0 flex items-center justify-center bg-black z-[1001]">
          <div className="text-red-600 text-6xl font-bold animate-pulse">
            FINAL BOSS APPROACHING
          </div>
        </div>
      )}
      
      <div className="bg-gray-900 border-2 border-red-600 rounded-lg w-full max-w-5xl flex flex-col overflow-hidden shadow-2xl max-h-[90vh] relative">
        {/* Epic header with timer */}
        <div className="bg-gradient-to-r from-red-900 to-black text-white p-4 font-bold text-xl flex justify-between items-center border-b-2 border-red-700">
          <div className="flex items-center">
            <span className="text-red-400 mr-2">⚔️</span>
            <span className="animate-pulse">FINAL BOSS CHALLENGE: {topic}</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="mr-4 flex items-center bg-gray-800 px-3 py-1 rounded-full">
              <span className="text-yellow-400 font-bold mr-1">★</span>
              <span className="text-yellow-100">Points: {points}</span>
            </div>
            {!challengeComplete && (
              <div className={`font-mono text-xl ${timeLeft < 60 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
                ⏱️ {formatTime(timeLeft)}
              </div>
            )}
            <button onClick={onClose} className="text-white hover:text-red-400">
              ✕
            </button>
          </div>
        </div>
        
        {/* Health Bars */}
        <div className="bg-gray-900 p-2 flex justify-between items-center px-4">
          <div className="w-5/12">
            <div className="text-green-400 font-bold flex justify-between">
              <span>YOUR HP</span>
              <span>{playerHealth}/100</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-4 mt-1 border border-gray-700">
              <div 
                className={`bg-gradient-to-r from-green-700 to-green-400 h-full rounded-full transition-all duration-300 ease-out ${showDamageEffect ? 'animate-pulse' : ''}`}
                style={{ width: `${playerHealth}%` }}
              ></div>
            </div>
          </div>
          
          <div className="w-5/12">
            <div className="text-red-400 font-bold flex justify-between">
              <span>BOSS HP</span>
              <span>{bossHealth}/100</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-4 mt-1 border border-gray-700">
              <div 
                className={`bg-gradient-to-r from-red-900 to-red-600 h-full rounded-full transition-all duration-300 ease-out ${showHealEffect ? 'animate-pulse' : ''}`}
                style={{ width: `${bossHealth}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-row h-[calc(100%-8rem)] overflow-hidden">
          {/* Left Side: Conversation Section */}
          <div className="w-1/2 p-4 bg-gray-900 flex flex-col">
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
              className={`flex-grow bg-gradient-to-b from-gray-900 to-gray-800 rounded-lg p-4 overflow-y-auto mb-4 border border-gray-700 ${bossAttackAnimation ? 'animate-pulse' : ''}`}
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
                        : 'bg-red-900 text-gray-100 border border-red-700'
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
                  id="bossInputField"
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  className="flex-grow p-3 rounded-l-lg border-2 border-blue-700 bg-gray-800 text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your answer to survive..."
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
                    : 'bg-blue-700 hover:bg-blue-600'} text-white px-6 py-3 rounded-r-lg transition-colors font-bold border-2 border-blue-700`}
                  disabled={isLoading || challengeComplete}
                >
                  SUBMIT
                </button>
              </div>
            ) : (
              <button
                onClick={onClose}
                className={`w-full p-3 rounded-lg font-bold shadow-lg flex items-center justify-center ${
                  bossHealth <= 0 
                    ? 'bg-green-700 text-white hover:bg-green-600 border-2 border-green-800' 
                    : 'bg-red-700 text-white hover:bg-red-600 border-2 border-red-800'
                }`}
              >
                {bossHealth <= 0 ? (
                  <>
                    <span className="mr-2">🏆</span> CLAIM YOUR VICTORY
                  </>
                ) : (
                  <>
                    <span className="mr-2">☠️</span> RETREAT
                  </>
                )}
              </button>
            )}
          </div>
          
          {/* Right Side: Content Section - Quiz View */}
          <div className="w-1/2 p-4 bg-black flex flex-col">
            <h2 className="text-lg font-bold mb-2 text-red-400 flex items-center">
              <span className="mr-2">❓</span> Knowledge Challenge
            </h2>
            
            <div className="flex-grow bg-gradient-to-b from-gray-900 to-gray-800 rounded-lg p-6 flex flex-col items-center justify-center border border-gray-700 shadow-inner">
              {isLoading ? (
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mb-4"></div>
                  <p className="text-gray-300">Preparing boss challenge questions...</p>
                </div>
              ) : (
                <div className="text-center w-full">
                  {questions.length > 0 ? (
                    <>
                      <div className="text-2xl font-bold mb-4 text-red-400 flex items-center justify-center">
                        <span className="bg-red-900 text-white rounded-full w-10 h-10 flex items-center justify-center mr-2">
                          {currentQuestion + 1}
                        </span>
                        <span className="text-gray-400">of</span>
                        <span className="bg-gray-800 text-gray-300 rounded-full w-10 h-10 flex items-center justify-center ml-2">
                          {questions.length}
                        </span>
                      </div>
                      <div className="text-xl mb-6 text-gray-100 bg-gray-800 p-4 rounded-lg border-l-4 border-red-700">
                        {questions[currentQuestion]?.question || ''}
                      </div>
                    </>
                  ) : (
                    <div className="text-xl mb-6 text-gray-300">
                      No questions available. The boss awaits...
                    </div>
                  )}
                  
                  {challengeComplete && (
                    <div className={`${
                      bossHealth <= 0 
                        ? 'bg-green-900 border border-green-700 text-green-100' 
                        : 'bg-red-900 border border-red-700 text-red-100'
                    } px-6 py-4 rounded-lg shadow-lg`}>
                      <div className="font-bold text-xl mb-2">
                        {bossHealth <= 0 ? 'VICTORY!' : 'DEFEAT!'}
                      </div>
                      <div className="text-lg mb-2">
                        {bossHealth <= 0 
                          ? `You've conquered the final boss with a score of ${score}/${questions.length}!` 
                          : 'The boss has defeated you! Train harder and return for vengeance!'
                        }
                      </div>
                      <div className="text-xl font-bold mt-3">
                        Total Points: {points}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4 bg-gray-800 p-3 rounded-lg text-white border border-gray-700">
              <div className="flex justify-between">
                <div className="font-bold text-red-400">BOSS BATTLE PROGRESS:</div>
                <div>{isLoading ? '...' : `${currentQuestion + 1} of ${questions.length}`}</div>
              </div>
              <div className="w-full bg-black rounded-full h-4 mt-2 border border-gray-700">
                <div 
                  className="bg-gradient-to-r from-red-900 via-orange-600 to-yellow-500 h-4 rounded-full transition-all duration-500 ease-out"
                  style={{ width: questions.length === 0 
                    ? '0%' 
                    : `${((currentQuestion) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}