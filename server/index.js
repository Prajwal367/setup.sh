// index.js (backend)

import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Example: using openFDA API
app.post("/chat", async (req, res) => {
  const { message } = req.body;

  try {
    // Call openFDA API
    const response = await fetch(
      `https://api.fda.gov/drug/label.json?search=openfda.generic_name:${message}&limit=1`
    );

    if (!response.ok) {
      throw new Error(`FDA API error: ${response.status}`);
    }

    const data = await response.json();
    const drug = data.results?.[0];

    const medicineName =
      drug?.openfda?.generic_name?.[0] || "Unknown medicine";
    const purpose =
      drug?.purpose?.[0] || "No purpose info available";

    // Smart fallback for warnings
    const warning =
      drug?.warnings?.[0] ||
      "⚠️ General Warning: Consult a doctor before use. Side effects may vary depending on patient condition.";

    const reply = `💊 Medicine: ${medicineName}\n📌 Purpose: ${purpose}\n⚠️ Warning: ${warning}`;

    res.json({ reply });
  } catch (err) {
    console.error("❌ Backend Error:", err);
    res.status(500).json({ reply: "Server error, please try again later." });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
