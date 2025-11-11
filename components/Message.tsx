import React, { useState } from 'react';
import { Message as MessageType, TattooRequest } from '../types';
import LoadingSpinner from './LoadingSpinner';

interface MessageProps {
  message: MessageType;
  onRegenerate: (request: TattooRequest) => void;
  isLoading: boolean;
}

const BotIcon: React.FC = () => (
    <div className="w-8 h-8 rounded-full flex-shrink-0 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
      </svg>
    </div>
);

const UserIcon: React.FC = () => (
  <div className="w-8 h-8 rounded-full flex-shrink-0 bg-gray-600 flex items-center justify-center shadow-lg">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
  </div>
);

const DownloadIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);

const RegenerateIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm10 8a1 1 0 011-1h5a1 1 0 011 1v5a1 1 0 01-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 011.885-.666A5.002 5.002 0 0014.001 13H11a1 1 0 010-2h3z" clipRule="evenodd" />
    </svg>
);

const SearchSocialIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
    </svg>
);


const Message: React.FC<MessageProps> = ({ message, onRegenerate, isLoading }) => {
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  const isBot = message.sender === 'bot';

  const handleDownload = () => {
    if (message.imageUrl) {
      const link = document.createElement('a');
      link.href = message.imageUrl;
      link.download = `tattoo-idea-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleRegenerateClick = () => {
    if (message.request && !isLoading) {
      onRegenerate(message.request);
    }
  };

  const handleSearchSocial = () => {
    if (message.request) {
      const { subject, style, elements } = message.request;
      const query = `tattoo ${subject} ${style} ${elements || ''}`.trim().replace(/\s+/g, ' ');
      const encodedQuery = encodeURIComponent(query);
      const url = `https://www.pinterest.com/search/pins/?q=${encodedQuery}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const formatContent = (content: string) => {
    let formattedContent = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formattedContent = formattedContent.replace(/\n/g, '<br />');
    return <div dangerouslySetInnerHTML={{ __html: formattedContent }} />;
  };

  return (
    <div className={`flex items-start gap-3 ${isBot ? '' : 'flex-row-reverse'} animate-fade-in-up`}>
      {isBot ? <BotIcon /> : <UserIcon />}
      <div className={`max-w-md w-full p-3.5 rounded-2xl ${isBot ? 'bg-gray-800' : 'bg-purple-600'}`}>
        {message.content === 'loading' ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className="text-white text-sm leading-relaxed whitespace-pre-wrap">
              {formatContent(message.content)}
            </div>

            {message.imageUrl && (
              <div className="mt-3">
                <img src={message.imageUrl} alt={message.prompt || 'Generated tattoo'} className="rounded-lg w-full" />
                
                <div className="flex flex-wrap items-center justify-start gap-2 mt-3">
                  <button
                    onClick={handleDownload}
                    className="flex items-center justify-center text-xs bg-gray-700 hover:bg-gray-600 text-white font-semibold py-1.5 px-3 rounded-md transition-colors"
                  >
                    <DownloadIcon />
                    Scarica
                  </button>
                  {message.request && (
                    <>
                        <button
                        onClick={handleRegenerateClick}
                        disabled={isLoading}
                        className="flex items-center justify-center text-xs bg-gray-700 hover:bg-gray-600 text-white font-semibold py-1.5 px-3 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <RegenerateIcon />
                            Rigenera
                        </button>
                        <button
                            onClick={handleSearchSocial}
                            className="flex items-center justify-center text-xs bg-gray-700 hover:bg-gray-600 text-white font-semibold py-1.5 px-3 rounded-md transition-colors"
                            >
                            <SearchSocialIcon />
                            Cerca Social
                        </button>
                    </>
                  )}
                </div>

                {message.colorPalette && message.colorPalette.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Palette Colori</h4>
                    <div className="flex flex-wrap gap-2">
                      {message.colorPalette.map((color, index) => (
                        <div key={index} className="flex items-center gap-2 bg-gray-700/50 rounded-lg p-1.5">
                          <div
                            className="w-5 h-5 rounded-md border-2 border-white/10"
                            style={{ backgroundColor: color }}
                          ></div>
                          <span className="text-xs font-mono text-gray-300">{color.toUpperCase()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {message.needleRecommendation && (
                   <div className="mt-4 border-t border-gray-700 pt-3">
                      <button 
                        onClick={() => setIsAccordionOpen(!isAccordionOpen)}
                        className="w-full flex justify-between items-center text-left text-sm font-semibold text-gray-300 hover:text-white"
                      >
                        <span>Consigli per gli Aghi</span>
                        <svg className={`w-5 h-5 transition-transform ${isAccordionOpen ? 'transform rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                      {isAccordionOpen && (
                        <div className="prose prose-sm prose-invert mt-2 text-gray-400">
                          {formatContent(message.needleRecommendation)}
                        </div>
                      )}
                   </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Message;