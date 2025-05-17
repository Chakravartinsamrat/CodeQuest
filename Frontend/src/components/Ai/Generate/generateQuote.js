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
  else {
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

const questions = async (topic) => {
 try  {
  const prompt = `Act as a knowledgeable tutor. I am learning about ${topic}.
  Please give me 5 questions to test my understanding.
  The questions should progress from easy to difficult, with the 5th being the most challenging.
  Do not provide the answers yet. Just list the questions clearly, numbered 1 through 5.`;

 const result = await model.generateContent(prompt);
 return result.response.text();
 }
 catch(err){
  console.log(err);
  
 }
}

export { GenerateQuote, questions };