
import { GoogleGenAI } from "@google/genai";
import { Verse, Language } from '../types';

export async function getVerseInsight(verse: Verse, book: string, chapter: number, language: Language): Promise<string> {
  if (!process.env.API_KEY) {
    return "API key not configured. Please set the API_KEY environment variable.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    let langInstruction = "Respond in English.";
    if (language === 'pt') {
        langInstruction = "Responda em Português do Brasil.";
    }

    const prompt = `Provide a brief theological explanation and historical context for the following Bible verse: "${verse.text}" from ${book} ${chapter}:${verse.verse}. Keep the explanation concise, clear, and suitable for a general audience. Structure your response in markdown. ${langInstruction}`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Error fetching verse insight from Gemini API:", error);
    return language === 'pt' 
        ? "Desculpe, não consegui buscar insights para este versículo. Verifique sua chave de API e conexão."
        : "Sorry, I couldn't fetch insights for this verse. Please check your API key and network connection.";
  }
}
