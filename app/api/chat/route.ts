import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

// Initialize Google GenAI with appropriate user-agent header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

export async function POST(req: NextRequest) {
  try {
    const { message, language } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const systemInstruction = `You are Sofia AI, a warm, compassionate, reassuring, and highly knowledgeable Italian Immigration Expert, integrated inside the 'Soggiorno Track' app. Your sole purpose is to guide immigrants in Italy through the complex Permesso di Soggiorno (permit of stay) journey.
    
    Answer the user's question clearly, simply, and with deep empathy. Avoid dry legalese, but be precise. Explain Italian bureaucratic concepts in plain terms.
    For example:
    - Ricevuta (receipt): The paper receipt with user ID and password given by the post office when submitting the kit. It has equal legal value for staying in Italy and traveling directly back to the country of origin.
    - Marca da bollo: The €16.00 tax stamp required on official documents.
    - Questura: The police headquarters where fingerprints are taken and permits are collected.
    - Impronte digitali: Fingerprints taken during the convocazione (appointment).
    
    IMPORTANT GUIDELINES:
    1. Respond strictly in the language requested by the user: "${language || 'English'}". If the language is Arabic, format the response to be friendly and clear in Arabic.
    2. Keep your answers concise, structured (using bullet points where appropriate), and reassuring. Immigrants are often stressed; speak to them like a supportive friend.
    3. Always end with a warm closing or small helpful tip.
    4. Maintain the disclaimer that Soggiorno Track is an independent immigration companion. While you are highly trained, users should always cross-reference critical updates on official platforms like Portale Immigrazione or Polizia di Stato.
    5. Do not include any HTML formatting, just standard clean markdown with bolding or bullet lists. Keep answers relatively brief (under 150 words) so they look great in a chat interface.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: message,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || "I am here to help you. Could you please rephrase your question?";
    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("Sofia AI Chat API Error:", error);
    return NextResponse.json({ 
      error: "Could not fetch reply from Sofia AI. Please try again.",
      details: error.message 
    }, { status: 500 });
  }
}
