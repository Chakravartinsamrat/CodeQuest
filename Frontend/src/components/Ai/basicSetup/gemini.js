import { GoogleGenerativeAI } from "@google/generative-ai";

const GenAi = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API);

const model = GenAi.getGenerativeModel({model:"gemini-2.0-flash"});

export default model;
