import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

// ✅ __dirname fix for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// ✅ Always read diseases.json with absolute path
const diseasesPath = path.join(__dirname, "diseases.json");
const diseases = JSON.parse(fs.readFileSync(diseasesPath, "utf-8"));

app.post("/chat", (req, res) => {
  const { message } = req.body;
  const query = message.toLowerCase();

  const found = diseases.find((d) => d.disease.toLowerCase() === query);

  if (found) {
    const reply = `💊 Medicine: ${found.medicine}\n📌 Purpose: ${found.purpose}\n⚠️ Warning: ${found.warning}`;
    res.json({ reply });
  } else {
    res.json({
      reply: "❌ Sorry, no information found. Please consult a doctor."
    });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
