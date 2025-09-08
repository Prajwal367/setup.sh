const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const OpenAI = require("openai");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;
    const response = await client.responses.create({
      model: "gpt-5-mini",
      input: `You are a professional medical assistant chatbot. Reply to the user's symptom query: ${userMessage}`
    });
    res.json({ reply: response.output[0].content[0].text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong!" });
  }
});

app.get("/", (req, res) => {
  res.send("MediBot Backend is running with AI!");
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
