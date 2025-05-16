import { GoogleGenerativeAI } from "@google/generative-ai";

const GenAi = new GoogleGenerativeAI("AIzaSyAq5-n9eh_0z1jKw93ejrwqtoExhfFxZm4");

const model = GenAi.getGenerativeModel({model:"gemini-2.0-flash"});

export default model;
