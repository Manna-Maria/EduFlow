require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function verify() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  // Use the specific model we found in your list earlier
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  try {
    const result = await model.generateContent("Say 'API is working' if you can read this.");
    console.log("--- TEST RESULT ---");
    console.log(result.response.text());
    console.log("-------------------");
    console.log("✅ Success! Your key is ready for the project.");
  } catch (err) {
    console.error("❌ API Test Failed:", err.message);
  }
}

verify();