import React, { useState } from 'react';
import { MessageCircle, User, X, Menu, Plus, Trash2, FileText } from 'lucide-react';
import { ChatSession } from '../App';
import { useTheme } from '../contexts/ThemeContext';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  chatSessions: ChatSession[];
  currentChatId: string | null;
  onNewChat: () => void;
  onSelectChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  onToggle, 
  chatSessions, 
  currentChatId, 
  onNewChat, 
  onSelectChat, 
  onDeleteChat 
}) => {
  const { theme } = useTheme();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authType, setAuthType] = useState<'admin' | null>(null);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<'admin' | null>(null);

  const handleAuth = (type: 'admin') => {
    setAuthType(type);
    setShowAuthModal(true);
  };

  const handleLogin = () => {
    if (credentials.username && credentials.password) {
      setIsLoggedIn(true);
      setUserType(authType);
      setShowAuthModal(false);
      setCredentials({ username: '', password: '' });
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserType(null);
    setCredentials({ username: '', password: '' });
  };

  return (
    <>
      {/* Hamburger Menu Button */}

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-screen z-40
        w-80 p-6 flex flex-col transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        ${theme === 'dark' 
          ? 'bg-dark-bg-secondary text-dark-text border-r border-dark-border' 
          : 'bg-light-bg text-light-text border-r border-light-border shadow-xl'
        }
      `}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-brand-primary via-brand-secondary to-brand-accent rounded-lg flex items-center justify-center shadow-md">
              <MessageCircle size={16} className="text-white" />
            </div>
           {/* <h1 className="text-xl font-semibold">KNAV pdfchatbot</h1> */}
          </div>
          <div className="flex items-center gap-2">
            {/* Close Button */}
            <button
              onClick={onToggle}
              className={`p-2 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'hover:bg-dark-bg-tertiary text-dark-text-secondary'
                  : 'hover:bg-light-bg-tertiary text-light-text-secondary'
              }`}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* New Chat Button */}
        <div className="mb-6">
          <button
            onClick={onNewChat}
            className="w-full bg-brand-primary hover:bg-brand-primary-hover text-white py-3 px-4 rounded-lg transition-all duration-200 font-medium flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
          >
            <Plus size={18} />
            New Chat
          </button>
        </div>

        {/* Authentication and PDF Section */}
        <div className="mb-8">
          {!isLoggedIn ? (
            <div className="space-y-4">
              <button
                onClick={() => handleAuth('admin')}
                className={`w-full py-2 px-4 rounded-lg transition-all duration-200 font-medium flex items-center justify-center gap-2 shadow-md hover:shadow-lg ${
                  theme === 'dark'
                    ? 'bg-brand-secondary hover:bg-brand-secondary-hover text-white'
                    : 'bg-brand-secondary hover:bg-brand-secondary-hover text-white'
                }`}
              >
                <User size={16} />
                Admin Login
              </button>
              
              <div className="border-t border-gray-700 pt-4">
                <button className={`w-full py-2 px-4 rounded-lg transition-all duration-200 font-medium flex items-center justify-center gap-2 shadow-md hover:shadow-lg ${
                  theme === 'dark'
                    ? 'bg-brand-accent hover:bg-brand-accent-hover text-white'
                    : 'bg-brand-accent hover:bg-brand-accent-hover text-white'
                }`}>
                  <FileText size={16} />
                  Show PDFs
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className={`rounded-lg p-4 ${
                theme === 'dark'
                  ? 'bg-dark-bg-tertiary'
                  : 'bg-light-bg-secondary border border-light-border'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm ${
                    theme === 'dark' ? 'text-dark-text-muted' : 'text-light-text-muted'
                  }`}>Logged in as:</span>
                  <button
                    onClick={handleLogout}
                    className="text-xs text-brand-error hover:text-brand-error-hover transition-colors"
                  >
                    Logout
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-brand-secondary" />
                  <span className="font-medium capitalize">{userType}</span>
                </div>
                <p className={`text-sm mt-1 ${
                  theme === 'dark' ? 'text-dark-text-muted' : 'text-light-text-muted'
                }`}>{credentials.username}</p>
              </div>
              
              <button className={`w-full py-2 px-4 rounded-lg transition-all duration-200 font-medium flex items-center justify-center gap-2 shadow-md hover:shadow-lg ${
                theme === 'dark'
                  ? 'bg-brand-accent hover:bg-brand-accent-hover text-white'
                  : 'bg-brand-accent hover:bg-brand-accent-hover text-white'
              }`}>
                <FileText size={16} />
                Show PDFs
              </button>
            </div>
          )}
        </div>

        {/* Chat History Section - Commented out for now */}
        {/* 
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Chat History</h2>
            <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
              {chatSessions.length}
            </span>
          </div>
          
          {chatSessions.length === 0 ? (
            <p className="text-gray-400 text-sm leading-relaxed">
              No conversations yet. Click "New Chat" to start your first conversation.
            </p>
          ) : (
            <div className="flex-1 space-y-1 overflow-y-auto pr-2">
              {chatSessions.map((chat) => (
                <div
                  key={chat.id}
                  className={`group flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    currentChatId === chat.id 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'hover:bg-gray-800 hover:shadow-md'
                  }`}
                  onClick={() => onSelectChat(chat.id)}
                >
                  <MessageCircle size={16} className={`flex-shrink-0 ${
                    currentChatId === chat.id ? 'text-white' : 'text-gray-400'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className={`font-medium text-sm truncate ${
                      currentChatId === chat.id ? 'text-white' : 'text-gray-200'
                    }`}>
                      {chat.title}
                    </div>
                    <div className={`text-xs mt-1 ${
                      currentChatId === chat.id ? 'text-blue-200' : 'text-gray-400'
                    }`}>
                      {chat.messages.length} messages • {chat.lastActivity.toLocaleDateString()}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteChat(chat.id);
                    }}
                    className={`opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-all duration-200 ${
                      currentChatId === chat.id ? 'text-blue-200' : 'text-gray-400'
                    }`}
                    title="Delete chat"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        */}
      </div>

      {/* Authentication Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-lg p-6 w-full max-w-md shadow-2xl ${
            theme === 'dark'
              ? 'bg-dark-bg-secondary border border-dark-border'
              : 'bg-light-bg border border-light-border'
          }`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-semibold capitalize ${
                theme === 'dark' ? 'text-dark-text' : 'text-light-text'
              }`}>
                Admin Login
              </h2>
              <button
                onClick={() => setShowAuthModal(false)}
                className={`transition-colors ${
                  theme === 'dark'
                    ? 'text-dark-text-muted hover:text-dark-text'
                    : 'text-light-text-muted hover:text-light-text'
                }`}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-dark-text-secondary' : 'text-light-text-secondary'
                }`}>
                  Username
                </label>
                <input
                  type="text"
                  value={credentials.username}
                  onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                  className={`w-full rounded-lg px-3 py-2 focus:outline-none transition-colors ${
                    theme === 'dark'
                      ? 'bg-dark-bg-tertiary border border-dark-border-secondary text-dark-text focus:border-brand-primary'
                      : 'bg-light-bg-secondary border border-light-border-secondary text-light-text focus:border-brand-primary'
                  }`}
                  placeholder="Enter username"
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-dark-text-secondary' : 'text-light-text-secondary'
                }`}>
                  Password
                </label>
                <input
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  className={`w-full rounded-lg px-3 py-2 focus:outline-none transition-colors ${
                    theme === 'dark'
                      ? 'bg-dark-bg-tertiary border border-dark-border-secondary text-dark-text focus:border-brand-primary'
                      : 'bg-light-bg-secondary border border-light-border-secondary text-light-text focus:border-brand-primary'
                  }`}
                  placeholder="Enter password"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowAuthModal(false)}
                  className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                    theme === 'dark'
                      ? 'bg-dark-bg-tertiary hover:bg-dark-border-secondary text-dark-text'
                      : 'bg-light-bg-tertiary hover:bg-light-border-secondary text-light-text border border-light-border'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogin}
                  disabled={!credentials.username || !credentials.password}
                  className={`flex-1 py-2 px-4 rounded-lg transition-colors text-white ${
                    !credentials.username || !credentials.password
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-brand-primary hover:bg-brand-primary-hover'
                  }`}
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;