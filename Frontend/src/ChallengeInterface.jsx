import { useState, useEffect, useRef } from 'react';
import { questions as generateQuestions } from './components/Ai/Generate/generateQuote';
import { AnswerAnalyiser } from './components/Ai/Generate/AnalyseAnswer.js';

export default function TrainingInterface({ topic, level, onClose }) {
  console.log("topic in training interface", topic);
  // State variables
  const [conversation, setConversation] = useState([
    { speaker: 'trainer', text: 'Training session started! Let\'s strengthen your knowledge!' }
  ]);
  const [userInput, setUserInput] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0); 
  const [trainingComplete, setTrainingComplete] = useState(false);
  const [streak, setStreak] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState('');
  const [animateProgress, setAnimateProgress] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [xpGained, setXpGained] = useState(0);
  const [totalXp, setTotalXp] = useState(0);
  const [showXpAnimation, setShowXpAnimation] = useState(false);
  const [xpAmount, setXpAmount] = useState(0);

  // Refs
  const chatContainerRef = useRef(null);
  const audioRef = useRef(null);

  // Sound effects
  const soundEffects = {
    correct: "https://cdn.freesound.org/previews/320/320181_5260872-lq.mp3",
    wrong: "https://cdn.freesound.org/previews/277/277025_5363851-lq.mp3",
    complete: "https://cdn.freesound.org/previews/270/270404_5123851-lq.mp3",
    xpGain: "https://cdn.freesound.org/previews/162/162476_311243-lq.mp3",
    buttonClick: "https://cdn.freesound.org/previews/242/242501_4284968-lq.mp3"
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
        if (data && data.length > 0) {
          setConversation(prev => [
            ...prev, 
            { speaker: 'trainer', text: data[0].question }
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

  // Show XP gain animation
  const showXpGainAnimation = (amount) => {
    setXpAmount(amount);
    setShowXpAnimation(true);
    setTimeout(() => {
      setShowXpAnimation(false);
    }, 2000);
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

  // Calculate XP based on level, streak and correctness
  const calculateXp = (isCorrect, currentStreak, questionLevel) => {
    if (!isCorrect) return 0;
    
    // Base XP per correct answer depends on level
    const baseXp = questionLevel * 10;
    
    // Streak bonus (starts at streak 2)
    const streakMultiplier = currentStreak >= 2 ? 1 + (currentStreak * 0.1) : 1;
    
    // Calculate total XP
    const totalXpEarned = Math.round(baseXp * streakMultiplier);
    
    return totalXpEarned;
  };

  // Get final message
  const getFinalMessage = (score, total, totalXpGained) => {
    const percentage = (score / total) * 100;
    
    if (percentage === 100) {
      return `PERFECT TRAINING! Your score: ${score}/${total} and you earned ${totalXpGained} XP! 🏆`;
    } else if (percentage >= 80) {
      return `Training complete! Excellent work! Your score: ${score}/${total} with ${totalXpGained} XP earned! 🌟`;
    } else if (percentage >= 60) {
      return `Training complete! Well done! Your score: ${score}/${total} with ${totalXpGained} XP earned! ✨`;
    } else {
      return `Training complete! Your score: ${score}/${total} with ${totalXpGained} XP earned. Keep practicing! 💪`;
    }
  };

  const handleSubmit = async () => {
    if (!userInput.trim() || isLoading || questions.length === 0) return;
    
    // Play button click sound
    playSound("buttonClick");
    
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
        
        // Calculate and add XP
        const xpEarned = calculateXp(true, newStreak, level);
        setXpGained(prev => prev + xpEarned);
        setTotalXp(prev => prev + xpEarned);
        
        // Show XP animation
        showXpGainAnimation(xpEarned);
        
        // Play XP gain sound
        if (xpEarned > 0) {
          setTimeout(() => {
            playSound("xpGain");
          }, 500);
        }
        
        // Generate feedback based on streak
        let feedback = 'Correct!';
        if (newStreak >= 3) {
          feedback = getStreakMessage(newStreak);
        }
        
        addMessage('trainer', feedback);
        setScore(score + 1);
        
        // Animate progress bar
        setAnimateProgress(true);
        setTimeout(() => setAnimateProgress(false), 500);
        
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(current => current + 1);
          setTimeout(() => {
            addMessage('trainer', questions[currentQuestion + 1].question);
          }, 1200);
        } else {
          // Training complete
          setTimeout(() => {
            playSound("complete");
            const finalScore = score + 1;
            const message = getFinalMessage(finalScore, questions.length, xpGained + xpEarned);
            addMessage('trainer', message);
            setTrainingComplete(true);
          }, 1200);
        }
      } else {
        // Play sound effect
        playSound("wrong");
        
        // Show feedback
        showFeedbackAnimation('wrong');
        
        // Reset streak
        setStreak(0);
        
        addMessage('trainer', `Not quite. ${currentQ.hint}`);
      }
    }, 500);

    setUserInput('');
  };

  // Function to get training level name
  const getTrainingLevelName = (level) => {
    const levels = {
      1: "Novice",
      2: "Apprentice",
      3: "Adept",
      4: "Expert",
      5: "Master"
    };
    
    return levels[level] || `Level ${level}`;
  };

  return (
    <div className="fixed inset-0  flex items-center justify-center bg-transparent z-[1000]">
      {/* XP Gain Animation */}
      {showXpAnimation && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="text-4xl font-bold text-yellow-300 animate-bounce">
            +{xpAmount} XP
          </div>
        </div>
      )}
      
      {/* Feedback Animation */}
      {showFeedback && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className={`text-9xl animate-pulse ${feedbackType === 'correct' ? 'text-green-500' : 'text-red-500'}`}>
            {feedbackType === 'correct' ? '✓' : '✗'}
          </div>
        </div>
      )}
      
      <div className="bg-gray-900 border-2 border-blue-800 rounded-lg w-full max-w-4xl flex flex-col overflow-hidden shadow-xl max-h-screen">
        <div className="bg-blue-900 text-white p-4 font-bold text-xl flex justify-between items-center border-b-2 border-blue-700">
          <div className="flex items-center">
            <span className="mr-2 text-yellow-300 flex items-center">
              <span className="text-2xl mr-1">📚</span> Training: {topic} 📚 {getTrainingLevelName(level)}
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-gray-800 px-3 py-1 rounded-full">
              <span className="text-yellow-400 font-bold mr-1">★</span>
              <span className="text-yellow-100">Score: {score}</span>
            </div>
            
            <div className="flex items-center bg-gray-800 px-3 py-1 rounded-full">
              <span className="text-green-400 font-bold mr-1">✦</span>
              <span className="text-green-100">XP: {xpGained}</span>
            </div>
            
            <button 
              onClick={onClose} 
              className="text-gray-300 hover:text-red-300 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
        
        <div className="flex flex-row h-96 overflow-hidden">
          {/* Left Side: Conversation Section */}
          <div className="w-1/2 p-4 bg-gray-800 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold text-white">Training Session</h2>
              {streak >= 3 && (
                <div className="px-2 py-1 bg-orange-600 text-white rounded-full flex items-center">
                  <span className="text-yellow-300 mr-1">🔥</span> Streak: {streak}
                </div>
              )}
            </div>
            <div 
              ref={chatContainerRef}
              className="flex-grow bg-gray-700 rounded-lg p-4 overflow-y-auto mb-4"
            >
              {conversation.map((msg, index) => (
                <div 
                  key={index} 
                  className={`mb-4 ${msg.speaker === 'user' ? 'text-right' : 'text-left'}`}
                >
                  <div 
                    className={`inline-block rounded-lg px-4 py-2 max-w-xs ${
                      msg.speaker === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-teal-600 text-white'
                    }`}
                    style={msg.text.includes('\n') ? { whiteSpace: 'pre-wrap', textAlign: 'left' } : {}}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex bg-gray-900 rounded-lg p-1">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="flex-grow p-3 rounded-l-lg border-0 bg-gray-800 text-white"
                placeholder="Type your answer..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSubmit();
                  }
                }}
                disabled={isLoading || trainingComplete}
              />
              <button 
                onClick={handleSubmit} 
                className={`${isLoading || trainingComplete 
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'} text-white px-6 py-2 rounded-r-lg transition-colors`}
                disabled={isLoading || trainingComplete}
              >
                Send
              </button>
            </div>
          </div>
          
          {/* Right Side: Content Section */}
          <div className="w-1/2 p-4 bg-gray-900 flex flex-col">
            <h2 className="text-lg font-bold text-white mb-2">Exercise</h2>
            
            <div className="flex-grow bg-gray-800 rounded-lg p-6 flex flex-col items-center justify-center overflow-auto">
              {isLoading ? (
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                  <p className="text-gray-300">Preparing training exercises...</p>
                </div>
              ) : (
                <div className="text-center w-full">
                  <div className="text-2xl font-bold mb-4 text-white flex items-center justify-center">
                    <span className="bg-blue-700 text-white rounded-full w-10 h-10 flex items-center justify-center mr-2">
                      {currentQuestion + 1}
                    </span>
                    <span className="text-gray-400">of</span>
                    <span className="bg-gray-700 text-gray-300 rounded-full w-10 h-10 flex items-center justify-center ml-2">
                      {questions.length}
                    </span>
                  </div>
                  {questions.length > 0 && (
                    <div className="text-xl mb-6 text-gray-100 bg-gray-700 p-4 rounded-lg border-l-4 border-blue-500">
                      {questions[currentQuestion]?.question || ''}
                    </div>
                  )}
                  {trainingComplete && (
                    <div className="bg-blue-900 border border-blue-700 text-blue-100 px-4 py-6 rounded-lg">
                      <div className="font-bold text-2xl mb-3">
                        Training Complete!
                      </div>
                      <div className="text-xl mb-3">
                        Your final score:
                        <div className="mt-2 text-3xl font-bold">
                          <span className="text-yellow-300">{score}</span>
                          <span className="text-gray-400"> / </span>
                          <span>{questions.length}</span>
                        </div>
                      </div>
                      <div className="text-xl">
                        Experience gained:
                        <div className="mt-2 text-3xl font-bold text-green-300">
                          +{xpGained} XP
                        </div>
                      </div>
                      <button 
                        onClick={onClose}
                        className="mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full transition-colors"
                      >
                        Return to Training Hub
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Progress and XP Bar */}
            <div className="mt-4 bg-gray-800 p-3 rounded-lg text-white">
              <div className="flex justify-between">
                <div className="font-bold">Progress:</div>
                <div>{isLoading ? '...' : `${currentQuestion + 1} of ${questions.length}`}</div>
              </div>
              <div className="w-full bg-gray-900 rounded-full h-4 mt-2">
                <div 
                  className={`${
                    animateProgress ? 'bg-blue-500 animate-pulse' : 'bg-blue-600'
                  } h-4 rounded-full transition-all duration-1000`}
                  style={{ width: isLoading || questions.length === 0 
                    ? '0%' 
                    : `${((currentQuestion) / questions.length) * 100}%` }}
                ></div>
              </div>
              
              {/* XP Progress */}
              <div className="flex justify-between mt-3">
                <div className="font-bold text-green-400">Experience:</div>
                <div className="text-green-200">{xpGained} XP</div>
              </div>
              <div className="w-full bg-gray-900 rounded-full h-4 mt-2">
                <div 
                  className="bg-green-600 h-4 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min((xpGained / (level * 100)) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}