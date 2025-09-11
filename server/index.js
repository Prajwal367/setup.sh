const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Health check
app.get("/", (req, res) => {
  res.json({ message: "MediBot Backend running with OpenFDA API" });
});

// Chat endpoint
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Call OpenFDA API
    const response = await fetch(
      `https://api.fda.gov/drug/label.json?search=${encodeURIComponent(message)}&limit=1`
    );
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const drug = data.results[0];
      const medicineName = drug.openfda?.brand_name?.[0] || "Unknown medicine";
      const purpose = drug.purpose?.[0] || "No purpose info available";
      const warning = drug.warning?.[0] || "No warnings available";

      res.json({
        reply: `💊 Medicine: ${medicineName}\n📌 Purpose: ${purpose}\n⚠️ Warning: ${warning}`
      });
    } else {
      res.json({
        reply: "❌ Sorry, I couldn't find any medicine info for that symptom."
      });
    }
  } catch (error) {
    console.error("Backend Error:", error);
    res.status(500).json({ error: "Failed to fetch from OpenFDA API" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
