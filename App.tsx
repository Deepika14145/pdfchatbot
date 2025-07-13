
import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import ChatWindow from './components/ChatWindow';
import MessageInput from './components/MessageInput';
import WelcomeScreen from './components/WelcomeScreen';
import { type Message, MessageRole } from './types';
import { CloseIcon, PlusIcon, LockIcon, KNavLogoIcon, PdfIcon } from './components/Icons';

// --- Start of inlined components ---

// Toast Component
const Toast: React.FC<{ message: string; show: boolean }> = ({ message, show }) => (
  <div
    className={`fixed top-5 right-5 bg-green-600 text-white py-2 px-4 rounded-lg shadow-lg transition-all duration-300 ease-in-out ${
      show ? 'transform translate-x-0 opacity-100' : 'transform translate-x-full opacity-0'
    }`}
    aria-live="assertive"
    role="alert"
  >
    {message}
  </div>
);

// AdminLoginModal Component
const AdminLoginModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center" onClick={onClose} role="dialog" aria-modal="true">
      <div className="bg-white dark:bg-[#2E2E2E] rounded-xl shadow-2xl p-6 w-full max-w-md text-gray-800 dark:text-gray-200" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Admin Login</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors" aria-label="Close login modal">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onClose(); /* Placeholder */ }}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Username</label>
              <input type="text" id="username" placeholder="Enter username" className="w-full bg-gray-100 dark:bg-[#171717] border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Password</label>
              <input type="password" id="password" placeholder="Enter password" className="w-full bg-gray-100 dark:bg-[#171717] border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-8">
            <button type="button" onClick={onClose} className="py-2 px-5 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">Cancel</button>
            <button type="submit" className="py-2 px-5 bg-gray-500 text-white rounded-lg hover:bg-gray-400 transition-colors">Login</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Sidebar Component
const Sidebar: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onNewChat: () => void;
  onAdminLogin: () => void;
  onShowPdfs: () => void;
}> = ({ isOpen, onClose, onNewChat, onAdminLogin, onShowPdfs }) => {
  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-30 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      ></div>
      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-white dark:bg-[#1e1e1e] shadow-2xl z-40 p-5 flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10">
                    <KNavLogoIcon />
                </div>
            </div>
          <button onClick={onClose} className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" aria-label="Close menu">
            <CloseIcon className="w-7 h-7" />
          </button>
        </div>
        <div>
            <button onClick={onNewChat} className="w-full flex items-center gap-3 text-left p-3.5 rounded-lg bg-blue-600/90 hover:bg-blue-600 text-white font-semibold transition-colors">
                <PlusIcon className="w-5 h-5" />
                New Chat
            </button>
            <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>
            <div className="space-y-3">
                <button onClick={onAdminLogin} className="w-full flex items-center gap-3 text-left p-3.5 rounded-lg bg-purple-600/90 hover:bg-purple-600 text-white font-semibold transition-colors">
                    <LockIcon className="w-5 h-5" />
                    Admin Login
                </button>
                <button onClick={onShowPdfs} className="w-full flex items-center gap-3 text-left p-3.5 rounded-lg bg-red-700/90 hover:bg-red-700 text-white font-semibold transition-colors">
                    <PdfIcon className="w-5 h-5" />
                    Show PDFs
                </button>
            </div>
        </div>
      </div>
    </>
  );
};

// --- End of inlined components ---

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [showFeedbackToast, setShowFeedbackToast] = useState(false);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
      setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const handleSendMessage = useCallback(async (data: { text: string; file?: File }) => {
    const { text, file } = data;
    if (!text.trim() && !file) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: MessageRole.USER,
      content: text,
      file: file ? { name: file.name, type: file.type } : undefined,
    };
    
    setMessages(prev => [...prev, userMessage]);

    // Mock bot response
    setTimeout(() => {
      let botResponseContent = '';

      if (file) {
        botResponseContent = `I've received your file: "${file.name}". How can I assist with it?`;
      } else {
        const lowerCaseText = text.trim().toLowerCase();
        if (lowerCaseText === 'hi' || lowerCaseText === 'hello') {
          botResponseContent = 'Hello! How can I help you today?';
        } else {
          botResponseContent = `Thank you for your message. As a demo bot, I'm here to showcase the chat interface. How can I assist you further?`;
        }
      }
      
      const botMessage: Message = {
        id: `model-${Date.now()}`,
        role: MessageRole.MODEL,
        content: botResponseContent,
      };
      setMessages(prev => [...prev, botMessage]);
    }, 500);

  }, []);

  const handleNewChat = useCallback(() => {
    setMessages([]);
    setIsSidebarOpen(false);
  }, []);

  const handleAdminLoginClick = useCallback(() => {
    setIsSidebarOpen(false);
    setIsAdminLoginOpen(true);
  }, []);

  const handleShowPdfsClick = useCallback(() => {
    alert("This feature is coming soon!");
    setIsSidebarOpen(false);
  }, []);

  const handleFeedback = useCallback(() => {
    setShowFeedbackToast(true);
    setTimeout(() => {
      setShowFeedbackToast(false);
    }, 3000);
  }, []);


  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-[#171717] text-gray-800 dark:text-gray-200">
      <Header onMenuClick={() => setIsSidebarOpen(true)} theme={theme} onThemeToggle={toggleTheme} />
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onNewChat={handleNewChat}
        onAdminLogin={handleAdminLoginClick}
        onShowPdfs={handleShowPdfsClick}
      />
      <AdminLoginModal isOpen={isAdminLoginOpen} onClose={() => setIsAdminLoginOpen(false)} />
      <Toast message="Feedback submitted" show={showFeedbackToast} />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        {messages.length === 0 ? (
          <WelcomeScreen onSendMessage={(prompt) => handleSendMessage({ text: prompt })} />
        ) : (
          <ChatWindow messages={messages} onFeedback={handleFeedback} />
        )}
      </main>
      <div className="px-4 md:px-6 pb-4">
        <MessageInput onSendMessage={handleSendMessage} />
        <p className="text-xs text-center text-gray-600 dark:text-gray-500 mt-2">
          AI generated Answers can&nbsp;be&nbsp;innacurate
        </p>
      </div>
    </div>
  );
}

export default App;
