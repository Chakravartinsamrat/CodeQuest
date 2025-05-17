import { useState } from 'react';

// Dummy AI response function (replace with real API if needed)
const getAIResponse = (question) => {
  if (question.toLowerCase().includes('video')) return "You can replay the video or ask for more resources!";
  if (question.toLowerCase().includes('key point')) return "Key points help you remember the most important facts.";
  return "That's a great question! I'll find the answer for you soon.";
};

const sampleLesson = {
  videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Replace with your video
  keyPoints: [
    "Key Point 1: Learning is a continuous journey.",
    "Key Point 2: Asking questions helps deepen understanding.",
    "Key Point 3: Making notes improves retention.",
  ],  
  funFacts: [
    "Did you know? The brain can process images in as little as 13 milliseconds!",
    "Fun Fact: Taking short notes boosts memory by 30%.",
  ],
};

export default function LearningScene({ onClose }) {
  const [conversation, setConversation] = useState([
    { speaker: 'ai', text: "Welcome! Ask me any doubt about the lesson." }
  ]);
  const [userInput, setUserInput] = useState('');
  const [notes, setNotes] = useState('');
  const [editingNotes, setEditingNotes] = useState(false);

  // Add new message to conversation
  const addMessage = (speaker, text) => {
    setConversation(prev => [...prev, { speaker, text }]);
  };

  // Handle user doubt submission
  const handleSubmit = () => {
    if (!userInput.trim()) return;
    addMessage('user', userInput);
    setTimeout(() => {
      addMessage('ai', getAIResponse(userInput));
    }, 600);
    setUserInput('');
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[1000]" style={{ backgroundColor: 'rgba(0,0,0,0.75)' }}>
      <div className="bg-white border-2 border-black rounded-lg w-full max-w-4xl flex flex-col overflow-hidden shadow-xl max-h-[90vh]">
        <div className="bg-blue-800 text-white p-4 font-bold text-xl flex justify-between items-center">
          <span>Learning Scene</span>
          <button onClick={onClose} className="text-white hover:text-red-300">✕</button>
        </div>
        <div className="flex flex-col md:flex-row flex-grow overflow-hidden">
          {/* Left: Learning Content */}
          <div className="w-full md:w-1/2 p-4 bg-gray-50 flex flex-col">
            <h2 className="text-lg font-bold mb-2">Lesson Video</h2>
            <div className="mb-4">
              <iframe
                width="100%"
                height="220"
                src={sampleLesson.videoUrl}
                title="Lesson Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-lg shadow"
              ></iframe>
            </div>
            <h3 className="font-bold mb-1">Key Points</h3>
            <ul className="list-disc ml-6 mb-4">
              {sampleLesson.keyPoints.map((point, idx) => (
                <li key={idx} className="mb-1">{point}</li>
              ))}
            </ul>
            <h3 className="font-bold mb-1">Fun Facts</h3>
            <ul className="list-disc ml-6 mb-4 text-blue-700">
              {sampleLesson.funFacts.map((fact, idx) => (
                <li key={idx} className="mb-1">{fact}</li>
              ))}
            </ul>
          </div>

          {/* Right: Doubts & Notes */}
          <div className="w-full md:w-1/2 p-4 bg-white flex flex-col border-l-2 border-gray-200">
            <h2 className="text-lg font-bold mb-2">Ask Doubts & Take Notes</h2>
            {/* Conversation */}
            <div className="flex-grow bg-gray-100 rounded-lg p-4 overflow-y-auto mb-4">
              {conversation.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-3 ${msg.speaker === 'user' ? 'text-right' : 'text-left'}`}
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
            {/* Input for doubts */}
            <div className="flex mb-4">
              <input
                type="text"
                value={userInput}
                onChange={e => setUserInput(e.target.value)}
                className="flex-grow p-2 rounded-l-lg border-0 focus:ring-2 focus:ring-blue-500"
                placeholder="Type your doubt..."
                onKeyDown={e => {
                  if (e.key === 'Enter') handleSubmit();
                }}
              />
              <button
                onClick={handleSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 transition-colors"
              >
                Ask
              </button>
            </div>
            {/* Notes Section */}
            <div className="bg-yellow-100 border border-yellow-400 p-3 rounded-lg">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold">Short Notes</span>
                <button
                  onClick={() => setEditingNotes(!editingNotes)}
                  className="text-blue-700 hover:underline text-sm"
                >
                  {editingNotes ? "Save" : "Edit"}
                </button>
              </div>
              {editingNotes ? (
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={3}
                  className="w-full p-2 border rounded"
                  placeholder="Write your notes here..."
                />
              ) : (
                <div className="whitespace-pre-wrap min-h-[40px]">{notes || <span className="text-gray-400">No notes yet.</span>}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
