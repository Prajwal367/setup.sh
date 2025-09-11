const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const HF_API_URL = "https://api-inference.huggingface.co/models/meta-llama/Llama-3.1-8B-Instruct";
const HF_API_KEY = process.env.HF_API_KEY; // ye apne Render ke env vars me daal

// Health check
app.get("/", (req, res) => {
  res.send("MediBot Backend is running with Hugging Face!");
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
      body: JSON.stringify({
        inputs: `You are a helpful medical assistant. Patient says: "${message}". Give safe and general advice.`
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error });
    }

    res.json({ reply: data[0]?.generated_text || "No response from MediBot." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to connect to Hugging Face API" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
