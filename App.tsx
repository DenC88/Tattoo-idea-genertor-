
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { TattooRequest, Message as MessageType } from './types';
import { generateTattooImage } from './services/geminiService';
import Header from './components/Header';
import ChatHistory from './components/ChatHistory';
import TattooInputForm from './components/TattooInputForm';

const App: React.FC = () => {
  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: Date.now(),
      sender: 'bot',
      content: 'Benvenuto! Descrivi il tatuaggio che hai in mente e io creerò un\'immagine di riferimento per te.',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async (request: TattooRequest) => {
    setIsLoading(true);
    setError(null);

    const userMessageContent = `Genera un tatuaggio:
- **Soggetto:** ${request.subject}
- **Stile:** ${request.style}
- **Dimensione:** ${request.size}
- **Colori:** ${request.color}`;

    const userMessage: MessageType = {
      id: Date.now(),
      sender: 'user',
      content: userMessageContent,
    };

    const loadingMessage: MessageType = {
      id: Date.now() + 1,
      sender: 'bot',
      content: 'loading',
    };

    setMessages(prev => [...prev, userMessage, loadingMessage]);

    try {
      const { prompt, base64Image } = await generateTattooImage(request);
      
      const botImageMessage: MessageType = {
        id: Date.now() + 2,
        sender: 'bot',
        content: `Ecco un'idea per il tuo tatuaggio.`,
        imageUrl: `data:image/jpeg;base64,${base64Image}`,
        prompt,
      };

      setMessages(prev => prev.filter(msg => msg.content !== 'loading').concat(botImageMessage));
    } catch (err) {
      console.error(err);
      const errorMessage = 'Spiacente, si è verificato un errore durante la generazione dell\'immagine. Riprova.';
      setError(errorMessage);
       const botErrorMessage: MessageType = {
        id: Date.now() + 2,
        sender: 'bot',
        content: errorMessage,
      };
       setMessages(prev => prev.filter(msg => msg.content !== 'loading').concat(botErrorMessage));
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col font-sans">
      <Header />
      <main className="flex-grow flex flex-col p-4 md:p-6 max-w-4xl w-full mx-auto">
        <ChatHistory messages={messages} />
        <div className="mt-auto pt-4">
          <TattooInputForm onGenerate={handleGenerate} isLoading={isLoading} />
          {error && <p className="text-red-400 text-center mt-2">{error}</p>}
        </div>
      </main>
    </div>
  );
};

export default App;
