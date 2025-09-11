const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "MediBot API running", creator: "Prajwal Mitra" });
});

// ---- Chat Endpoint ----
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    // abhi dummy reply
    const botReply = `You said: "${message}". MediBot is active ✅`;

    res.json({ reply: botReply });
  } catch (error) {
    console.error("❌ Backend error:", error);
    res.status(500).json({ error: "Failed to process message" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
