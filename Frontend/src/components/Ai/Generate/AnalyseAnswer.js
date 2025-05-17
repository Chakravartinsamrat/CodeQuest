import model from "../basicSetup/gemini.js";


export const AnswerAnalyiser = async (answer, userAnswer, level, num) => {
  try {
    const prompt = `You are an exam corrector.
Compare the actual answer: "${answer}" 
with the user's answer: "${userAnswer}".

- Allow small spelling mistakes.
- If the meaning is the same, respond with only "YES".
- If the answer is wrong or off-topic, respond with only "NO".
No other explanation, just YES or NO.`;

    const result = await model.generateContent(prompt);
    const text = (await result.response.text()).trim(); // Get text and remove any whitespace/newlines

    // Just log or return the plain string
    console.log('AI Response:', text);
    return text;
  } catch (err) {
    console.log(err);
    return undefined;
  }
}
