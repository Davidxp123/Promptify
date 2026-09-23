// app/api/improvise/route.js
import Groq from "groq-sdk";
import { buildSystemPrompt, getPersona } from "@/lib/personas";

// Ordered fallback list: if the first model is rate-limited (429) or
// unavailable, retry with the next one before giving up.
// Check console.groq.com/docs/models for the current model IDs available
// to your account — these change over time.
const MODEL_FALLBACKS = [
  process.env.GROQ_MODEL || "llama-3.1-8b-instant",
  "openai/gpt-oss-120b",
  "llama-3.3-70b-versatile",
];

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

function extractJson(text) {
  // Defensive parsing in case the model wraps JSON in ```json fences
  // despite instructions not to.
  const cleaned = text
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "");
  return JSON.parse(cleaned);
}

async function callGroqWithFallback(systemPrompt, userInput) {
  let lastError;

  for (const model of MODEL_FALLBACKS) {
    try {
      const completion = await groq.chat.completions.create({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userInput },
        ],
        response_format: { type: "json_object" },
        temperature: 0.6,
      });

      const text = completion.choices?.[0]?.message?.content;
      if (!text) throw new Error("Empty response from model");

      return extractJson(text);
    } catch (err) {
      lastError = err;
      const status = err?.status || err?.response?.status;
      const code = err?.error?.error?.code;
      const retryable =
        status === 429 || status === 503 || status === 500 ||
        (status === 404 && code === "model_not_found");
      if (!retryable) throw err; // non-retryable error, stop immediately
      // otherwise fall through to the next model in the list
    }
  }

  throw lastError || new Error("All model fallbacks failed");
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { mode, input } = body || {};

    if (!input || typeof input !== "string" || !input.trim()) {
      return Response.json(
        { error: "Please provide some raw thoughts to improvise." },
        { status: 400 }
      );
    }

    const persona = getPersona(mode);
    const systemPrompt = buildSystemPrompt(persona.id);

    const result = await callGroqWithFallback(systemPrompt, input.trim());

    if (!result?.sections || !Array.isArray(result.sections)) {
      throw new Error("Model returned an unexpected shape");
    }

    return Response.json({ persona: persona.id, sections: result.sections });
  } catch (err) {
    console.error("[/api/improvise] error:", err);
    return Response.json(
      {
        error:
          "Something went wrong generating your prompt. Please try again in a moment.",
      },
      { status: 500 }
    );
  }
}