import model from "../basicSetup/gemini.js";

const GenerateQuote = async (topic) => {
  if (topic) {
    try {
      const prompt = `
        
        ABOUT: you are a Humourous Wizard for a Coding Platform
        TASK: Generate a Humourous Quote of the day based on ${topic} 
        `;
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (err) {
      console.log(`Error generating LeetCode question: ${err.message}`);
      return null;
    }
  }
  else{
    try {
      const prompt = `
        
        ABOUT: you are a Humourous Wizard for a Coding Platform
        TASK: Generate a Humourous Quote of the day related to any Code related topic
        `;
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (err) {
      console.log(`Error generating LeetCode question: ${err.message}`);
    
      return null;
    }
  }
};

export {GenerateQuote};