
import React, { useState } from 'react';
import { type Message, MessageRole } from '../types';
import { KNavLogoIcon, UserIcon, ThumbsUpIcon, ThumbsDownIcon, CopyIcon, ShareIcon, DownloadIcon, DocumentIcon, CloseIcon, AudioWaveIcon } from './Icons';

interface MessageItemProps {
  message: Message;
  onFeedback: () => void;
}

interface ActionButtonsProps {
  content: string;
  onFeedback: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ content, onFeedback }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (!navigator.clipboard) {
            alert("Clipboard API not available in your browser.");
            return;
        }
        navigator.clipboard.writeText(content).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            alert("Could not copy text to clipboard.");
        });
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'KNAV ChatBot Response',
                    text: content,
                });
            } catch (error) {
                console.info('Share action was cancelled or failed.', error);
            }
        } else {
            alert("Web Share API is not supported in your browser.");
        }
    };
    
    const handleDownload = () => {
        try {
            const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'KNAV_ChatBot_Response.txt';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Failed to download file:', error);
            alert("Could not download the file.");
        }
    };

    return (
        <div className="flex items-center gap-2 mt-3 text-gray-500 dark:text-gray-400">
            <button onClick={onFeedback} className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700/80 transition-colors" aria-label="Like response"><ThumbsUpIcon className="w-4 h-4" /></button>
            <button onClick={onFeedback} className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700/80 transition-colors" aria-label="Dislike response"><ThumbsDownIcon className="w-4 h-4" /></button>
            <button onClick={handleCopy} className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700/80 transition-colors relative" aria-label="Copy response">
                <CopyIcon className="w-4 h-4" />
                {copied && (
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black text-white text-xs px-2 py-1 rounded-md">
                        Copied!
                    </div>
                )}
            </button>
            <button onClick={handleShare} className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700/80 transition-colors" aria-label="Share response"><ShareIcon className="w-4 h-4" /></button>
            <button onClick={handleDownload} className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700/80 transition-colors" aria-label="Download response"><DownloadIcon className="w-4 h-4" /></button>
        </div>
    );
};


const MessageItem: React.FC<MessageItemProps> = ({ message, onFeedback }) => {
  const isUser = message.role === MessageRole.USER;

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="flex items-start gap-3 max-w-xl">
           <div className="bg-blue-600 text-white dark:bg-[#2E2E2E] rounded-xl rounded-tr-none p-4">
             {message.content && <p className="whitespace-pre-wrap">{message.content}</p>}
             {message.file && (
                <div className="mt-2 p-2 bg-black/20 dark:bg-gray-600/50 border border-white/30 dark:border-gray-500/50 rounded-lg flex items-center gap-3">
                    {message.file.type.startsWith('audio/') ? (
                        <AudioWaveIcon className="w-5 h-5 flex-shrink-0 text-white dark:text-gray-300" />
                    ) : (
                        <DocumentIcon className="w-5 h-5 flex-shrink-0 text-white dark:text-gray-300" />
                    )}
                    <span className="text-white dark:text-gray-200 text-sm truncate">{message.file.name}</span>
                </div>
             )}
           </div>
           <div className="w-8 h-8 flex-shrink-0 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-200">
                <UserIcon className="w-5 h-5" />
           </div>
        </div>
      </div>
    );
  }

  // Bot/Model Message
  return (
    <div className="flex justify-start">
        <div className="flex items-start gap-3 max-w-2xl">
            <div className="w-8 h-8 flex-shrink-0">
                <KNavLogoIcon />
            </div>
            <div className="bg-transparent rounded-xl p-0">
                <div className="text-gray-800 dark:text-gray-300 whitespace-pre-wrap">{message.content}</div>
                {message.content && message.content !== '...' && <ActionButtons content={message.content} onFeedback={onFeedback} />}
            </div>
        </div>
    </div>
  );
};

export default MessageItem;
