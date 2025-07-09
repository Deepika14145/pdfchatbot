import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import { useTheme } from './contexts/ThemeContext';

export interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  feedback?: 'up' | 'down' | null;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  lastActivity: Date;
}
function App() {
  const { theme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Load chat sessions from localStorage on app start
  const loadChatSessions = (): ChatSession[] => {
    try {
      const saved = localStorage.getItem('chatSessions');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Convert date strings back to Date objects
        return parsed.map((session: any) => ({
          ...session,
          createdAt: new Date(session.createdAt),
          lastActivity: new Date(session.lastActivity),
          messages: session.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        }));
      }
    } catch (error) {
      console.error('Error loading chat sessions from localStorage:', error);
    }
    return [];
  };

  const [chatSessions, setChatSessions] = useState<ChatSession[]>(loadChatSessions);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  // Save chat sessions to localStorage whenever they change
  React.useEffect(() => {
    try {
      localStorage.setItem('chatSessions', JSON.stringify(chatSessions));
    } catch (error) {
      console.error('Error saving chat sessions to localStorage:', error);
    }
  }, [chatSessions]);

  // Create initial chat on app load
  React.useEffect(() => {
    if (chatSessions.length === 0) {
      createNewChat();
    } else {
      // If we have existing chats but no current chat selected, select the first one
      if (!currentChatId && chatSessions.length > 0) {
        setCurrentChatId(chatSessions[0].id);
      }
    }
  }, [chatSessions.length, currentChatId]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const createNewChat = () => {
    const newChatId = Date.now().toString();
    const newChat: ChatSession = {
      id: newChatId,
      title: 'New Chat',
      messages: [],
      createdAt: new Date(),
      lastActivity: new Date()
    };
    
    setChatSessions(prev => [newChat, ...prev]);
    setCurrentChatId(newChatId);
    setSidebarOpen(false); // Close sidebar on mobile after creating new chat
  };

  const selectChat = (chatId: string) => {
    setCurrentChatId(chatId);
    setSidebarOpen(false); // Close sidebar on mobile after selecting chat
  };

  const updateChatSession = (chatId: string, messages: Message[]) => {
    setChatSessions(prev => prev.map(chat => {
      if (chat.id === chatId) {
        // Generate title from first user message if it's still "New Chat"
        let title = chat.title;
        if (title === 'New Chat' && messages.length > 0) {
          const firstUserMessage = messages.find(msg => msg.type === 'user');
          if (firstUserMessage) {
            title = firstUserMessage.content.slice(0, 30) + (firstUserMessage.content.length > 30 ? '...' : '');
          }
        }
        
        return {
          ...chat,
          title,
          messages,
          lastActivity: new Date()
        };
      }
      return chat;
    }));
  };

  const deleteChat = (chatId: string) => {
    setChatSessions(prev => prev.filter(chat => chat.id !== chatId));
    if (currentChatId === chatId) {
      // If deleting current chat, select the first available chat or create new one
      const remainingChats = chatSessions.filter(chat => chat.id !== chatId);
      if (remainingChats.length > 0) {
        setCurrentChatId(remainingChats[0].id);
      } else {
        setCurrentChatId(null);
        // Create a new chat if no chats remain
        setTimeout(() => createNewChat(), 100);
      }
    }
  };

  const getCurrentChat = (): ChatSession | null => {
    return chatSessions.find(chat => chat.id === currentChatId) || null;
  };
  return (
    <div className={`flex h-screen overflow-hidden transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-dark-bg' 
        : 'bg-light-bg'
    }`}>
      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={toggleSidebar}
        chatSessions={chatSessions}
        currentChatId={currentChatId}
        onNewChat={createNewChat}
        onSelectChat={selectChat}
        onDeleteChat={deleteChat}
      />
      <ChatInterface 
        sidebarOpen={sidebarOpen}
        currentChat={getCurrentChat()}
        onUpdateChat={updateChatSession}
        onToggleSidebar={toggleSidebar}
      />
    </div>
  );
}

export default App;