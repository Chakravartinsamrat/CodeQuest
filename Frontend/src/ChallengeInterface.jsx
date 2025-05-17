import { useState, useEffect } from 'react';

export default function ChallengeInterface({ onClose }) {
  const [conversation, setConversation] = useState([
    { speaker: 'opponent', text: 'Welcome to the challenge! Are you ready?' }
  ]);
  const [userInput, setUserInput] = useState('');
  const [codeInput, setCodeInput] = useState('// Write your code here');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [challengeComplete, setChallengeComplete] = useState(false);
  const [subjectType, setSubjectType] = useState('math'); // Default subject

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

  // Change subject
  const changeSubject = (subject) => {
    setSubjectType(subject);
    setQuestions(questionsBySubject[subject]);
    setCurrentQuestion(0);
    setScore(0);
    setChallengeComplete(false);
    setConversation([
      { speaker: 'opponent', text: `Welcome to the ${subject} challenge! Are you ready?` }
    ]);
    setTimeout(() => {
      addMessage('opponent', questionsBySubject[subject][0].question);
    }, 1000);

    if (subject === 'computer science') {
      setCodeInput(questionsBySubject[subject][0].starterCode);
    }
  };

  // Add a new message to the conversation
  const addMessage = (speaker, text) => {
    setConversation(prev => [...prev, { speaker, text }]);
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
        addMessage('opponent', 'Correct! Well done.');
        setScore(score + 1);
        
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
          setTimeout(() => {
            addMessage('opponent', questions[currentQuestion + 1].question);
          }, 1000);
        } else {
          // Challenge complete
          setTimeout(() => {
            addMessage('opponent', `Challenge complete! Your score: ${score + 1}/${questions.length}`);
            setChallengeComplete(true);
          }, 1000);
        }
      } else {
        addMessage('opponent', `Not quite. ${currentQ.hint}`);
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
          addMessage('opponent', 'All tests passed! Great job!');
          setScore(score + 1);
          
          if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setTimeout(() => {
              addMessage('opponent', questions[currentQuestion + 1].question);
              setCodeInput(questions[currentQuestion + 1].starterCode);
            }, 1000);
          } else {
            // Challenge complete
            setTimeout(() => {
              addMessage('opponent', `Challenge complete! Your score: ${score + 1}/${questions.length}`);
              setChallengeComplete(true);
            }, 1000);
          }
        } else {
          addMessage('opponent', `Not all tests passed. ${currentQ.hint}`);
        }
      }, 500);
      
    } catch (err) {
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
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[1000]" style={{backgroundColor: 'rgba(0,0,0,0.75)'}}>
      <div className="bg-white border-2 border-black rounded-lg w-full max-w-4xl flex flex-col overflow-hidden shadow-xl max-h-[90vh]">
        <div className="bg-gray-800 text-white p-4 font-bold text-xl flex justify-between items-center">
          <div className="flex items-center">
            <span>Challenge: </span>
            <div className="ml-2 flex space-x-2">
              {subjects.map(subject => (
                <button 
                  key={subject} 
                  onClick={() => changeSubject(subject)}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    subjectType === subject 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  {subject}
                </button>
              ))}
            </div>
          </div>
          {!challengeComplete && (
            <button onClick={onClose} className="text-white hover:text-red-300">
              ✕
            </button>
          )}
        </div>
        
        <div className="flex flex-row h-[calc(100%-4rem)] overflow-hidden">
          {/* Left Side: Conversation Section */}
          <div className="w-1/2 p-4 bg-gray-800 flex flex-col">
            <h2 className="text-lg font-bold text-white mb-2">Conversation</h2>
            <div className="flex-grow bg-gray-700 rounded-lg p-4 overflow-y-auto mb-4">
              {conversation.map((msg, index) => (
                <div 
                  key={index} 
                  className={`mb-4 ${msg.speaker === 'user' ? 'text-right' : 'text-left'}`}
                >
                  <div 
                    className={`inline-block rounded-lg px-4 py-2 max-w-[90%] ${
                      msg.speaker === 'user' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-300 text-black'
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
                <div className="flex">
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    className="flex-grow p-2 rounded-l-lg border-0 focus:ring-2 focus:ring-blue-500"
                    placeholder="Type your answer..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSubmit();
                      }
                    }}
                  />
                  <button 
                    onClick={handleSubmit} 
                    className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 transition-colors"
                  >
                    Send
                  </button>
                </div>
              ) : (
                <button 
                  onClick={handleCodeSubmit} 
                  className="w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 font-bold"
                >
                  Run Tests
                </button>
              )
            ) : (
              <button
                onClick={onClose}
                className="w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 font-bold"
              >
                Return to Game
              </button>
            )}
          </div>
          
          {/* Right Side: Content Section - Quiz or Code Editor based on subject */}
          <div className="w-1/2 p-4 bg-gray-900 flex flex-col">
            <h2 className="text-lg font-bold mb-2 text-white">
              {subjectType === 'computer science' ? 'Coding Challenge' : 'Question'}
            </h2>
            
            {subjectType !== 'computer science' ? (
              /* Quiz View */
              <div className="flex-grow bg-gray-800 rounded-lg p-6 flex flex-col items-center justify-center h-[400px]">
                <div className="text-center">
                  <div className="text-2xl font-bold mb-4 text-white">
                    Question {currentQuestion + 1}/{questions.length}
                  </div>
                  <div className="text-xl mb-6 text-gray-100">
                    {questions[currentQuestion]?.question || ''}
                  </div>
                  {challengeComplete && (
                    <div className="bg-blue-900 border border-blue-700 text-blue-100 px-4 py-3 rounded">
                      <div className="font-bold text-xl mb-2">Challenge Complete!</div>
                      <div className="text-lg">
                        Your score: {score}/{questions.length}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Code Editor View */
              <div className="flex-grow flex flex-col">
                <div className="bg-gray-800 rounded-lg p-4 mb-4 text-white">
                  <div className="font-bold mb-2">Problem:</div>
                  <div className="mb-4">{questions[currentQuestion]?.question || ''}</div>
                  <div className="font-bold mb-2">Test Cases:</div>
                  <div className="bg-gray-700 p-2 rounded text-sm font-mono text-gray-200">
                    {questions[currentQuestion]?.testCases.map((test, idx) => (
                      <div key={idx} className="mb-1">
                        Input: ({test.inputs.join(', ')}) → Expected: {JSON.stringify(test.expected)}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex-grow relative h-[300px]">
                  <textarea
                    value={codeInput}
                    onChange={(e) => setCodeInput(e.target.value)}
                    className="w-full h-full p-3 font-mono text-sm bg-gray-900 text-green-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    spellCheck="false"
                  />
                </div>
              </div>
            )}
            
            {/* Progress Bar */}
            <div className="mt-4 bg-gray-700 p-3 rounded-lg text-white">
              <div className="font-bold">Progress:</div>
              <div className="w-full bg-gray-800 rounded-full h-4 mt-2">
                <div 
                  className="bg-blue-500 h-4 rounded-full transition-all duration-500 ease-out"
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