import { GoogleGenAI, Content, GenerateContentResponse } from "@google/genai";
import type { Source } from '../types';

// API anahtarını, 'process' nesnesinin tanımlı olmadığı tarayıcı ortamlarında uygulamanın çökmemesi için güvenli bir şekilde al.
// Vercel'de bu isimle bir Environment Variable oluşturmalısınız.
const API_KEY = (typeof process !== 'undefined' && process.env) ? process.env.API_KEY : undefined;

const SYSTEM_INSTRUCTION = `You are a friendly, encouraging, and expert AI English teacher designed for Turkish speakers. Your name is "AI İngilizce Asistanı".
- Always respond in Turkish unless the user specifically asks you to speak in English.
- When correcting grammar, first provide the correct version in bold (e.g., **I went to school**), then explain the rule in a simple and clear way. Use Turkish for explanations and provide examples.
- When asked for a word's meaning (e.g., "beautiful ne demek?"), provide the Turkish translation, an example sentence in English, and its Turkish translation.
- When asked for pronunciation of a word or phrase, provide a simple, easy-to-understand phonetic transcription. Crucially, you **MUST** wrap the original English word or phrase to be pronounced in double pipe characters so the app can speak it. For example: "The word is ||beautiful|| (byoo-ti-ful)." or "You say it like this: ||I am learning English||".
- Keep your answers concise, friendly, and use emojis to make the interaction more engaging (like 🚀, 📝, 📚, 💡, ✅, 🤔, 🌐).
- Format your responses with markdown for clarity, especially using bold for keywords and corrections. Use newlines for better readability.
- If the user's query is unclear, ask for clarification.
- Never refuse a request related to learning English.`;

let ai: GoogleGenAI | null = null;

// Başlatmayı, uygulamanın yüklenirken çökmesini önlemek için bir try-catch bloğu içine al.
try {
    if (!API_KEY) {
        console.warn("API Anahtarı bulunamadı. Lütfen Vercel'deki ortam değişkenlerini (Environment Variables) kontrol edin.");
    } else {
        ai = new GoogleGenAI({ apiKey: API_KEY });
    }
} catch (e) {
    console.error("GoogleGenAI başlatılırken bir hata oluştu. API anahtarınızın geçerli olduğundan emin olun:", e);
    ai = null; // Başlatma başarısız olursa ai'nin null olduğundan emin olun.
}

const sendMessage = async (history: Content[], newMessage: string, useSearch: boolean): Promise<{ text: string; sources: Source[] }> => {
    if (!ai) {
        return {
            text: "Üzgünüm, AI servisi şu anda kullanılamıyor. Lütfen API anahtarının Vercel ayarlarında doğru bir şekilde yapılandırıldığından emin olun.",
            sources: []
        };
    }

    const contents: Content[] = [...history, { role: "user", parts: [{ text: newMessage }] }];

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: contents,
            config: {
                systemInstruction: SYSTEM_INSTRUCTION,
                tools: useSearch ? [{ googleSearch: {} }] : undefined,
            }
        });

        const modelResponseText = response.text;
        const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
        const sources: Source[] = [];

        if (groundingMetadata?.groundingChunks) {
            for (const chunk of groundingMetadata.groundingChunks) {
                if (chunk.web && chunk.web.uri) {
                    sources.push({
                        uri: chunk.web.uri,
                        title: chunk.web.title || new URL(chunk.web.uri).hostname.replace('www.', ''),
                    });
                }
            }
        }
        return { text: modelResponseText, sources };

    } catch (error) {
        console.error("Error sending message to AI:", error);
        const errorMessage = error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu.";
        return { text: `Üzgünüm, bir hata oluştu: ${errorMessage}. Lütfen daha sonra tekrar deneyin.`, sources: [] };
    }
};

export const geminiService = { sendMessage };
