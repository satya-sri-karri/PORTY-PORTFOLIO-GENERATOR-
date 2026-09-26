const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const OpenAI = require("openai");

let groq = null;
if (process.env.GROQ_API_KEY) {
  groq = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
  });
}

const getClient = () => {
  if (!groq) throw new Error("AI service not configured. Add GROQ_API_KEY to .env");
  return groq;
};

const MODELS = Array.from(
  new Set([
    process.env.GROQ_MODEL,
    "openai/gpt-oss-120b",
    "openai/gpt-oss-20b",
  ].filter(Boolean))
);

const generate = async (system, prompt) => {
  const client = getClient();
  let lastErr;

  for (const model of MODELS) {
    try {
      const body = {
        model,
        messages: [
          { role: "system", content: system },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 500,
      };
      // gpt-oss spends tokens on reasoning, which is wasted for short copywriting
      // and can leave too little room for the response.
      if (model.startsWith("openai/gpt-oss")) body.reasoning_effort = "low";

      const res = await client.chat.completions.create(body);
      return res.choices[0].message.content;
    } catch (err) {
      lastErr = err;
      if (err?.status !== 404) throw err;
      console.warn(`Model ${model} unavailable, trying next fallback.`);
    }
  }

  throw lastErr;
};

router.post("/bio", auth, async (req, res) => {
  try {
    const { name, title, skills, experience } = req.body;
    if (!name) return res.status(400).json({ error: "Name is required." });

    const expSummary = experience?.length
      ? experience.map(e => `${e.role} at ${e.company} (${e.duration})`).join(", ")
      : "fresher / student";
    const skillsList = skills?.length ? skills.slice(0, 10).join(", ") : "software development";

    const system = "You are a professional portfolio writer. Write concise, compelling bios.";
    const prompt = `Write a professional portfolio bio for ${name}, a ${title || "software developer"}.
Skills: ${skillsList}.
Experience: ${expSummary}.

Requirements:
- 3-4 sentences, first person
- Confident but not arrogant
- End with current focus or what they seek
- No clichés like "passionate developer"
- Sound human, not AI-generated
- Plain text only, no markdown`;

    const bio = await generate(system, prompt);
    res.json({ success: true, bio: bio.trim() });
  } catch (err) {
    console.error("Bio generation error:", err.message);
    res.status(500).json({ error: "AI error: " + err.message });
  }
});

router.post("/skills", auth, async (req, res) => {
  try {
    const { title, currentSkills } = req.body;
    if (!title) return res.status(400).json({ error: "Job title is required." });

    const existing = currentSkills?.join(", ") || "none yet";
    const system = "You are a technical recruiter. Suggest modern, relevant skills.";
    const prompt = `Suggest exactly 12 relevant technical skills for a ${title}.
Current skills: ${existing}.

Rules:
- Do NOT repeat existing skills
- Focus on modern, in-demand technologies
- Mix of languages, frameworks, tools, and concepts
- Return ONLY a JSON array of strings, nothing else`;

    const text = await generate(system, prompt);
    const match = text.match(/\[[\s\S]*\]/);
    if (!match) throw new Error("Invalid AI response format");
    const suggestions = JSON.parse(match[0]);
    res.json({ success: true, skills: suggestions.slice(0, 12) });
  } catch (err) {
    console.error("Skills suggestion error:", err.message);
    res.status(500).json({ error: "AI error: " + err.message });
  }
});

router.post("/project", auth, async (req, res) => {
  try {
    const { title, techStack } = req.body;
    if (!title) return res.status(400).json({ error: "Project title is required." });

    const tech = techStack?.length ? techStack.join(", ") : "modern web technologies";
    const system = "You are a technical writer. Write concise, impressive project descriptions.";
    const prompt = `Write a project description for "${title}" built with ${tech}.

Requirements:
- 2-3 sentences
- Explain what it does and the problem it solves
- Mention key technology
- Sound impressive but honest
- Plain text only, no markdown`;

    const description = await generate(system, prompt);
    res.json({ success: true, description: description.trim() });
  } catch (err) {
    console.error("Project description error:", err.message);
    res.status(500).json({ error: "AI error: " + err.message });
  }
});

router.post("/theme-recommend", auth, async (req, res) => {
  try {
    const { title, skills, about } = req.body;
    const system = "You are a design consultant. Recommend one theme based on the user's profile.";
    const prompt = `Recommend the single best portfolio theme for this person.
Title: ${title || "Software Developer"}
Skills: ${skills?.join(", ") || ""}
About: ${about || ""}

Available themes:
- aurora: Creative generalist
- minimalist: Senior developer, PM
- editorial: Writer, designer
- neon-terminal: Developer, hacker
- brutalist: Bold creative
- neumorphic: Product designer
- kinetic: Motion designer
- executive: Business, consultant
- retro-wave: Game dev, creative coder
- organic: Photographer, wellness
- bento: Modern SaaS, startup
- dark-luxe: Freelancer, agency

Return ONLY a JSON object: {"theme": "theme-id", "reason": "one sentence why"}`;

    const text = await generate(system, prompt);
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("Invalid response");
    const result = JSON.parse(match[0]);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ error: "AI error: " + err.message });
  }
});

module.exports = router;
