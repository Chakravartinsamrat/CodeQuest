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

const questions = async (topic, level, num) => {
  try {
    const prompt = `Act as a knowledgeable tutor. I am learning about "${topic}".
Please generate exactly ${num} questions at a "${level}" difficulty.
For each question, provide:
- The question as a string
- The answer
- A hint
leave out the backticks json and the trailing ones
give me pure text form json
Return the response as a **valid JSON array** of objects, like:
[
  {
    "question": "Question 1 text...",
    "answer": "Answer 1",
    "hint": "Hint 1"
  },
  ...
]`;
    const result = await model.generateContent(prompt);
    const text = await result.response.text();
    const json = JSON.parse(text);
    console.log(json);
    return json;
  }
  catch (err) {
    console.log(err);

  }
}

export { GenerateQuote, questions };