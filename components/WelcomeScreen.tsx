import React from 'react';

interface WelcomeScreenProps {
    onSendMessage: (prompt: string) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSendMessage }) => {
    const quickResponses = [
        "What services does KNAV offer?",
        "Tell me about KNAV's global presence.",
        "Summarize the latest financial regulations.",
    ];

    return (
        <div className="flex-1 flex flex-col justify-center items-center p-4 text-center">
            <div className="max-w-3xl w-full">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-200 mb-16">
                    Welcome to KNAV PDF Chatbot!
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {quickResponses.map((prompt) => (
                         <button
                            key={prompt}
                            onClick={() => onSendMessage(prompt)}
                            className="p-4 bg-white dark:bg-[#2a2a2e] border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600/80 transition-colors duration-200 text-left h-full flex flex-col justify-center"
                         >
                            <p className="font-semibold text-gray-700 dark:text-gray-300">{prompt}</p>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WelcomeScreen;