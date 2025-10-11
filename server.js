import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

/**
 * Call Hugging Face Router API for text-to-image
 */
async function generateImage(prompt) {
  const HF_API_URL =
    "https://router.huggingface.co/fal-ai/fal-ai/hunyuan-image/v3/text-to-image";

  try {
    console.log("📡 Requesting image from Hugging Face...");

    const response = await fetch(HF_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sync_mode: true,
        prompt: prompt,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("❌ HF API Error:", text);
      throw new Error(`Model request failed: ${text}`);
    }

    // Convert binary to base64 for frontend
    const buffer = Buffer.from(await response.arrayBuffer());
    const base64Image = buffer.toString("base64");

    return base64Image;
  } catch (err) {
    console.error("⚠️ Error generating image:", err.message);
    throw err;
  }
}

/**
 * POST /generate-logo
 */
app.post("/generate-logo", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const imageBase64 = await generateImage(prompt);

    res.json({
      image: `data:image/png;base64,${imageBase64}`, // frontend can <img src="...">
    });
  } catch (err) {
    res.status(500).json({
      error:
        err.message ||
        "Failed to generate logo. Please try again later.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
