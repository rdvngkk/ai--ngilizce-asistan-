import React, { useState, useEffect, useRef } from 'react';
import type { Message, Source } from '../types';

interface ChatContainerProps {
    messages: Message[];
    isLoading: boolean;
}

const SpeakerIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-5 h-5"}>
        <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.348 2.595.341 1.24 1.518 1.905 2.66 1.905H6.44l4.5 4.5c.944.945 2.56.276 2.56-1.06V4.06ZM18.584 12c0-1.857-.87-3.58-2.298-4.702a.75.75 0 0 0-1.116.986A4.116 4.116 0 0 1 16.084 12a4.116 4.116 0 0 1-.914 2.716.75.75 0 1 0 1.116.986A5.617 5.617 0 0 0 18.584 12ZM21.583 12c0-3.363-1.58-6.42-4.298-8.45a.75.75 0 0 0-1.092 1.018A7.12 7.12 0 0 1 19.083 12a7.12 7.12 0 0 1-2.89 5.432.75.75 0 1 0 1.092 1.018C20.003 18.42 21.583 15.363 21.583 12Z" />
    </svg>
);

const LinkIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-4 h-4"}>
    <path fillRule="evenodd" d="M12.586 4.586a2 2 0 1 1 2.828 2.828l-3 3a2 2 0 0 1-2.828 0 1 1 0 0 0-1.414 1.414 4 4 0 0 0 5.656 0l3-3a4 4 0 0 0-5.656-5.656l-1.5 1.5a1 1 0 1 0 1.414 1.414l1.5-1.5Zm-5 5a2 2 0 0 1 2.828 0 1 1 0 1 0 1.414-1.414 4 4 0 0 0-5.656 0l-3 3a4 4 0 1 0 5.656 5.656l1.5-1.5a1 1 0 1 0-1.414-1.414l-1.5 1.5a2 2 0 1 1-2.828-2.828l3-3Z" clipRule="evenodd" />
  </svg>
);


const Sources: React.FC<{ sources: Source[] }> = ({ sources }) => (
    <div className="mt-3 pt-3 border-t border-indigo-200">
        <strong className="text-sm font-semibold text-gray-700">📚 Kaynaklar:</strong>
        <div className="flex flex-wrap gap-2 mt-2">
            {sources.map((source, index) => (
                <a
                    key={index}
                    href={source.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-xs font-medium hover:bg-indigo-200 hover:text-indigo-900 transition-colors duration-200"
                >
                    <LinkIcon className="w-3 h-3"/>
                    <span>{source.title}</span>
                </a>
            ))}
        </div>
    </div>
);


const ChatMessage: React.FC<{ message: Message }> = ({ message }) => {
    const isUser = message.role === 'user';
    const [isSpeaking, setIsSpeaking] = useState(false);

    const handleSpeak = (text: string) => {
        if (!('speechSynthesis' in window) || isSpeaking) return;

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => {
            console.error("Speech synthesis error");
            setIsSpeaking(false);
        };
        
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
    };

    const renderMessageContent = () => {
        let textToSpeak: string | null = null;
        const pronounceRegex = /\|\|(.*?)\|\|/;
        
        const match = pronounceRegex.exec(message.text);
        if (match && match[1]) {
            textToSpeak = match[1];
        }

        const withPronounceBolded = message.text.replace(/\|\|(.*?)\|\|/g, '<strong>$1</strong>');
        const withMarkdownBolded = withPronounceBolded.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        const finalHtml = withMarkdownBolded.replace(/\n/g, '<br />');

        return { htmlContent: finalHtml, textToSpeak };
    };

    const { htmlContent, textToSpeak } = renderMessageContent();

    return (
        <div className={`flex w-full items-start gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div
                className={`max-w-[85%] p-3 md:p-4 rounded-2xl shadow-md animate-fadeInUp ${
                    isUser
                        ? 'bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white rounded-br-lg'
                        : 'bg-indigo-100 text-gray-800 rounded-bl-lg border-l-4 border-[#667eea]'
                }`}
            >
                <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
                {message.sources && message.sources.length > 0 && <Sources sources={message.sources} />}
            </div>
            {textToSpeak && !isUser && (
                <button 
                    onClick={() => handleSpeak(textToSpeak!)} 
                    disabled={isSpeaking}
                    className={`p-2 rounded-full mt-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#667eea] ${
                        isSpeaking 
                            ? 'bg-indigo-400 text-white animate-pulse' 
                            : 'bg-gray-200 text-gray-600 hover:bg-indigo-200 hover:text-[#667eea]'
                    }`}
                    aria-label={`Listen to the pronunciation of ${textToSpeak}`}
                >
                    <SpeakerIcon className="w-5 h-5" />
                </button>
            )}
        </div>
    );
};


const TypingIndicator: React.FC = () => (
    <div className="flex justify-start">
        <div className="p-4 bg-indigo-100 rounded-2xl rounded-bl-lg flex items-center space-x-2">
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
        </div>
    </div>
);

const ChatContainer: React.FC<ChatContainerProps> = ({ messages, isLoading }) => {
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    return (
        <div className="h-96 border-2 border-gray-200 rounded-xl p-4 overflow-y-auto mb-5 bg-gray-50/50 flex flex-col gap-4">
            {messages.map((msg, index) => (
                <ChatMessage key={index} message={msg} />
            ))}
            {isLoading && <TypingIndicator />}
            <div ref={chatEndRef} />
            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeInUp { animation: fadeInUp 0.3s ease-out; }
            `}</style>
        </div>
    );
};

export default ChatContainer;
