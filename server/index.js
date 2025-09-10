const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fetch = require("node-fetch"); // HuggingFace ke liye fetch

const app = express();
app.use(cors());
app.use(bodyParser.json());

// HuggingFace Model URL (medical chatbot)
const HF_API_URL = "https://api-inference.huggingface.co/models/ankur310794/Medical-Chatbot"; 
const HF_API_KEY = process.env.HF_API_KEY; // Render me env variable set karna

// Health check
app.get("/", (req, res) => {
  res.send("MediBot Backend is running with HuggingFace AI!");
});

// Chat endpoint
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const response = await fetch(HF_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inputs: message })
    });

    const data = await response.json();
    console.log("HF Response:", data);

    // HuggingFace reply extract karna
    let botReply = "Sorry, I couldn't understand.";
    if (Array.isArray(data) && data.length > 0 && data[0].generated_text) {
      botReply = data[0].generated_text;
    }

    res.json({ reply: botReply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to connect to HuggingFace API" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
