import {GenerateQuote, questions} from "./generateQuote.js";

const test = async() =>{
    const topic = "Python"
    const data= await questions(topic);
    console.log(data);
}

test();