import React, { useRef, useEffect } from 'react';
import { Message as MessageType, TattooRequest } from '../types';
import Message from './Message';

interface ChatHistoryProps {
  messages: MessageType[];
  onRegenerate: (request: TattooRequest) => void;
  isLoading: boolean;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ messages, onRegenerate, isLoading }) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-grow overflow-y-auto space-y-6 pr-2">
      {messages.map((msg) => (
        <Message key={msg.id} message={msg} onRegenerate={onRegenerate} isLoading={isLoading} />
      ))}
      <div ref={endOfMessagesRef} />
    </div>
  );
};

export default ChatHistory;