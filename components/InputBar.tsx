import React, { useState } from 'react';

interface InputBarProps {
    onSendMessage: (input: string) => void;
    isLoading: boolean;
    useWebSearch: boolean;
    onWebSearchToggle: () => void;
}

const SendIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
    </svg>
);

const SearchToggle: React.FC<{ isEnabled: boolean; onToggle: () => void; isDisabled: boolean; }> = ({ isEnabled, onToggle, isDisabled }) => (
    <label htmlFor="search-toggle" className={`flex items-center cursor-pointer select-none ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
        <span className="mr-3 text-sm text-gray-700 font-semibold">Web'de Ara 🌐</span>
        <div className="relative">
            <input
                type="checkbox"
                id="search-toggle"
                className="sr-only peer"
                checked={isEnabled}
                onChange={onToggle}
                disabled={isDisabled}
            />
            <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-gradient-to-r from-[#667eea] to-[#764ba2] transition-colors"></div>
            <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5"></div>
        </div>
    </label>
);

const InputBar: React.FC<InputBarProps> = ({ onSendMessage, isLoading, useWebSearch, onWebSearchToggle }) => {
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (input.trim() && !isLoading) {
            onSendMessage(input);
            setInput('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    return (
        <div className="flex flex-col sm:flex-row gap-3 items-center">
            <input
                type="text"
                id="userInput"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="İngilizce sorunuzu yazın..."
                className="flex-1 w-full py-3 px-5 border-2 border-gray-300 rounded-full font-medium text-gray-700
                           focus:outline-none focus:ring-2 focus:ring-[#667eea] focus:border-transparent transition"
                disabled={isLoading}
            />
            <div className="flex items-center gap-4">
                <SearchToggle isEnabled={useWebSearch} onToggle={onWebSearchToggle} isDisabled={isLoading} />
                <button
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                    className="bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white p-3 rounded-full 
                               cursor-pointer transition-all duration-300 ease-in-out hover:shadow-lg
                               hover:scale-105 active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 disabled:hover:shadow-none"
                    aria-label="Gönder"
                >
                    <SendIcon />
                </button>
            </div>
        </div>
    );
};

export default InputBar;
