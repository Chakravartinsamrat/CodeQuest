import { useState, useEffect, useRef } from 'react';

export default function ChallengeInterface() {
  // State variables
  const [conversation, setConversation] = useState([
    { speaker: 'opponent', text: 'Challenge activated! Prepare yourself, warrior!' }
  ]);
  const [userInput, setUserInput] = useState('');
  const [codeInput, setCodeInput] = useState('// Write your code here');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [challengeComplete, setChallengeComplete] = useState(false);
  const [subjectType, setSubjectType] = useState('math'); // Default subject
  const [streak, setStreak] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState('');
  const [animateProgress, setAnimateProgress] = useState(false);
  
  // Refs
  const chatContainerRef = useRef(null);
  const audioRef = useRef(null);

  // Define different subject types with icons
  const subjects = [
    { id: 'math', name: 'Math', icon: '🔢' },
    { id: 'physics', name: 'Physics', icon: '⚛️' },
    { id: 'english', name: 'English', icon: '📚' },
    { id: 'computer science', name: 'Coding', icon: '💻' }
  ];

  // Sample questions for different subjects
  const questionsBySubject = {
    math: [
      {
        question: "What's 7 × 8?",
        answer: "56",
        hint: "Think of it as 7 × 7 + 7",
        difficulty: "easy"
      },
      {
        question: "Solve for x: 3x + 5 = 20",
        answer: "5",
        hint: "Subtract 5 from both sides, then divide by 3",
        difficulty: "medium"
      },
      {
        question: "What's the area of a circle with radius 4?",
        answer: ["50.27", "50.3", "50.26548", "16π"],
        hint: "Use the formula πr²",
        difficulty: "hard"
      }
    ],
    physics: [
      {
        question: "What is Newton's Second Law?",
        answer: ["f=ma", "force equals mass times acceleration", "force = mass × acceleration"],
        hint: "It relates force, mass, and acceleration",
        difficulty: "medium"
      },
      {
        question: "What is the SI unit of electric current?",
        answer: "ampere",
        hint: "It starts with 'A'",
        difficulty: "easy"
      },
      {
        question: "What is the speed of light in a vacuum (in m/s)?",
        answer: ["299792458", "3e8", "300000000"],
        hint: "It's approximately 3×10⁸ m/s",
        difficulty: "hard"
      }
    ],
    english: [
      {
        question: "Who wrote 'Romeo and Juliet'?",
        answer: ["shakespeare", "william shakespeare"],
        hint: "He's often called the Bard of Avon",
        difficulty: "easy"
      },
      {
        question: "What's the opposite of 'benevolent'?",
        answer: ["malevolent", "malicious", "cruel"],
        hint: "It starts with 'mal-'",
        difficulty: "medium"
      },
      {
        question: "What figure of speech is 'The cloud danced across the sky'?",
        answer: ["personification", "metaphor"],
        hint: "It gives human qualities to a non-human thing",
        difficulty: "hard"
      }
    ],
    "computer science": [
      {
        question: "Write a function that returns the sum of two numbers.",
        testCases: [
          { inputs: [5, 3], expected: 8 },
          { inputs: [-1, 1], expected: 0 }
        ],
        starterCode: "function sum(a, b) {\n  // Your code here\n}",
        hint: "Make sure to return the result of a + b",
        difficulty: "easy"
      },
      {
        question: "Write a function that returns true if a string is a palindrome, false otherwise.",
        testCases: [
          { inputs: ["racecar"], expected: true },
          { inputs: ["hello"], expected: false }
        ],
        starterCode: "function isPalindrome(str) {\n  // Your code here\n}",
        hint: "Try comparing characters from opposite ends",
        difficulty: "medium"
      },
      {
        question: "Write a function that returns the factorial of a number.",
        testCases: [
          { inputs: [5], expected: 120 },
          { inputs: [0], expected: 1 }
        ],
        starterCode: "function factorial(n) {\n  // Your code here\n}",
        hint: "Remember that 0! = 1, and n! = n × (n-1)!",
        difficulty: "hard"
      }
    ]
  };

  // Sound effects
  const soundEffects = {
    correct: "https://cdn.freesound.org/previews/320/320181_5260872-lq.mp3",
    wrong: "https://cdn.freesound.org/previews/277/277025_5363851-lq.mp3",
    complete: "https://cdn.freesound.org/previews/270/270404_5123851-lq.mp3",
    buttonClick: "https://cdn.freesound.org/previews/242/242501_4284968-lq.mp3",
    typing: "https://cdn.freesound.org/previews/240/240777_4284968-lq.mp3"
  };

  // Play sound effect
  const playSound = (type) => {
    if (audioRef.current) {
      audioRef.current.src = soundEffects[type];
      audioRef.current.volume = 0.3;
      audioRef.current.play().catch(e => console.error("Error playing sound:", e));
    }
  };

  const [questions, setQuestions] = useState(questionsBySubject.math);

  // Scroll chat to bottom when new messages come in
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [conversation]);

  // Change subject
  const changeSubject = (subject) => {
    playSound("buttonClick");
    
    setSubjectType(subject);
    setQuestions(questionsBySubject[subject]);
    setCurrentQuestion(0);
    setScore(0);
    setStreak(0);
    setChallengeComplete(false);
    setConversation([
      { speaker: 'opponent', text: `${getRandomGreeting()} ${subject} challenge! Are you ready?` }
    ]);
    
    setTimeout(() => {
      addMessage('opponent', questionsBySubject[subject][0].question);
    }, 1000);

    if (subject === 'computer science') {
      setCodeInput(questionsBySubject[subject][0].starterCode);
    }
  };

  // Random greeting messages
  const getRandomGreeting = () => {
    const greetings = [
      "Welcome to the",
      "Prepare for the", 
      "Let's test your skills in the",
      "Time to prove yourself in the",
      "Your challenge awaits in the"
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
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

  // Handle user input submission for regular quizzes
  const handleSubmit = () => {
    if (!userInput.trim()) return;

    // Add user message to conversation
    addMessage('user', userInput);

    // Check if answer is correct
    const currentQ = questions[currentQuestion];
    const isCorrect = Array.isArray(currentQ.answer) 
      ? currentQ.answer.some(ans => userInput.toLowerCase().trim() === ans.toLowerCase().trim())
      : userInput.toLowerCase().trim() === currentQ.answer.toLowerCase().trim();

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

  // Handle code submission
  const handleCodeSubmit = () => {
    playSound("buttonClick");
    
    // Add user code to conversation (shortened version)
    const codeSnippet = codeInput.length > 50 
      ? codeInput.substring(0, 50) + '...' 
      : codeInput;
    addMessage('user', `[CODE SUBMISSION]: ${codeSnippet}`);

    const currentQ = questions[currentQuestion];

    try {
      // Create a function from code string
      const evalCode = `
        ${codeInput};
        ${codeInput.split('function ')[1].split('(')[0]}
      `;
      
      const func = new Function('return ' + evalCode)();
      
      // Run test cases
      let allPassed = true;
      const results = [];
      
      currentQ.testCases.forEach((testCase, idx) => {
        try {
          const result = func(...testCase.inputs);
          const passed = result === testCase.expected;
          results.push({ passed, result, expected: testCase.expected });
          if (!passed) allPassed = false;
        } catch (err) {
          results.push({ passed: false, error: err.message });
          allPassed = false;
        }
      });
      
      // Format results message
      let resultMessage = 'Test Results:\n';
      results.forEach((res, idx) => {
        resultMessage += `Test ${idx + 1}: ${res.passed ? '✅ PASSED' : '❌ FAILED'}\n`;
        if (!res.passed) {
          if (res.error) {
            resultMessage += `   Error: ${res.error}\n`;
          } else {
            resultMessage += `   Expected: ${res.expected}, Got: ${res.result}\n`;
          }
        }
      });
      
      setTimeout(() => {
        addMessage('opponent', resultMessage);
        
        if (allPassed) {
          // Play sound effect
          playSound("correct");
          
          // Show feedback
          showFeedbackAnimation('correct');
          
          // Update streak
          const newStreak = streak + 1;
          setStreak(newStreak);
          
          // Generate feedback based on streak
          let feedback = 'All tests passed! Great job!';
          if (newStreak >= 3) {
            feedback = getStreakMessage(newStreak) + ' All tests passed!';
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
              setCodeInput(questions[currentQuestion + 1].starterCode);
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
          
          addMessage('opponent', `Not all tests passed. ${currentQ.hint}`);
        }
      }, 500);
      
    } catch (err) {
      // Play sound effect
      playSound("wrong");
      
      // Show feedback
      showFeedbackAnimation('wrong');
      
      setTimeout(() => {
        addMessage('opponent', `Error in your code: ${err.message}. ${currentQ.hint}`);
      }, 500);
    }
  };

  // Initialize the first question
  useEffect(() => {
    setTimeout(() => {
      addMessage('opponent', questions[0].question);
    }, 1000);
    
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

  // Get difficulty badge
  const getDifficultyBadge = (difficulty) => {
    const badges = {
      easy: { color: 'bg-green-500', text: 'Easy' },
      medium: { color: 'bg-yellow-500', text: 'Medium' },
      hard: { color: 'bg-red-500', text: 'Hard' }
    };
    
    const badge = badges[difficulty] || badges.medium;
    
    return (
      <span className={`${badge.color} text-white text-xs font-bold px-2 py-1 rounded`}>
        {badge.text}
      </span>
    );
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
              <span className="text-2xl mr-1">⚔️</span> Challenge:
            </span>
            <div className="flex space-x-2">
              {subjects.map(subject => (
                <button 
                  key={subject.id} 
                  onClick={() => changeSubject(subject.id)}
                  className={`px-3 py-1 rounded-md transition-all duration-300 ${
                    subjectType === subject.id 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-800 hover:bg-gray-700 text-gray-200'
                  }`}
                >
                  <span className="mr-1">{subject.icon}</span>
                  <span>{subject.name}</span>
                </button>
              ))}
            </div>
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
            
            {subjectType !== 'computer science' ? (
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
                />
                <button 
                  onClick={handleSubmit} 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-r-lg"
                >
                  Send
                </button>
              </div>
            ) : (
              <button 
                onClick={handleCodeSubmit} 
                className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg"
              >
                Run Tests
              </button>
            )}
          </div>
          
          {/* Right Side: Content Section - Quiz or Code Editor based on subject */}
          <div className="w-1/2 p-4 bg-gray-900 flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-bold text-white">
                {subjectType === 'computer science' ? 'Coding Challenge' : 'Question'}
              </h2>
              {questions[currentQuestion]?.difficulty && (
                getDifficultyBadge(questions[currentQuestion].difficulty)
              )}
            </div>
            
            {subjectType !== 'computer science' ? (
              /* Quiz View */
              <div className="flex-grow bg-gray-800 rounded-lg p-6 flex flex-col items-center justify-center overflow-auto">
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
                  <div className="text-xl mb-6 text-gray-100 bg-gray-700 p-4 rounded-lg border-l-4 border-blue-500">
                    {questions[currentQuestion]?.question || ''}
                  </div>
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
              </div>
            ) : (
              /* Code Editor View */
              <div className="flex-grow flex flex-col">
                <div className="bg-gray-800 rounded-lg p-4 mb-4 text-white">
                  <div className="font-bold mb-2 text-blue-300">Problem:</div>
                  <div className="mb-4">{questions[currentQuestion]?.question || ''}</div>
                  <div className="font-bold mb-2 text-green-300">Test Cases:</div>
                  <div className="bg-gray-900 p-3 rounded text-sm font-mono text-gray-200 border-l-4 border-green-500">
                    {questions[currentQuestion]?.testCases.map((test, idx) => (
                      <div key={idx} className="mb-2">
                        <span className="text-blue-400">Input:</span> ({test.inputs.join(', ')}) 
                        <span className="text-yellow-400"> → Expected:</span> {JSON.stringify(test.expected)}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex-grow">
                  <textarea
                    value={codeInput}
                    onChange={(e) => setCodeInput(e.target.value)}
                    className="w-full h-40 p-3 font-mono text-sm bg-gray-950 text-green-400 rounded-lg"
                    spellCheck="false"
                  />
                </div>
              </div>
            )}
            
            {/* Progress Bar */}
            <div className="mt-4 bg-gray-800 p-3 rounded-lg text-white">
              <div className="flex justify-between">
                <div className="font-bold">Progress:</div>
                <div>{currentQuestion + 1} of {questions.length}</div>
              </div>
              <div className="w-full bg-gray-900 rounded-full h-4 mt-2">
                <div 
                  className={`${
                    animateProgress ? 'bg-blue-500 animate-pulse' : 'bg-blue-600'
                  } h-4 rounded-full transition-all duration-1000`}
                  style={{ width: `${((currentQuestion) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}