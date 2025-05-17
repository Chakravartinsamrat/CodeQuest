import { useState, useEffect } from 'react';

// Dummy AI response function (replace with real API if needed)
const getAIResponse = (question) => {
  if (question.toLowerCase().includes('video')) return "You can replay the video or ask for more resources!";
  if (question.toLowerCase().includes('key point')) return "Key points help you remember the most important facts.";
  return "That's a great question! I'll find the answer for you soon.";
};

// Mock database functions (replace with actual DB implementation)
const saveNotesToDB = async (notes) => {
  console.log("Saving notes to DB:", notes);
  // In a real app, this would be an API call to save notes
  return { success: true, id: "note_" + Date.now() };
};

const exportNotesToPDF = (notes, title = "My Learning Notes") => {
  // This is a simple implementation - in a real app, you'd use a library like jsPDF
  // or send to a server endpoint that generates a proper PDF
  const element = document.createElement('a');
  const file = new Blob([`# ${title}\n\n${notes}`], {type: 'text/plain'});
  element.href = URL.createObjectURL(file);
  element.download = `${title.replace(/\s+/g, '_')}.txt`;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
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
  const [notesTitle, setNotesTitle] = useState('Lesson Notes');
  const [saveStatus, setSaveStatus] = useState(''); // For save confirmation
  const [showNotes, setShowNotes] = useState(false);

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

  // Save notes to database
  const handleSaveNotes = async () => {
    setSaveStatus('Saving...');
    try {
      const result = await saveNotesToDB(notes);
      if (result.success) {
        setSaveStatus('Saved!');
        setTimeout(() => setSaveStatus(''), 3000);
      }
    } catch (error) {
      setSaveStatus('Error saving');
      console.error("Failed to save notes:", error);
    }
    setEditingNotes(false);
  };

  // Export notes as PDF
  const handleExportPDF = () => {
    exportNotesToPDF(notes, notesTitle);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[1000]" style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}>
      <div className="bg-gray-900 border-2 border-blue-500 rounded-lg w-full max-w-5xl flex flex-col overflow-hidden shadow-xl max-h-[90vh]">
        {/* Header */}
        <div className="bg-blue-900 text-white p-4 font-bold text-xl flex justify-between items-center">
          <span>Learning Scene</span>
          <div className="flex space-x-4 items-center">
            <button 
              onClick={() => setShowNotes(!showNotes)} 
              className="bg-blue-700 hover:bg-blue-600 px-3 py-1 rounded text-sm font-semibold flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
              {showNotes ? 'Hide Notes' : 'Show Notes'}
            </button>
            <button onClick={onClose} className="text-white hover:text-red-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <div className="flex flex-row h-[calc(100%-4rem)] overflow-hidden">
          {/* Left: Learning Content */}
          <div className="w-1/2 p-4 bg-gray-800 flex flex-col text-gray-100">
            <h2 className="text-lg font-bold mb-3 text-blue-300">Lesson Video</h2>
            <div className="mb-5">
              <iframe
                width="100%"
                height="220"
                src={sampleLesson.videoUrl}
                title="Lesson Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-lg shadow-lg"
              ></iframe>
            </div>
            <h3 className="font-bold mb-2 text-blue-300">Key Points</h3>
            <ul className="list-disc ml-6 mb-4 space-y-2">
              {sampleLesson.keyPoints.map((point, idx) => (
                <li key={idx} className="mb-1">{point}</li>
              ))}
            </ul>
            <h3 className="font-bold mb-2 text-blue-300">Fun Facts</h3>
            <ul className="list-disc ml-6 mb-4 space-y-2 text-blue-200">
              {sampleLesson.funFacts.map((fact, idx) => (
                <li key={idx} className="mb-1">{fact}</li>
              ))}
            </ul>
          </div>

          {/* Right: Doubts & Notes */}
          <div className="w-1/2 flex flex-col">
            {!showNotes ? (
              // Chat Interface
              <div className="h-full p-4 bg-gray-800 flex flex-col border-l border-gray-700">
                <h2 className="text-lg font-bold mb-2 text-blue-300">Ask Doubts</h2>
                {/* Conversation */}
                <div className="flex-grow bg-gray-900 rounded-lg p-4 overflow-y-auto mb-4">
                  {conversation.map((msg, index) => (
                    <div
                      key={index}
                      className={`mb-3 ${msg.speaker === 'user' ? 'text-right' : 'text-left'}`}
                    >
                      <div
                        className={`inline-block rounded-lg px-4 py-2 max-w-[90%] ${
                          msg.speaker === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-700 text-gray-100'
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
                    className="flex-grow p-2 rounded-l-lg border-0 bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                    placeholder="Type your doubt..."
                    onKeyDown={e => {
                      if (e.key === 'Enter') handleSubmit();
                    }}
                  />
                  <button
                    onClick={handleSubmit}
                    className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-500 transition-colors"
                  >
                    Ask
                  </button>
                </div>
              </div>
            ) : (
              // Notes Interface
              <div className="h-full p-4 bg-gray-800 flex flex-col border-l border-gray-700">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-bold text-blue-300">My Notes</h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleExportPDF}
                      disabled={!notes.trim()}
                      className={`px-3 py-1 rounded text-xs font-semibold flex items-center ${
                        notes.trim() ? 'bg-green-600 hover:bg-green-500' : 'bg-gray-600 cursor-not-allowed'
                      }`}
                    >
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                      Export PDF
                    </button>
                    {!editingNotes ? (
                      <button
                        onClick={() => setEditingNotes(true)}
                        className="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded text-xs font-semibold flex items-center"
                      >
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                        </svg>
                        Edit
                      </button>
                    ) : (
                      <button
                        onClick={handleSaveNotes}
                        className="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded text-xs font-semibold flex items-center"
                      >
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
                        </svg>
                        Save
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Title input */}
                <input
                  type="text"
                  value={notesTitle}
                  onChange={e => setNotesTitle(e.target.value)}
                  disabled={!editingNotes}
                  className={`mb-2 p-2 rounded text-lg font-bold ${
                    editingNotes 
                      ? 'bg-gray-700 text-white border border-blue-500' 
                      : 'bg-transparent text-white border-none'
                  }`}
                  placeholder="Note Title"
                />
                
                {/* Notes content */}
                <div className="flex-grow bg-gray-900 rounded-lg p-4 overflow-y-auto mb-2 relative">
                  {editingNotes ? (
                    <textarea
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      className="w-full h-full p-2 bg-gray-800 text-gray-100 border border-gray-700 rounded resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="Write your notes here..."
                    />
                  ) : (
                    <div className="whitespace-pre-wrap text-gray-100 min-h-[400px]">
                      {notes || <span className="text-gray-500 italic">No notes yet. Click 'Edit' to start taking notes.</span>}
                    </div>
                  )}
                  
                  {/* Save status indicator */}
                  {saveStatus && (
                    <div className="absolute bottom-2 right-2 bg-gray-800 text-green-400 px-3 py-1 rounded-full text-sm font-medium">
                      {saveStatus}
                    </div>
                  )}
                </div>
                
                {/* Tips for note-taking */}
                <div className="bg-gray-700 text-blue-100 p-3 rounded-lg text-sm">
                  <p className="font-semibold mb-1">Tips for effective note-taking:</p>
                  <ul className="list-disc ml-5 text-xs space-y-1">
                    <li>Focus on key concepts rather than copying everything</li>
                    <li>Use your own words to improve understanding</li>
                    <li>Create connections between different ideas</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}