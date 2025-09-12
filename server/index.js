// index.js (backend)

import express from "express";
import cors from "cors";
import diseases from "./diseases.json" assert { type: "json" };  // ✅ yaha import kara

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Chat endpoint
app.post("/chat", (req, res) => {
  const { message } = req.body;
  const query = message.toLowerCase();

  // Disease search
  const found = Object.keys(diseases).find(d =>
    query.includes(d.toLowerCase())
  );

  if (found) {
    const info = diseases[found];
    const reply = `🦠 Disease: ${found}\n💊 Medicine: ${info.medicine}\n📌 Purpose: ${info.purpose}\n⚠️ General Warning: Consult a doctor before use. Side effects may vary depending on patient condition.`;
    res.json({ reply });
  } else {
    res.json({
      reply: "❌ Sorry, I don't have information about this disease."
    });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
