import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("✅ Backend is running...");
});

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Hugging Face Inference API call
    const response = await fetch(
      "https://api-inference.huggingface.co/models/google/flan-t5-base",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: `You are a medical assistant. Patient says: "${message}". Provide safe, general medical advice only.`,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ HF API error:", errorText);
      return res
        .status(response.status)
        .json({ error: "HF API error", details: errorText });
    }

    const data = await response.json();

    // Hugging Face API returns array sometimes
    const botReply =
      (data[0] && data[0].generated_text) ||
      data.generated_text ||
      "I'm not sure, please consult a doctor.";

    res.json({ reply: botReply });
  } catch (error) {
    console.error("❌ Backend Error:", error);
    res.status(500).json({ error: "Backend error", details: error.message });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
