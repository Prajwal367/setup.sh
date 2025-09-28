import express from "express";
import cors from "cors";
import fs from "fs";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// diseases.json ko read karo
const diseases = JSON.parse(fs.readFileSync("./diseases.json", "utf-8"));

// Root route
app.get("/", (req, res) => {
  res.json({ message: "MediBot API running ✅", creator: "Prajwal Mitra" });
});

// Chat endpoint
app.post("/chat", (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.json({ reply: "❌ Please provide symptoms or disease name." });
  }

  const query = message.toLowerCase();
  const disease = diseases[query];

  if (disease) {
    const reply = `💊 Medicine: ${disease.medicine}\n⚠️ Warning: ${disease.warning}`;
    res.json({ reply });
  } else {
    res.json({
      reply:
        "⚠️ Sorry, I don’t have information about this disease. Please consult a doctor."
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
