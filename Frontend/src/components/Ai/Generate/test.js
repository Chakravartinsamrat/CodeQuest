import { AnswerAnalyiser } from "./AnalyseAnswer.js";
import {GenerateQuote, questions} from "./generateQuote.js";
import { LearningData, Codechatbot } from "./Learning.js";

const test = async() =>{
    const topic = "Python"
    const level = "Medium"
    const data= await LearningData(topic, level);
    console.log(data);
}
// const test = async() =>{
//     const topic = "Python"
//     const data= await questions(topic,'easy',5);
//     console.log(data);
// }

test();