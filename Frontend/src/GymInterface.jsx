import { useState, useEffect } from 'react';

export default function EpicBossChallenge({ onClose }) {
  const [conversation, setConversation] = useState([
    { speaker: 'boss', text: 'Welcome, challenger... Are you prepared to face your final test?' }
  ]);
  const [userInput, setUserInput] = useState('');
  const [codeInput, setCodeInput] = useState('// Write your code here');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [challengeComplete, setChallengeComplete] = useState(false);
  const [subjectType, setSubjectType] = useState('math'); // Default subject
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [timerRunning, setTimerRunning] = useState(true);
  const [bossHealth, setBossHealth] = useState(100);
  const [playerHealth, setPlayerHealth] = useState(100);
  const [showDamageEffect, setShowDamageEffect] = useState(false);
  const [showHealEffect, setShowHealEffect] = useState(false);
  const [bossAttackAnimation, setBossAttackAnimation] = useState(false);
  const [showBossEntrance, setShowBossEntrance] = useState(true);

  // Define different subject types
  const subjects = ['math', 'physics', 'english', 'computer science'];

  // Sample questions for different subjects
  const questionsBySubject = {
    math: [
      {
        question: "What's 7 × 8?",
        answer: "56",
        hint: "Think of it as 7 × 7 + 7"
      },
      {
        question: "Solve for x: 3x + 5 = 20",
        answer: "5",
        hint: "Subtract 5 from both sides, then divide by 3"
      },
      {
        question: "What's the area of a circle with radius 4?",
        answer: ["50.27", "50.3", "50.26548", "16π"],
        hint: "Use the formula πr²"
      }
    ],
    physics: [
      {
        question: "What is Newton's Second Law?",
        answer: ["f=ma", "force equals mass times acceleration", "force = mass × acceleration"],
        hint: "It relates force, mass, and acceleration"
      },
      {
        question: "What is the SI unit of electric current?",
        answer: "ampere",
        hint: "It starts with 'A'"
      },
      {
        question: "What is the speed of light in a vacuum (in m/s)?",
        answer: ["299792458", "3e8", "300000000"],
        hint: "It's approximately 3×10⁸ m/s"
      }
    ],
    english: [
      {
        question: "Who wrote 'Romeo and Juliet'?",
        answer: ["shakespeare", "william shakespeare"],
        hint: "He's often called the Bard of Avon"
      },
      {
        question: "What's the opposite of 'benevolent'?",
        answer: ["malevolent", "malicious", "cruel"],
        hint: "It starts with 'mal-'"
      },
      {
        question: "What figure of speech is 'The cloud danced across the sky'?",
        answer: ["personification", "metaphor"],
        hint: "It gives human qualities to a non-human thing"
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
        hint: "Make sure to return the result of a + b"
      },
      {
        question: "Write a function that returns true if a string is a palindrome, false otherwise.",
        testCases: [
          { inputs: ["racecar"], expected: true },
          { inputs: ["hello"], expected: false }
        ],
        starterCode: "function isPalindrome(str) {\n  // Your code here\n}",
        hint: "Try comparing characters from opposite ends"
      },
      {
        question: "Write a function that returns the factorial of a number.",
        testCases: [
          { inputs: [5], expected: 120 },
          { inputs: [0], expected: 1 }
        ],
        starterCode: "function factorial(n) {\n  // Your code here\n}",
        hint: "Remember that 0! = 1, and n! = n × (n-1)!"
      }
    ]
  };

  const [questions, setQuestions] = useState(questionsBySubject.math);
  
  // Sound effects
  const playSound = (type) => {
    // If we had audio, we'd play it here
    console.log(`Playing ${type} sound`);
  };

  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Change subject
  const changeSubject = (subject) => {
    setSubjectType(subject);
    setQuestions(questionsBySubject[subject]);
    setCurrentQuestion(0);
    setScore(0);
    setChallengeComplete(false);
    setBossHealth(100);
    setPlayerHealth(100);
    setTimeLeft(300);
    setTimerRunning(true);
    setConversation([
      { speaker: 'boss', text: `Prepare yourself for the ${subject} trial! Your knowledge will be tested!` }
    ]);
    
    playSound('subject-change');
    
    setTimeout(() => {
      addMessage('boss', questionsBySubject[subject][0].question);
    }, 1000);

    if (subject === 'computer science') {
      setCodeInput(questionsBySubject[subject][0].starterCode);
    }
  };

  // Add a new message to the conversation
  const addMessage = (speaker, text) => {
    setConversation(prev => [...prev, { speaker, text }]);
  };

  // Boss attack
  const bossAttack = () => {
    setBossAttackAnimation(true);
    setTimeout(() => {
      setBossAttackAnimation(false);
      setShowDamageEffect(true);
      playSound('player-damage');
      setPlayerHealth(prev => Math.max(prev - 15, 0));
      setTimeout(() => setShowDamageEffect(false), 300);
    }, 500);
  };

  // Player attack
  const damageTheBoss = () => {
    setShowHealEffect(true);
    playSound('boss-damage');
    const damage = Math.floor(Math.random() * 20) + 10; // 10-30 damage
    setBossHealth(prev => Math.max(prev - damage, 0));
    setTimeout(() => setShowHealEffect(false), 300);
  };

  // Handle user input submission for regular quizzes
  const handleSubmit = () => {
    if (!userInput.trim()) return;

    // Add user message to conversation
    addMessage('user', userInput);

    // Check if answer is correct
    const currentQ = questions[currentQuestion];
    const isCorrect = Array.isArray(currentQ.answer) 
      ? currentQ.answer.includes(userInput.toLowerCase())
      : userInput.toLowerCase() === currentQ.answer.toLowerCase();

    setTimeout(() => {
      if (isCorrect) {
        addMessage('boss', 'CORRECT! You are stronger than I expected...');
        setScore(score + 1);
        damageTheBoss();
        
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
          setTimeout(() => {
            addMessage('boss', questions[currentQuestion + 1].question);
          }, 1000);
        } else {
          // Challenge complete
          setTimeout(() => {
            addMessage('boss', `You have... defeated me! Final score: ${score + 1}/${questions.length}`);
            setChallengeComplete(true);
            setTimerRunning(false);
            playSound('victory');
          }, 1000);
        }
      } else {
        addMessage('boss', `WRONG! ${currentQ.hint}`);
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

  // Handle code submission
  const handleCodeSubmit = () => {
    // Add user code to conversation (shortened version)
    const codeSnippet = codeInput.length > 50 
      ? codeInput.substring(0, 50) + '...' 
      : codeInput;
    addMessage('user', `[CODE SUBMISSION]:\n${codeSnippet}`);

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
        addMessage('boss', resultMessage);
        
        if (allPassed) {
          addMessage('boss', 'All tests passed! IMPOSSIBLE!');
          setScore(score + 1);
          damageTheBoss();
          
          if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setTimeout(() => {
              addMessage('boss', questions[currentQuestion + 1].question);
              setCodeInput(questions[currentQuestion + 1].starterCode);
            }, 1000);
          } else {
            // Challenge complete
            setTimeout(() => {
              addMessage('boss', `You have... defeated me! Final score: ${score + 1}/${questions.length}`);
              setChallengeComplete(true);
              setTimerRunning(false);
              playSound('victory');
            }, 1000);
          }
        } else {
          addMessage('boss', `Not all tests passed. You are WEAK! ${currentQ.hint}`);
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
      
    } catch (err) {
      setTimeout(() => {
        addMessage('boss', `Error in your code: ${err.message}. Pathetic! ${currentQ.hint}`);
        bossAttack();
      }, 500);
    }
  };

  // Timer effect
  useEffect(() => {
    let interval;
    if (timerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            addMessage('boss', 'Times up! You have failed!');
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

  // Boss entrance animation effect
  useEffect(() => {
    setTimeout(() => {
      setShowBossEntrance(false);
      playSound('boss-entrance');
    }, 2000);
  }, []);

  // Initialize the first question
  useEffect(() => {
    setTimeout(() => {
      addMessage('boss', questions[0].question);
    }, 2500);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[1000]" style={{backgroundColor: 'rgba(0,0,0,0.9)'}}>
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
            <span className="animate-pulse">FINAL BOSS CHALLENGE</span>
            <div className="ml-4 flex space-x-2">
              {subjects.map(subject => (
                <button 
                  key={subject} 
                  onClick={() => changeSubject(subject)}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    subjectType === subject 
                      ? 'bg-red-600 text-white border border-red-400' 
                      : 'bg-gray-800 hover:bg-gray-700 border border-gray-700'
                  }`}
                >
                  {subject}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
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
            <h2 className="text-lg font-bold text-red-400 mb-2 flex items-center">
              <span className="mr-2">🔥</span>Battle Log
            </h2>
            <div className={`flex-grow bg-gradient-to-b from-gray-900 to-gray-800 rounded-lg p-4 overflow-y-auto mb-4 border border-gray-700 ${bossAttackAnimation ? 'animate-pulse' : ''}`}>
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
              subjectType !== 'computer science' ? (
                <div className="flex relative">
                  <input
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
                  />
                  <button 
                    onClick={handleSubmit} 
                    className="bg-blue-700 text-white px-6 py-3 rounded-r-lg hover:bg-blue-600 transition-colors font-bold border-2 border-blue-700"
                  >
                    SUBMIT
                  </button>
                </div>
              ) : (
                <button 
                  onClick={handleCodeSubmit} 
                  className="w-full bg-blue-700 text-white p-3 rounded-lg hover:bg-blue-600 font-bold border-2 border-blue-800 shadow-lg flex items-center justify-center"
                >
                  <span className="mr-2">🧪</span> TEST YOUR CODE
                </button>
              )
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
          
          {/* Right Side: Content Section - Quiz or Code Editor based on subject */}
          <div className="w-1/2 p-4 bg-black flex flex-col">
            <h2 className="text-lg font-bold mb-2 text-red-400 flex items-center">
              {subjectType === 'computer science' ? (
                <>
                  <span className="mr-2">💻</span> Epic Coding Trial
                </>
              ) : (
                <>
                  <span className="mr-2">❓</span> Knowledge Challenge
                </>
              )}
            </h2>
            
            {subjectType !== 'computer science' ? (
              /* Quiz View */
              <div className="flex-grow bg-gradient-to-b from-gray-900 to-gray-800 rounded-lg p-6 flex flex-col items-center justify-center border border-gray-700 shadow-inner">
                <div className="text-center">
                  <div className="text-2xl font-bold mb-4 text-red-400">
                    Challenge {currentQuestion + 1}/{questions.length}
                  </div>
                  <div className="text-xl mb-6 text-gray-100 bg-gray-800 p-4 rounded-lg border border-gray-700">
                    {questions[currentQuestion]?.question || ''}
                  </div>
                  {challengeComplete && (
                    <div className={`${
                      bossHealth <= 0 
                        ? 'bg-green-900 border border-green-700 text-green-100' 
                        : 'bg-red-900 border border-red-700 text-red-100'
                    } px-6 py-4 rounded-lg shadow-lg`}>
                      <div className="font-bold text-xl mb-2">
                        {bossHealth <= 0 ? 'VICTORY!' : 'DEFEAT!'}
                      </div>
                      <div className="text-lg">
                        {bossHealth <= 0 
                          ? `You've conquered the final boss with a score of ${score}/${questions.length}!` 
                          : 'The boss has defeated you! Train harder and return for vengeance!'
                        }
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Code Editor View */
              <div className="flex-grow flex flex-col">
                <div className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-lg p-4 mb-4 text-white border border-gray-700">
                  <div className="font-bold mb-2 text-red-400">THE CHALLENGE:</div>
                  <div className="mb-4">{questions[currentQuestion]?.question || ''}</div>
                  <div className="font-bold mb-2 text-red-400">TEST CASES TO PASS:</div>
                  <div className="bg-gray-800 p-3 rounded text-sm font-mono text-gray-200 border border-gray-700">
                    {questions[currentQuestion]?.testCases.map((test, idx) => (
                      <div key={idx} className="mb-1">
                        Input: ({test.inputs.join(', ')}) → Expected: {JSON.stringify(test.expected)}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex-grow relative h-64">
                  <textarea
                    value={codeInput}
                    onChange={(e) => setCodeInput(e.target.value)}
                    className="w-full h-full p-3 font-mono text-sm bg-gray-900 text-green-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700"
                    spellCheck="false"
                  />
                </div>
              </div>
            )}
            
            {/* Progress Bar */}
            <div className="mt-4 bg-gray-800 p-3 rounded-lg text-white border border-gray-700">
              <div className="font-bold text-red-400">BOSS BATTLE PROGRESS:</div>
              <div className="w-full bg-black rounded-full h-4 mt-2 border border-gray-700">
                <div 
                  className="bg-gradient-to-r from-red-900 via-orange-600 to-yellow-500 h-4 rounded-full transition-all duration-500 ease-out"
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