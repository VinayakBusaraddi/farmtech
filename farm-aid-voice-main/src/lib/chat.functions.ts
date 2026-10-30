import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const messageSchema = z.object({
  role: z.enum(["user", "assistant", "system"]),
  content: z.string().min(1).max(4000),
});

const inputSchema = z.object({
  messages: z.array(messageSchema).min(1).max(30),
  lang: z.enum(["en", "hi"]).default("en"),
});

export const chatWithAssistant = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => inputSchema.parse(d))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      return { error: "AI service is not configured.", reply: "" };
    }

    const langInstruction =
      data.lang === "hi"
        ? "Always reply in simple Hindi (Devanagari script). Use short sentences a farmer can understand."
        : "Always reply in simple, plain English. Use short sentences a farmer can understand.";

    const systemPrompt = `You are KisanMitra, a friendly AI assistant for Indian farmers. ${langInstruction}
Help with: crop prices, mandi advice, weather guidance, fertilizer/pesticide tips, government schemes (PM-KISAN, PMFBY, KCC, eNAM, MSP), and selling decisions.
Keep answers under 120 words. If a question is outside farming, gently steer back. Never invent specific live prices — instead suggest checking the Dashboard.`;

    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [{ role: "system", content: systemPrompt }, ...data.messages],
        }),
      });

      if (res.status === 429) return { error: "Rate limit reached. Please try again in a moment.", reply: "" };
      if (res.status === 402) return { error: "AI credits exhausted. Add credits in workspace settings.", reply: "" };
      if (!res.ok) {
        const txt = await res.text();
        console.error("AI gateway error", res.status, txt);
        return { error: "Assistant is temporarily unavailable.", reply: "" };
      }

      const json = await res.json();
      const reply = json?.choices?.[0]?.message?.content ?? "";
      return { reply, error: null as string | null };
    } catch (err) {
      console.error("chat error", err);
      return { error: "Network error talking to assistant.", reply: "" };
    }
  });
