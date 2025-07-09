import React, { useState, useRef, useEffect } from 'react';
import { Plus, Mic, ChevronDown, MessageCircle, Upload, MicOff, FileText, ThumbsUp, ThumbsDown, Copy, Share, Download, Send, Menu, Sun, Moon } from 'lucide-react';
import { Message, ChatSession } from '../App';
import { useTheme } from '../contexts/ThemeContext';

interface ChatInterfaceProps {
  sidebarOpen: boolean;
  currentChat: ChatSession | null;
  onUpdateChat: (chatId: string, messages: Message[]) => void;
  onToggleSidebar: () => void;
}


const ChatInterface: React.FC<ChatInterfaceProps> = ({ sidebarOpen, currentChat, onUpdateChat, onToggleSidebar }) => {
  const { theme } = useTheme();
  const { toggleTheme } = useTheme();
  const [message, setMessage] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messages = currentChat?.messages || [];
  const showInitialScreen = !currentChat || messages.length === 0;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase().trim();
    
    if (lowerMessage === 'hi' || lowerMessage === 'hello') {
      return "Hi! 👋 How can I help you today?";
    } else if (lowerMessage.includes('how are you')) {
      return "I'm doing great, thank you for asking! I'm here to help you with anything you need. How can I assist you today?";
    } else if (lowerMessage.includes('help')) {
      return "I'm here to help you! I can assist with various tasks like answering questions, helping with code, writing, research, and much more. What would you like help with?";
    } else {
      return "That's an interesting question! I'm here to help you with whatever you need. Could you provide more details about what you're looking for?";
    }
  };

  const handleSendMessage = () => {
    if (message.trim() || uploadedFiles.length > 0) {
      // If no current chat, this shouldn't happen due to the useEffect in App.tsx
      if (!currentChat) {
        console.error('No current chat available');
        return;
      }
      
      const userMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        content: message.trim(),
        timestamp: new Date()
      };

      const updatedMessages = [...messages, userMessage];
      onUpdateChat(currentChat.id, updatedMessages);

      // Generate assistant response
      setTimeout(() => {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: generateResponse(message.trim()),
          timestamp: new Date()
        };
        onUpdateChat(currentChat.id, [...updatedMessages, assistantMessage]);
      }, 1000);

      setMessage('');
      setUploadedFiles([]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleVoiceRecording = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        
        const audioChunks: BlobPart[] = [];
        mediaRecorder.ondataavailable = (event) => {
          audioChunks.push(event.data);
        };
        
        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
          const audioFile = new File([audioBlob], 'voice-recording.wav', { type: 'audio/wav' });
          setUploadedFiles(prev => [...prev, audioFile]);
          stream.getTracks().forEach(track => track.stop());
        };
        
        mediaRecorder.start();
        setIsRecording(true);
      } catch (error) {
        console.error('Error accessing microphone:', error);
        alert('Unable to access microphone. Please check permissions.');
      }
    } else {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
    }
  };

  const handleFeedback = (messageId: string, type: 'up' | 'down') => {
    if (!currentChat) return;
    
    // Update the message with feedback
    const updatedMessages = messages.map(msg => 
      msg.id === messageId 
        ? { ...msg, feedback: type }
        : msg
    );
    
    onUpdateChat(currentChat.id, updatedMessages);
    
    // Show feedback notification
    setFeedbackMessage('Feedback submitted');
    
    // Hide notification after 3 seconds
    setTimeout(() => {
      setFeedbackMessage(null);
    }, 3000);
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  if (showInitialScreen && messages.length === 0) {
    return (
      <div className={`flex-1 flex flex-col items-center justify-center p-4 md:p-8 relative transition-all duration-300 ${
        sidebarOpen ? 'ml-80' : 'ml-0'
      } ${
        theme === 'dark' 
          ? 'bg-dark-bg text-dark-text' 
          : 'bg-light-bg text-light-text'
      }`}>
        {/* Header with Logo and Name */}
        <div className={`fixed top-0 left-0 right-0 z-30 flex items-center gap-4 p-4 transition-all duration-300 ${
          sidebarOpen ? 'ml-80' : 'ml-0'
        } ${
          theme === 'dark' 
            ? 'bg-dark-bg border-b border-dark-border' 
            : 'bg-light-bg border-b border-light-border'
        }`}>
          {/* Hamburger Menu Button */}
          <button
            onClick={onToggleSidebar}
            className={`p-2 rounded-lg transition-all duration-300 shadow-lg ${
              theme === 'dark'
                ? 'bg-dark-bg-secondary hover:bg-dark-bg-tertiary text-dark-text'
                : 'bg-light-bg-secondary hover:bg-light-bg-tertiary text-light-text border border-light-border'
            }`}
          >
            <Menu size={20} />
          </button>
          
          {/* Logo and Name */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-brand-primary via-brand-secondary to-brand-accent rounded-lg flex items-center justify-center shadow-md">
              <FileText size={16} className="text-white" />
            </div>
            <h1 className={`text-xl font-semibold tracking-tight ${
              theme === 'dark' ? 'text-dark-text' : 'text-light-text'
            }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              KNAV PDF ChatBot
            </h1>
          </div>
          
          {/* Theme Toggle Button */}
          <div className="ml-auto">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'hover:bg-dark-bg-tertiary text-dark-text-secondary hover:text-dark-text'
                  : 'hover:bg-light-bg-tertiary text-light-text-secondary hover:text-light-text'
              }`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl w-full mt-20">
          {/* Title */}
          <h1 className={`text-3xl md:text-4xl lg:text-5xl font-light text-center mb-8 md:mb-12 px-4 ${
            theme === 'dark' ? 'text-dark-text' : 'text-light-text'
          }`}>
            Welcome to KNAV PdfChatBot!
          </h1>

          {/* Input Container */}
          <div className="relative max-w-3xl mx-auto">
            <div className={`rounded-2xl p-4 transition-all duration-300 shadow-lg ${
              theme === 'dark'
                ? 'bg-dark-bg-secondary border border-dark-border focus-within:border-brand-primary'
                : 'bg-light-bg-secondary border border-light-border focus-within:border-brand-primary focus-within:shadow-xl'
            }`}>
              {/* Uploaded Files Display */}
              {uploadedFiles.length > 0 && (
                <div className="mb-4 space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className={`flex items-center gap-3 rounded-lg p-3 ${
                      theme === 'dark' ? 'bg-dark-bg-tertiary' : 'bg-light-bg-tertiary'
                    }`}>
                      <FileText size={16} className="text-brand-primary" />
                      <span className={`text-sm flex-1 truncate ${
                        theme === 'dark' ? 'text-dark-text-secondary' : 'text-light-text-secondary'
                      }`}>{file.name}</span>
                      <span className={`text-xs ${
                        theme === 'dark' ? 'text-dark-text-muted' : 'text-light-text-muted'
                      }`}>
                        {(file.size / 1024).toFixed(1)} KB
                      </span>
                      <button
                        onClick={() => removeFile(index)}
                        className={`transition-colors ${
                          theme === 'dark'
                            ? 'text-dark-text-muted hover:text-brand-error'
                            : 'text-light-text-muted hover:text-brand-error'
                        }`}
                      >
                        <Plus size={16} className="rotate-45" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-3 mb-3">
                {/* Quick Response Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`flex items-center gap-2 transition-colors ${
                      theme === 'dark'
                        ? 'text-dark-text-secondary hover:text-dark-text'
                        : 'text-light-text-secondary hover:text-light-text'
                    }`}
                  >
                    <div className="w-6 h-6 bg-gradient-to-br from-brand-primary via-brand-secondary to-brand-accent rounded-full flex items-center justify-center">
                      <MessageCircle size={12} className="text-white" />
                    </div>
                    <span className="text-sm">Quick response</span>
                    <ChevronDown size={16} className={`transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isDropdownOpen && (
                    <div className={`absolute top-full left-0 mt-2 rounded-lg shadow-xl z-10 min-w-48 ${
                      theme === 'dark'
                        ? 'bg-dark-bg-secondary border border-dark-border'
                        : 'bg-light-bg border border-light-border'
                    }`}>
                      <div className="p-2">
                        <div className={`px-3 py-2 text-sm rounded cursor-pointer transition-colors ${
                          theme === 'dark'
                            ? 'text-dark-text-secondary hover:bg-dark-bg-tertiary'
                            : 'text-light-text-secondary hover:bg-light-bg-secondary'
                        }`}>
                          Quick response
                        </div>
                        <div className={`px-3 py-2 text-sm rounded cursor-pointer transition-colors ${
                          theme === 'dark'
                            ? 'text-dark-text-secondary hover:bg-dark-bg-tertiary'
                            : 'text-light-text-secondary hover:bg-light-bg-secondary'
                        }`}>
                          Detailed response
                        </div>
                        <div className={`px-3 py-2 text-sm rounded cursor-pointer transition-colors ${
                          theme === 'dark'
                            ? 'text-dark-text-secondary hover:bg-dark-bg-tertiary'
                            : 'text-light-text-secondary hover:bg-light-bg-secondary'
                        }`}>
                          Creative response
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Input Area */}
              <div className="flex items-end gap-3">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask anything"
                  className={`flex-1 bg-transparent resize-none focus:outline-none text-base leading-relaxed min-h-[24px] max-h-32 ${
                    theme === 'dark'
                      ? 'text-dark-text placeholder-dark-text-muted'
                      : 'text-light-text placeholder-light-text-muted'
                  }`}
                  rows={1}
                  style={{ height: 'auto' }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = target.scrollHeight + 'px';
                  }}
                />
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleFileUpload}
                    className={`p-2 transition-colors rounded-lg ${
                      theme === 'dark'
                        ? 'text-dark-text-muted hover:text-dark-text hover:bg-dark-bg-tertiary'
                        : 'text-light-text-muted hover:text-light-text hover:bg-light-bg-tertiary'
                    }`}
                    title="Upload document"
                  >
                    <Upload size={20} />
                  </button>
                  
                  <button
                    onClick={handleVoiceRecording}
                    className={`p-2 transition-colors rounded-lg ${
                      isRecording 
                        ? 'text-brand-error hover:text-brand-error-hover animate-pulse' 
                        : theme === 'dark'
                          ? 'text-dark-text-muted hover:text-dark-text hover:bg-dark-bg-tertiary'
                          : 'text-light-text-muted hover:text-light-text hover:bg-light-bg-tertiary'
                    }`}
                    title={isRecording ? 'Stop recording' : 'Start voice recording'}
                  >
                    {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
                  </button>

                  <button
                    onClick={handleSendMessage}
                    className={`p-2 text-white transition-colors rounded-lg ${
                      !message.trim() && uploadedFiles.length === 0
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-brand-primary hover:bg-brand-primary-hover'
                    }`}
                    disabled={!message.trim() && uploadedFiles.length === 0}
                    title="Send message"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileChange}
          className="hidden"
          accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
        />

        {/* Click outside to close dropdown */}
        {isDropdownOpen && (
          <div 
            className="fixed inset-0 z-5"
            onClick={() => setIsDropdownOpen(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className={`flex-1 flex flex-col transition-all duration-300 ${
      sidebarOpen ? 'ml-80' : 'ml-0'
    } ${
      theme === 'dark' 
        ? 'bg-dark-bg text-dark-text' 
        : 'bg-light-bg text-light-text'
    }`}>
      {/* Header with Logo and Name */}
      <div className={`flex items-center gap-4 p-4 border-b ${
        theme === 'dark' 
          ? 'bg-dark-bg border-dark-border' 
          : 'bg-light-bg border-light-border'
      }`}>
        {/* Hamburger Menu Button */}
        <button
          onClick={onToggleSidebar}
          className={`p-2 rounded-lg transition-all duration-300 shadow-lg ${
            theme === 'dark'
              ? 'bg-dark-bg-secondary hover:bg-dark-bg-tertiary text-dark-text'
              : 'bg-light-bg-secondary hover:bg-light-bg-tertiary text-light-text border border-light-border'
          }`}
        >
          <Menu size={20} />
        </button>
        
        {/* Logo and Name */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-brand-primary via-brand-secondary to-brand-accent rounded-lg flex items-center justify-center shadow-md">
            <FileText size={16} className="text-white" />
          </div>
          <h1 className={`text-xl font-semibold tracking-tight ${
            theme === 'dark' ? 'text-dark-text' : 'text-light-text'
          }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            KNAV PDF ChatBot
          </h1>
        </div>
        
        {/* Theme Toggle Button */}
        <div className="ml-auto">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'dark'
                ? 'hover:bg-dark-bg-tertiary text-dark-text-secondary hover:text-dark-text'
                : 'hover:bg-light-bg-tertiary text-light-text-secondary hover:text-light-text'
            }`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 pt-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-3xl rounded-2xl p-4 ${
                msg.type === 'user' 
                  ? theme === 'dark' 
                    ? 'bg-dark-bg-secondary' 
                    : 'bg-light-bg-secondary border border-light-border'
                  : 'bg-transparent'
              }`}>
                {msg.type === 'user' ? (
                  <div className={theme === 'dark' ? 'text-dark-text' : 'text-light-text'}>{msg.content}</div>
                ) : (
                  <div>
                    <div className={`mb-4 leading-relaxed ${
                      theme === 'dark' ? 'text-dark-text' : 'text-light-text'
                    }`}>{msg.content}</div>
                    
                    {/* Assistant Message Actions */}
                    <div className={`flex items-center gap-2 pt-2 border-t ${
                      theme === 'dark' ? 'border-dark-border' : 'border-light-border'
                    }`}>
                      <button
                        onClick={() => handleFeedback(msg.id, 'up')}
                        className={`p-2 rounded-lg transition-colors ${
                          msg.feedback === 'up' 
                            ? 'text-brand-success' 
                            : theme === 'dark'
                              ? 'text-dark-text-muted hover:text-brand-success hover:bg-dark-bg-tertiary'
                              : 'text-light-text-muted hover:text-brand-success hover:bg-light-bg-tertiary'
                        }`}
                        title="Good response"
                      >
                        <ThumbsUp size={16} />
                      </button>
                      
                      <button
                        onClick={() => handleFeedback(msg.id, 'down')}
                        className={`p-2 rounded-lg transition-colors ${
                          msg.feedback === 'down' 
                            ? 'text-brand-error' 
                            : theme === 'dark'
                              ? 'text-dark-text-muted hover:text-brand-error hover:bg-dark-bg-tertiary'
                              : 'text-light-text-muted hover:text-brand-error hover:bg-light-bg-tertiary'
                        }`}
                        title="Bad response"
                      >
                        <ThumbsDown size={16} />
                      </button>
                      
                      <button
                        onClick={() => copyMessage(msg.content)}
                        className={`p-2 rounded-lg transition-colors ${
                          theme === 'dark'
                            ? 'text-dark-text-muted hover:text-brand-primary hover:bg-dark-bg-tertiary'
                            : 'text-light-text-muted hover:text-brand-primary hover:bg-light-bg-tertiary'
                        }`}
                        title="Copy message"
                      >
                        <Copy size={16} />
                      </button>
                      
                      <button
                        className={`p-2 rounded-lg transition-colors ${
                          theme === 'dark'
                            ? 'text-dark-text-muted hover:text-brand-secondary hover:bg-dark-bg-tertiary'
                            : 'text-light-text-muted hover:text-brand-secondary hover:bg-light-bg-tertiary'
                        }`}
                        title="Share"
                      >
                        <Share size={16} />
                      </button>
                      
                      <button
                        className={`p-2 rounded-lg transition-colors ${
                          theme === 'dark'
                            ? 'text-dark-text-muted hover:text-brand-warning hover:bg-dark-bg-tertiary'
                            : 'text-light-text-muted hover:text-brand-warning hover:bg-light-bg-tertiary'
                        }`}
                        title="Download"
                      >
                        <Download size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area - Fixed at bottom */}
      <div className={`border-t p-4 md:p-6 ${
        theme === 'dark' ? 'border-dark-border' : 'border-light-border'
      }`}>
        <div className="max-w-4xl mx-auto">
          <div className={`rounded-2xl p-4 transition-all duration-300 shadow-lg ${
            theme === 'dark'
              ? 'bg-dark-bg-secondary border border-dark-border focus-within:border-brand-primary'
              : 'bg-light-bg-secondary border border-light-border focus-within:border-brand-primary focus-within:shadow-xl'
          }`}>
            {/* Uploaded Files Display */}
            {uploadedFiles.length > 0 && (
              <div className="mb-4 space-y-2">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className={`flex items-center gap-3 rounded-lg p-3 ${
                    theme === 'dark' ? 'bg-dark-bg-tertiary' : 'bg-light-bg-tertiary'
                  }`}>
                    <FileText size={16} className="text-brand-primary" />
                    <span className={`text-sm flex-1 truncate ${
                      theme === 'dark' ? 'text-dark-text-secondary' : 'text-light-text-secondary'
                    }`}>{file.name}</span>
                    <span className={`text-xs ${
                      theme === 'dark' ? 'text-dark-text-muted' : 'text-light-text-muted'
                    }`}>
                      {(file.size / 1024).toFixed(1)} KB
                    </span>
                    <button
                      onClick={() => removeFile(index)}
                      className={`transition-colors ${
                        theme === 'dark'
                          ? 'text-dark-text-muted hover:text-brand-error'
                          : 'text-light-text-muted hover:text-brand-error'
                      }`}
                    >
                      <Plus size={16} className="rotate-45" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Input Area */}
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask anything"
                  className={`w-full bg-transparent resize-none focus:outline-none text-base leading-relaxed min-h-[24px] max-h-32 ${
                    theme === 'dark'
                      ? 'text-dark-text placeholder-dark-text-muted'
                      : 'text-light-text placeholder-light-text-muted'
                  }`}
                  rows={1}
                  style={{ height: 'auto' }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = target.scrollHeight + 'px';
                  }}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={handleFileUpload}
                  className={`p-2 transition-colors rounded-lg ${
                    theme === 'dark'
                      ? 'text-dark-text-muted hover:text-dark-text hover:bg-dark-bg-tertiary'
                      : 'text-light-text-muted hover:text-light-text hover:bg-light-bg-tertiary'
                  }`}
                  title="Upload document"
                >
                  <Plus size={20} />
                </button>
                
                <button
                  onClick={handleVoiceRecording}
                  className={`p-2 transition-colors rounded-lg ${
                    isRecording 
                      ? 'text-brand-error hover:text-brand-error-hover animate-pulse' 
                      : theme === 'dark'
                        ? 'text-dark-text-muted hover:text-dark-text hover:bg-dark-bg-tertiary'
                        : 'text-light-text-muted hover:text-light-text hover:bg-light-bg-tertiary'
                  }`}
                  title={isRecording ? 'Stop recording' : 'Start voice recording'}
                >
                  {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
                </button>

                <button
                  onClick={handleSendMessage}
                  className={`p-2 text-white transition-colors rounded-lg ${
                    !message.trim() && uploadedFiles.length === 0
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-brand-primary hover:bg-brand-primary-hover'
                  }`}
                  disabled={!message.trim() && uploadedFiles.length === 0}
                  title="Send message"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
          
          {/* Footer text */}
          <p className={`text-center text-xs mt-3 ${
            theme === 'dark' ? 'text-dark-text-muted' : 'text-light-text-muted'
          }`}>
            PdfChatBot can make mistakes. Check important info. See Cookie Preferences.
          </p>
        </div>
      </div>

     {/* Feedback Notification */}
     {feedbackMessage && (
       <div className="fixed top-4 right-4 bg-brand-success text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in">
         {feedbackMessage}
       </div>
     )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileChange}
        className="hidden"
        accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
      />

      {/* Click outside to close dropdown */}
      {isDropdownOpen && (
        <div 
          className="fixed inset-0 z-5"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  );
};

export default ChatInterface;