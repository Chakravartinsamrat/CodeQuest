
import { useState, useEffect, useRef } from 'react';
import { questions as generateQuestions } from './components/Ai/Generate/generateQuote';
import { AnswerAnalyiser } from './components/Ai/Generate/AnalyseAnswer.js';

export default function ChallengeInterface({ topic, level, onClose }) {
  console.log("topic in challenge interface", topic);
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

  // Refs
  const chatContainerRef = useRef(null);
  const audioRef = useRef(null);

  // Sound effects
  const soundEffects = {
    correct: "https://cdn.freesound.org/previews/320/320181_5260872-lq.mp3",
    wrong: "https://cdn.freesound.org/previews/277/277025_5363851-lq.mp3",
    complete: "https://cdn.freesound.org/previews/270/270404_5123851-lq.mp3",
    buttonClick: "https://cdn.freesound.org/previews/242/242501_4284968-lq.mp3"
  };

  // Fetch questions when component mounts
  useEffect(() => {
    const fetchQuestions = async () => {
      setIsLoading(true);
      try {
        const data = await generateQuestions(topic,level , 5);
        console.log("questions data", data);
        setQuestions(data);
        setIsLoading(false);
        
        // Add the first question to the conversation
        if (data > 0) {
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
          setTimeout(() => {
            playSound("complete");
            const finalScore = score + 1;
            const message = getFinalMessage(finalScore, questions.length);
            addMessage('opponent', message);
            setChallengeComplete(true);
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

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900">
      {/* Feedback Animation */}
      {showFeedback && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className={`text-9xl animate-pulse ${feedbackType === 'correct' ? 'text-green-500' : 'text-red-500'}`}>
            {feedbackType === 'correct' ? '✓' : '✗'}
          </div>
        </div>
      )}
      
      <div className="bg-gray-900 border-2 border-indigo-800 rounded-lg w-full max-w-4xl flex flex-col overflow-hidden shadow-xl max-h-screen">
        <div className="bg-indigo-900 text-white p-4 font-bold text-xl flex justify-between items-center border-b-2 border-indigo-700">
          <div className="flex items-center">
            <span className="mr-2 text-yellow-300 flex items-center">
              <span className="text-2xl mr-1">⚔️</span> Challenge: {topic} ⚔️ Level: {level}
            </span>
          </div>
          
          <div className="flex items-center">
            <div className="mr-4 flex items-center bg-gray-800 px-3 py-1 rounded-full">
              <span className="text-yellow-400 font-bold mr-1">★</span>
              <span className="text-yellow-100">Score: {score}</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-row h-96 overflow-hidden">
          {/* Left Side: Conversation Section */}
          <div className="w-1/2 p-4 bg-gray-800 flex flex-col">
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
                        : 'bg-gray-200 text-black'
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
                disabled={isLoading || challengeComplete}
              />
              <button 
                onClick={handleSubmit} 
                className={`${isLoading || challengeComplete 
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'} text-white px-6 py-2 rounded-r-lg`}
                disabled={isLoading || challengeComplete}
              >
                Send
              </button>
            </div>
          </div>
          
          {/* Right Side: Content Section */}
          <div className="w-1/2 p-4 bg-gray-900 flex flex-col">
            <h2 className="text-lg font-bold text-white mb-2">Question</h2>
            
            <div className="flex-grow bg-gray-800 rounded-lg p-6 flex flex-col items-center justify-center overflow-auto">
              {isLoading ? (
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                  <p className="text-gray-300">Loading questions...</p>
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
                  {challengeComplete && (
                    <div className="bg-indigo-900 border border-blue-700 text-blue-100 px-4 py-6 rounded-lg">
                      <div className="font-bold text-2xl mb-3">
                        Challenge Complete!
                      </div>
                      <div className="text-xl">
                        Your final score:
                        <div className="mt-2 text-3xl font-bold">
                          <span className="text-yellow-300">{score}</span>
                          <span className="text-gray-400"> / </span>
                          <span>{questions.length}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Progress Bar */}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}