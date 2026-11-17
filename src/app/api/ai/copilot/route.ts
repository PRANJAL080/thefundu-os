import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { query, storeSummary } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ fallback: true });
    }

    // Call Gemini 1.5 Flash
    const systemPrompt = `You are "TheFundu AI Copilot", an expert bilingual (Hindi / Hinglish / English) retail intelligence assistant for TheFundu Inventory OS (a certified refurbished smartphone retail & buyback management system in Lucknow, India).
Answer store manager queries in polite, concise, professional Hinglish / Hindi. 
Always include accurate numbers from the provided store snapshot. Keep responses under 3-4 sentences.

Current Store Snapshot:
${JSON.stringify(storeSummary || {}, null, 2)}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                { text: systemPrompt },
                { text: `User Query: "${query}"` },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 250,
          },
        }),
      }
    );

    if (!response.ok) {
      return NextResponse.json({ fallback: true });
    }

    const data = await response.json();
    const candidateText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || null;

    if (!candidateText) {
      return NextResponse.json({ fallback: true });
    }

    return NextResponse.json({
      fallback: false,
      answerHindi: candidateText.trim(),
    });
  } catch (error) {
    return NextResponse.json({ fallback: true });
  }
}
