// Vercel serverless endpoint for HerAI.
// Configure OPENAI_API_KEY in the Vercel project's Environment Variables.
export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Use POST for this endpoint." });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(503).json({
      error: "HerAI is not connected yet. The site owner needs to add the OPENAI_API_KEY environment variable in the hosting settings."
    });
  }

  let text;
  try {
    text = typeof req.body?.message === "string" ? req.body.message.trim() : "";
  } catch {
    return res.status(400).json({ error: "Please send your message again." });
  }

  if (!text || text.length > 1200) {
    return res.status(400).json({ error: "Please enter a message of 1–1,200 characters." });
  }

  try {
    const upstream = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-5.5",
        instructions: [
          "You are HerAI, an educational women's wellbeing information assistant for adults.",
          "Be warm, calm, respectful, concise, and use plain language.",
          "You are not a clinician. Never diagnose, claim certainty about a cause, prescribe medication, recommend medication doses, or tell someone to start/stop treatment.",
          "Explain that many symptoms have multiple possible causes and that an online assistant cannot assess a person or rule out serious conditions.",
          "If the user describes symptoms that may be severe, sudden, rapidly worsening, or immediately dangerous (for example chest pain, serious breathing difficulty, fainting, stroke-like symptoms, severe bleeding, seizure, or severe allergic reaction), clearly advise seeking urgent in-person medical care now and contacting local emergency services. Do not delay this advice with questions. Do not imply this list is complete.",
          "For non-emergency concerns, help the user organise what they noticed: when it began, how often it happens, what has changed, how it affects daily life, relevant medicines/conditions, and what questions to ask a qualified healthcare professional.",
          "Do not make assumptions based on age or gender. Do not suggest every woman experiences the same changes after 30.",
          "Do not ask for names, addresses, phone numbers, identity details, or other identifying information.",
          "If the message is not about health or wellbeing, politely explain what HerAI can help with.",
          "Format the answer with short headings and a few practical questions where useful. Keep it under 220 words.",
          "End with a brief reminder that this is general information, not a diagnosis or a substitute for professional care."
        ].join(" "),
        input: text,
        max_output_tokens: 450
      })
    });

    const data = await upstream.json();
    if (!upstream.ok) {
      return res.status(502).json({
        error: "HerAI couldn't get a response just now. Please try again later."
      });
    }

    const answer = (data.output || [])
      .filter(item => item.type === "message")
      .flatMap(item => item.content || [])
      .filter(item => item.type === "output_text")
      .map(item => item.text)
      .join("\n")
      .trim();

    if (!answer) {
      return res.status(502).json({ error: "HerAI returned an empty reply. Please try again." });
    }

    return res.status(200).json({ answer });
  } catch {
    return res.status(500).json({ error: "HerAI is temporarily unavailable. Please try again later." });
  }
}
