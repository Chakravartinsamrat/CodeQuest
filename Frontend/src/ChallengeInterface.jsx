import { useState, useEffect } from 'react';

export default function ChallengeInterface({ onClose }) {
  const [conversation, setConversation] = useState([
    { speaker: 'opponent', text: 'Welcome to the challenge! Are you ready?' }
  ]);
  const [userInput, setUserInput] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [challengeComplete, setChallengeComplete] = useState(false);

  // Sample questions for the challenge
  const questions = [
    {
      question: "What's the capital of France?",
      answer: "paris",
      hint: "It's known as the City of Light"
    },
    {
      question: "What's 7 × 8?",
      answer: "56",
      hint: "Think of it as 7 × 7 + 7"
    },
    {
      question: "Name a primary color.",
      answer: ["red", "blue", "yellow"],
      hint: "There are three of them"
    }
  ];

  // Add a new message to the conversation
  const addMessage = (speaker, text) => {
    setConversation(prev => [...prev, { speaker, text }]);
  };

  // Handle user input submission
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

  // Initialize the first question
  useEffect(() => {
    setTimeout(() => {
      addMessage('opponent', questions[0].question);
    }, 1000);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[1000]" style={{backgroundColor: 'rgba(0,0,0,0.75)'}}>
      <div className="bg-white border-2 border-black rounded-lg w-full max-w-2xl flex flex-col overflow-hidden shadow-xl max-h-[90vh]">
        <div className="bg-gray-800 text-white p-4 font-bold text-xl flex justify-between items-center">
          <span>Challenge</span>
          {!challengeComplete && (
            <button onClick={onClose} className="text-white hover:text-red-300">
              ✕
            </button>
          )}
        </div>
        
        <div className="flex flex-col md:flex-row flex-grow overflow-hidden">
          {/* Conversation Section */}
          <div className="w-full md:w-1/2 p-4 bg-gray-800 flex flex-col">
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
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            {!challengeComplete ? (
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
                onClick={onClose}
                className="w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 font-bold"
              >
                Return to Game
              </button>
            )}
          </div>
          
          {/* Content Section */}
          <div className="w-full md:w-1/2 p-4 bg-white flex flex-col">
            <h2 className="text-lg font-bold mb-2">Question</h2>
            <div className="flex-grow bg-gray-100 rounded-lg p-4 flex flex-col items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold mb-4">
                  Question {currentQuestion + 1}/{questions.length}
                </div>
                <div className="text-xl mb-6">
                  {questions[currentQuestion].question}
                </div>
                {challengeComplete && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                    <div className="font-bold text-xl mb-2">Challenge Complete!</div>
                    <div className="text-lg">
                      Your score: {score}/{questions.length}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-4 bg-gray-200 p-3 rounded-lg">
              <div className="font-bold">Progress:</div>
              <div className="w-full bg-gray-300 rounded-full h-4 mt-2">
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