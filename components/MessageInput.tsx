import React, { useState, useRef } from 'react';
import { PlusIcon, SendIcon, MicrophoneIcon, CloseIcon } from './Icons';

interface MessageInputProps {
  onSendMessage: (message: { text: string; file?: File }) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
    // Reset file input so the same file can be selected again
    if (event.target) {
      event.target.value = '';
    }
  };
  
  const handleRemoveFile = () => {
    setFile(null);
  }

  const handleMicClick = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Use a specific MIME type if supported, otherwise let the browser decide.
        const options = { mimeType: 'audio/webm' };
        mediaRecorderRef.current = new MediaRecorder(stream, options);
        audioChunksRef.current = [];

        mediaRecorderRef.current.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: options.mimeType });
          const audioFile = new File([audioBlob], `voice-recording-${Date.now()}.webm`, { type: options.mimeType });
          onSendMessage({ text: '', file: audioFile });
          
          // Stop all media tracks to turn off the mic indicator
          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorderRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.error("Error accessing microphone:", err);
        alert("Could not access the microphone. Please check your browser permissions.");
      }
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() || file) {
      onSendMessage({ text: inputValue, file: file || undefined });
      setInputValue('');
      setFile(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-[#2E2E2E] border border-gray-300 dark:border-gray-600 rounded-xl flex flex-col overflow-hidden">
        {file && (
          <div className="bg-gray-100 dark:bg-gray-700/50 rounded-md p-2 mx-2 mt-2 flex items-center justify-between text-sm shadow-sm">
            <span className="text-black dark:text-gray-200 truncate pr-2">{file.name}</span>
            <button
              type="button"
              onClick={handleRemoveFile}
              className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white flex-shrink-0"
              aria-label="Remove file"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>
        )}
        <div className="flex items-center p-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              aria-hidden="true"
            />
            <button
              type="button"
              onClick={handleFileButtonClick}
              disabled={isRecording}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
              aria-label="Attach file"
            >
                <PlusIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            </button>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask anything"
              disabled={isRecording}
              className="flex-1 bg-transparent text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-500 focus:outline-none px-4 disabled:opacity-50"
            />
             <button
              type="button"
              onClick={handleMicClick}
              className={`p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors mr-2 ${isRecording ? 'text-red-500 animate-pulse' : 'text-gray-500 dark:text-gray-400'}`}
              aria-label={isRecording ? 'Stop recording' : 'Start recording'}
            >
              <MicrophoneIcon className="w-6 h-6" />
            </button>
            <button
              type="submit"
              disabled={isRecording || (!inputValue.trim() && !file)}
              className="p-3 rounded-lg bg-gray-500 hover:bg-gray-400 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors"
              aria-label="Send message"
            >
                <SendIcon className="w-5 h-5 text-white" />
            </button>
        </div>
      </div>
    </form>
  );
};

export default MessageInput;