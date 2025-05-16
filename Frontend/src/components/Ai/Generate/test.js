import {GenerateQuote} from "./generateQuote.js";

const test = async() =>{
    const topic = "Python"
    const data= await GenerateQuote(topic);
    console.log(data);
}

test();