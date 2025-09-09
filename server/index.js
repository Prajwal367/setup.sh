const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const OpenAI = require("openai");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Initialize OpenAI Client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // Set this in Render Environment Variables
});

// Health check
app.get("/", (req, res) => {
  res.send("MediBot Backend is running with AI!");
});

// Chat endpoint
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const completion = await client.responses.create({
      model: "gpt-5-mini",
      input: `You are a professional medical assistant. Patient says: "${message}". Provide helpful and safe medical advice (general guidance only, not a prescription).`
    });

    res.json({ reply: completion.output[0].content[0].text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get response from AI" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
