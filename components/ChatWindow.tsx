
import React, { useEffect, useRef } from 'react';
import { type Message } from '../types';
import MessageItem from './Message';

interface ChatWindowProps {
  messages: Message[];
  onFeedback: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, onFeedback }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6">
      <div className="max-w-4xl mx-auto w-full">
        <div className="space-y-6">
          {messages.map((msg) => (
            <MessageItem key={msg.id} message={msg} onFeedback={onFeedback} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
