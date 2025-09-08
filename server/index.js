const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Test route
app.get("/", (req, res) => {
  res.send("MediBot Backend is running!");
});

// New chat route
app.post("/chat", (req, res) => {
  const userMessage = req.body.message;

  // Simple static reply (later AI laga denge)
  const botReply = `You said: "${userMessage}". This is MediBot's reply!`;

  res.json({ reply: botReply });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
