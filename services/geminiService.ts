import type { Source } from '../types';

class GeminiService {
  public async sendMessage(message: string, useSearch: boolean): Promise<{ text: string; sources: Source[] }> {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, useSearch }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'API request failed');
      }

      const data = await response.json();
      return data;

    } catch (error) {
      console.error("Error sending message via proxy:", error);
      const errorMessage = error instanceof Error ? error.message : "Üzgünüm, bir hata oluştu. Lütfen daha sonra tekrar deneyin.";
      return { text: errorMessage, sources: [] };
    }
  }
}

export const geminiService = new GeminiService();
