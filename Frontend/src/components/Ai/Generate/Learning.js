import model from "../basicSetup/gemini.js";

const LearningData = async(topic, level) =>{
    try{
        const prompt = 
    `
    You are Learning Trainer for ${topic}, You Need to Generate the Following Parameters based on the ${level}
    IMPORTANT: RETURN DATA IN JSON FORMAT ONLY! 
    IMPORTANT: LENGTH OF THE CONTENT SHOULD BE CONSICE

    {
    Title:" Title of the Topic in 2 words",
    Video_Link: "Generate a link of a video relevant to ${topic}
    Key_Points: "3 points to deepen the understanding on the topic",
    Fun_Facts: "2 Fun Facts about the ${topic}, 
    }
    `
    const result = await model.generateContent(prompt);
    return result.response.text();
    }catch(err){
        console.log(`error getting response: ${err.message}`);
    }
}



const Codechatbot = async(topic) => {
  try {
    const prompt = `You are a AI Coding Assistant, help users with coding related problems and related to what the user Asks you, give concise response related to the topic in the above message and no Markdown response! 
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
