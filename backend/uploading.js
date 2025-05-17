const mongoose = require("mongoose");

// 🔐 Replace with your MongoDB connection string
const MONGO_URI = "mongodb+srv://atulreny911:atulreny911@clusterquest.iefv6ev.mongodb.net/?retryWrites=true&w=majority&appName=ClusterQuest";

// ✅ Define the Challenge Schema
const challengeSchema = new mongoose.Schema({
  id: Number,
  question: String,
  answer: String,
  xp: Number,
  difficulty: String
});

const Challenge = mongoose.model("Challenge", challengeSchema);

// 📦 Your questions data
const challenges = [
  { id: 1, question: "What keyword is used to define a function in Python?", answer: "def", xp: 10, difficulty: "Easy" },
  { id: 2, question: "What data type represents True or False values?", answer: "bool", xp: 10, difficulty: "Easy" },
  { id: 3, question: "What symbol is used to write comments in Python?", answer: "#", xp: 10, difficulty: "Easy" },
  { id: 4, question: "What keyword is used to start a loop that repeats while a condition is true?", answer: "while", xp: 15, difficulty: "Easy" },
  { id: 5, question: "What keyword is used to create a loop that runs over a sequence?", answer: "for", xp: 15, difficulty: "Easy" },
  { id: 6, question: "What keyword exits a loop early?", answer: "break", xp: 20, difficulty: "Medium" },
  { id: 7, question: "What keyword skips to the next iteration in a loop?", answer: "continue", xp: 20, difficulty: "Medium" },
  { id: 8, question: "What do we call a block of code that performs a specific task?", answer: "function", xp: 15, difficulty: "Easy" },
  { id: 9, question: "What data type would you use to store text?", answer: "string", xp: 10, difficulty: "Easy" },
  { id: 10, question: "What data type holds decimal numbers?", answer: "float", xp: 10, difficulty: "Easy" },
  { id: 11, question: "What operator is used for equality comparison?", answer: "==", xp: 10, difficulty: "Easy" },
  { id: 12, question: "What keyword is used to check a condition?", answer: "if", xp: 10, difficulty: "Easy" },
  { id: 13, question: "What keyword is used when the condition is false after `if`?", answer: "else", xp: 10, difficulty: "Easy" },
  { id: 14, question: "What is the term for a value passed into a function?", answer: "argument", xp: 20, difficulty: "Medium" },
  { id: 15, question: "What is the term for a named location to store data?", answer: "variable", xp: 10, difficulty: "Easy" },
  { id: 16, question: "What is the term for repeating a task multiple times?", answer: "loop", xp: 15, difficulty: "Easy" },
  { id: 17, question: "What keyword returns a value from a function?", answer: "return", xp: 15, difficulty: "Easy" },
  { id: 18, question: "What is the collection type that stores multiple values in order?", answer: "list", xp: 10, difficulty: "Easy" },
  { id: 19, question: "What kind of error occurs when the code violates syntax rules?", answer: "syntax", xp: 25, difficulty: "Medium" },
  { id: 20, question: "What type of loop is controlled by a counter or index?", answer: "for", xp: 15, difficulty: "Easy" }
];

// 🚀 Connect and insert
async function uploadChallenges() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    // Optional: Clear existing challenges if needed
    await Challenge.deleteMany({});
    console.log("Old data cleared.");

    // Insert new data
    await Challenge.insertMany(challenges);
    console.log("Challenges uploaded successfully!");

    mongoose.disconnect();
  } catch (err) {
    console.error("Error uploading challenges:", err);
  }
}

uploadChallenges();
