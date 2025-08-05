import React, { useState, useCallback } from 'react';
import type { Message } from './types';
import { INITIAL_MESSAGE } from './constants';
import { geminiService } from './services/geminiService';
import ChatContainer from './components/ChatContainer';
import InputBar from './components/InputBar';
import FeaturesInfo from './components/FeaturesInfo';

const App: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [useWebSearch, setUseWebSearch] = useState<boolean>(false);

    const handleSendMessage = useCallback(async (userInput: string) => {
        if (!userInput.trim() || isLoading) return;

        const userMessage: Message = { role: 'user', text: userInput };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            const { text, sources } = await geminiService.sendMessage(userInput, useWebSearch);
            const aiMessage: Message = { role: 'model', text, sources };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error("Failed to send message:", error);
            const errorMessage: Message = { role: 'model', text: "Üzgünüm, bir hata oluştu. Lütfen daha sonra tekrar deneyin." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, useWebSearch]);

    return (
        <div className="font-sans bg-gradient-to-br from-[#667eea] to-[#764ba2] min-h-screen text-gray-800 p-4 flex items-center justify-center">
            <div className="container max-w-3xl mx-auto w-full">
                <header className="text-center text-white mb-6">
                    <h1 className="text-4xl md:text-5xl font-bold mb-2 drop-shadow-lg">🤖 AI İngilizce Asistanı</h1>
                    <p className="text-lg md:text-xl opacity-90">Akıllı İngilizce öğrenme yardımcınız</p>
                </header>

                <main className="bg-white/95 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-2xl">
                    <div className="text-center mb-6">
                        <h3 className="text-2xl font-bold text-[#667eea]">💬 Senin Kişisel İngilizce Öğretmenin</h3>
                        <p className="text-md text-gray-600 mt-1">Sorularını sor, cümlelerini kontrol ettir, kelime anlamlarını öğren!</p>
                    </div>

                    <ChatContainer messages={messages} isLoading={isLoading} />
                    <InputBar 
                        onSendMessage={handleSendMessage} 
                        isLoading={isLoading} 
                        useWebSearch={useWebSearch}
                        onWebSearchToggle={() => setUseWebSearch(prev => !prev)}
                    />
                    <FeaturesInfo />
                </main>
            </div>
        </div>
    );
};

export default App;
