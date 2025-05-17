import { AnswerAnalyiser } from "./AnalyseAnswer.js";
import {GenerateQuote, questions} from "./generateQuote.js";

const test = async() =>{
    const topic = "Python"
    const data= await AnswerAnalyiser("DSA full form is Data structure and avaentass",'Data structe and alog',1);
    console.log(data);
}
// const test = async() =>{
//     const topic = "Python"
//     const data= await questions(topic,'easy',5);
//     console.log(data);
// }

test();