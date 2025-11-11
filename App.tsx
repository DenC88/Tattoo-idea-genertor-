import React, { useState } from 'react';
import { TattooRequest, Message as MessageType } from './types';
import { generateTattooImage, analyzeTattooImage, extractColorPalette } from './services/geminiService';
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

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            if (typeof reader.result !== 'string') {
                return reject('Impossibile leggere il file come stringa.');
            }
            resolve(reader.result.split(',')[1]);
        };
        reader.onerror = (error) => reject(error);
    });

  const handleGenerate = async (request: TattooRequest) => {
    setIsLoading(true);
    setError(null);

    const userMessageContent = `Ecco la mia idea:
- Soggetto: ${request.subject}
- Stile: ${request.style}
- Dimensione: ${request.size}
- Colori: ${request.color}
- Posizionamento: ${request.placement}
${request.elements ? `- Elementi aggiuntivi: ${request.elements}` : ''}
- Complessità: ${request.complexity}`;
    
    const userMessage: MessageType = {
      id: Date.now(),
      sender: 'user',
      content: userMessageContent,
      request,
    };
    
    setMessages(prev => [...prev, userMessage, { id: Date.now() + 1, sender: 'bot', content: 'loading' }]);

    try {
      const { prompt, base64Image } = await generateTattooImage(request);
      const imageUrl = `data:image/jpeg;base64,${base64Image}`;

      const [needleRecommendation, colorPalette] = await Promise.all([
        analyzeTattooImage(base64Image, request),
        extractColorPalette(base64Image)
      ]);

      const botMessage: MessageType = {
        id: Date.now() + 2,
        sender: 'bot',
        content: "Ecco un'idea per il tuo tatuaggio! Ho analizzato l'immagine per darti anche alcuni suggerimenti tecnici.",
        imageUrl,
        prompt,
        request,
        needleRecommendation,
        colorPalette,
      };

      setMessages(prev => [...prev.slice(0, -1), botMessage]);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Si è verificato un errore sconosciuto.';
      setError(errorMessage);
      const botErrorMessage: MessageType = {
        id: Date.now() + 2,
        sender: 'bot',
        content: `Oops! Qualcosa è andato storto durante la generazione: ${errorMessage}`,
      };
      setMessages(prev => [...prev.slice(0, -1), botErrorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyzeImage = async (file: File, request: Partial<TattooRequest>) => {
    setIsLoading(true);
    setError(null);

    const tempImageUrl = URL.createObjectURL(file);

    const userMessage: MessageType = {
        id: Date.now(),
        sender: 'user',
        content: 'Analizza questa immagine per favore.',
        imageUrl: tempImageUrl,
    };

    setMessages(prev => [...prev, userMessage, { id: Date.now() + 1, sender: 'bot', content: 'loading' }]);

    try {
        const base64Image = await fileToBase64(file);
        
        const [needleRecommendation, colorPalette] = await Promise.all([
            analyzeTattooImage(base64Image, request),
            extractColorPalette(base64Image)
        ]);

        const botMessage: MessageType = {
            id: Date.now() + 2,
            sender: 'bot',
            content: "Ecco l'analisi del tatuaggio! Ho estratto i colori dominanti e preparato alcuni suggerimenti tecnici.",
            imageUrl: `data:image/jpeg;base64,${base64Image}`,
            needleRecommendation,
            colorPalette,
        };

        setMessages(prev => [...prev.slice(0, -1), botMessage]);

    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Si è verificato un errore sconosciuto.';
        setError(errorMessage);
        const botErrorMessage: MessageType = {
            id: Date.now() + 2,
            sender: 'bot',
            content: `Oops! Qualcosa è andato storto durante l'analisi: ${errorMessage}`,
        };
        setMessages(prev => [...prev.slice(0, -1), botErrorMessage]);
    } finally {
        setIsLoading(false);
        URL.revokeObjectURL(tempImageUrl);
    }
  };

  const handleRegenerate = (request: TattooRequest) => {
    if (!isLoading) {
      handleGenerate(request);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col font-sans antialiased">
      <Header />
      <main className="flex-grow flex flex-col max-w-4xl w-full mx-auto p-4 overflow-hidden h-[calc(100vh-65px)]">
        <ChatHistory messages={messages} onRegenerate={handleRegenerate} isLoading={isLoading} />
        {error && <div className="text-red-400 text-center my-2 p-2 bg-red-900/50 rounded-md text-sm">{error}</div>}
        <div className="mt-4 flex-shrink-0">
          <TattooInputForm onGenerate={handleGenerate} onAnalyze={handleAnalyzeImage} isLoading={isLoading} />
        </div>
      </main>
    </div>
  );
};

export default App;
