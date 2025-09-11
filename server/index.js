const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const HF_API_KEY = process.env.HF_API_KEY;

// Health check
app.get("/", (req, res) => {
  res.json({ message: "MediBot Backend is running ✅" });
});

// Chat endpoint
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ reply: "⚠️ Message is required." });
    }

    // Call Hugging Face Inference API
    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: `You are a helpful medical assistant. Patient symptom: "${message}". 
                   Provide possible causes and simple remedies (general guidance only, not prescriptions).`,
          parameters: { max_new_tokens: 200 },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HF API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("HF Response:", data);

    const reply = data[0]?.generated_text || "Sorry, I couldn't generate a response.";

    res.json({ reply });
  } catch (error) {
    console.error("❌ Backend Error:", error);
    res.status(500).json({ reply: "Error: Unable to connect to Hugging Face." });
  }
});

app.listen(PORT, () => {
  console.log(`✅ MediBot server running on port ${PORT}`);
});
