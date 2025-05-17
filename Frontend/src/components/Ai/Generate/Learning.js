import model from "../basicSetup/gemini.js";

const map_video = {
  'DSA': [
    "https://www.youtube.com/watch?v=TQMvBTKn2p0",
    "https://www.youtube.com/watch?v=8wmn7k1TTcI",
    "https://www.youtube.com/watch?v=3_x_Fb31NLE",
    "https://www.youtube.com/watch?v=dqLHTK7RuIo",
    "https://www.youtube.com/watch?v=N6dOwBde7-M",
    "https://www.youtube.com/watch?v=LyuuqCVkP5I",
    "https://www.youtube.com/watch?v=EPwWrs8OtfI",
    "https://www.youtube.com/watch?v=pYT9F8_LFTM",
    "https://www.youtube.com/watch?v=cySVml6e_Fc"
  ],
  'HTML': [
    "https://www.youtube.com/watch?v=UB1O30fR-EE", // Traversy Media - HTML Crash Course
    "https://www.youtube.com/watch?v=pQN-pnXPaVg", // freeCodeCamp - HTML Full Course
    "https://www.youtube.com/watch?v=HD13eq_Pmp8"  // CodeWithHarry - HTML Tutorial in Hindi
  ],
  'CSS': [
    "https://www.youtube.com/watch?v=yfoY53QXEnI", // Traversy Media - CSS Crash Course
    "https://www.youtube.com/watch?v=1Rs2ND1ryYc", // freeCodeCamp - CSS Full Course
    "https://www.youtube.com/watch?v=ESnrn1kAD4E"  // CodeWithHarry - CSS Tutorial in Hindi
  ],
  'JavaScript': [
    "https://www.youtube.com/watch?v=PkZNo7MFNFg", // freeCodeCamp - JavaScript Full Course
    "https://www.youtube.com/watch?v=upDLs1sn7g4", // Traversy Media - JavaScript Crash Course
    "https://www.youtube.com/watch?v=hKB-YGF14SY"  // CodeWithHarry - JavaScript Tutorial in Hindi
  ],
  'SQL': [
    "https://www.youtube.com/watch?v=HXV3zeQKqGY", // freeCodeCamp - SQL Full Course
    "https://www.youtube.com/watch?v=7S_tz1z_5bA", // Programming with Mosh - SQL Tutorial
    "https://www.youtube.com/watch?v=hlGoQC332VM"  // CodeWithHarry - SQL Tutorial in Hindi
  ]
};

const LearningData = async(topic, level) => {
    if (!map_video[topic]) {
        throw new Error(`Topic "${topic}" not found in map_video`);
    }

    const randomIndex = Math.floor(Math.random() * map_video[topic].length);
    const video_url = map_video[topic][randomIndex];

    try {
        const prompt = `
        You are Learning Trainer for ${topic}, You Need to Generate the Following Parameters based on the ${level}
        IMPORTANT: RETURN DATA IN JSON FORMAT ONLY! 
        IMPORTANT: LENGTH OF THE CONTENT SHOULD BE CONSICE

        {
        Title:" Title of the Topic in 2 words",
        Video_Link:  "${video_url} just send this url don't add anything extra"
        Key_Points: "3 points to deepen the understanding on the topic",
        Fun_Facts: "2 Fun Facts about the ${topic}, 
        }
        `;
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (err) {
        console.log(`error getting response: ${err.message}`);
    }
};



const Codechatbot = async(topic) => {
  try {
    const prompt = `You are a AI Coding Assistant, help users with coding related problems and related to what the user Asks you, give concise response related to the topic in the above message with no markdown! 
    ${topic}`;
    
    const airesponse = await model.generateContent(prompt);
    return airesponse.response.text();
  } catch(err) {
    console.log(`Error generating response: ${err.message}`);
    console.log("All env vars:", import.meta.env);
    return null;
  }
};



export  {Codechatbot, LearningData};
