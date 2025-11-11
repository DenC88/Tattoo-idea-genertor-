
import React from 'react';
import { Message as MessageType } from '../types';
import LoadingSpinner from './LoadingSpinner';

interface MessageProps {
  message: MessageType;
}

const BotIcon: React.FC = () => (
    <div className="w-8 h-8 rounded-full flex-shrink-0 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mr-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h.5a1.5 1.5 0 011.5 1.5v1.25a1.5 1.5 0 01-1.5 1.5h-1.5a1.5 1.5 0 01-1.5-1.5v-.25a.75.75 0 00-.75-.75h-.5a.75.75 0 00-.75.75v.25a1.5 1.5 0 01-1.5 1.5H5.5A1.5 1.5 0 014 7.75V6.5A1.5 1.5 0 015.5 5h.5a1 1 0 001-1v-.5a1.5 1.5 0 013 0z" />
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM2 10a8 8 0 1116 0 8 8 0 01-16 0z" clipRule="evenodd" />
        </svg>
    </div>
);

const UserIcon: React.FC = () => (
    <div className="w-8 h-8 rounded-full flex-shrink-0 bg-gray-600 flex items-center justify-center ml-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
    </div>
);

const Message: React.FC<MessageProps> = ({ message }) => {
  const isBot = message.sender === 'bot';
  const isUser = message.sender === 'user';
  const isLoading = message.content === 'loading';

  const formatUserMessage = (text: string) => {
    return text.split('\n').map((line, index) => {
      const parts = line.split(':');
      if (parts.length > 1) {
        return <p key={index}><strong className="font-semibold text-gray-300">{parts[0]}:</strong> {parts.slice(1).join(':')}</p>;
      }
      return <p key={index}>{line}</p>;
    });
  };

  if (isBot && isLoading) {
    return (
      <div className="flex items-start">
        <BotIcon />
        <div className="bg-gray-800 rounded-lg p-3 max-w-lg">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-start ${isUser ? 'justify-end' : 'justify-start'}`}>
      {isBot && <BotIcon />}
      <div className={`rounded-lg px-4 py-3 max-w-lg ${isBot ? 'bg-gray-800' : 'bg-purple-600'}`}>
        {message.imageUrl ? (
          <div className="space-y-3">
            <p className="text-gray-200">{message.content}</p>
            <img src={message.imageUrl} alt={message.prompt || "Generated tattoo"} className="rounded-lg w-full" />
          </div>
        ) : (
          <div className={`whitespace-pre-wrap ${isUser ? 'text-white' : 'text-gray-200'}`}>
            {isUser ? formatUserMessage(message.content) : message.content}
          </div>
        )}
      </div>
      {isUser && <UserIcon />}
    </div>
  );
};

export default Message;
