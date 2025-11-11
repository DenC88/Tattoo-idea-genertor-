import React, { useState, useEffect, useCallback, useRef } from 'react';
import { TattooRequest } from '../types';
import LoadingSpinner from './LoadingSpinner';
import { getSuggestedColorPalette } from '../services/geminiService';

interface TattooInputFormProps {
  onGenerate: (request: TattooRequest) => void;
  onAnalyze: (file: File, request: Partial<TattooRequest>) => void;
  isLoading: boolean;
}

const TATTOO_STYLES = [
  'Realistico',
  'Realismo Astratto',
  'Surrealista',
  'Tradizionale (Old School)',
  'Neo-Tradizionale',
  'Giapponese (Irezumi)',
  'Tribale',
  'Blackwork',
  'Dotwork',
  'Geometrico',
  'Minimalismo Geometrico',
  'Acquerello (Watercolor)',
  'Minimalista',
  'Illustrativo',
  'New School',
  'Chicano',
  'Trash Polka',
  'Anime/Manga',
  'Sketch'
];

const TattooInputForm: React.FC<TattooInputFormProps> = ({ onGenerate, onAnalyze, isLoading }) => {
  const [subject, setSubject] = useState('');
  const [style, setStyle] = useState(TATTOO_STYLES[0]);
  const [placement, setPlacement] = useState('');
  const [elements, setElements] = useState('');
  const [complexity, setComplexity] = useState<'Semplice' | 'Moderata' | 'Intricata'>('Moderata');
  const [size, setSize] = useState<'Piccolo' | 'Medio' | 'Grande'>('Medio');
  const [color, setColor] = useState('Bianco e nero');

  const [suggestedColors, setSuggestedColors] = useState<string[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchSuggestions = useCallback(async (styleValue: string) => {
    if (!styleValue) {
      setSuggestedColors([]);
      return;
    }
    setIsSuggesting(true);
    try {
      const suggestions = await getSuggestedColorPalette(styleValue);
      setSuggestedColors(suggestions);
    } catch (error) {
      console.error("Failed to fetch color suggestions:", error);
      setSuggestedColors([]);
    } finally {
      setIsSuggesting(false);
    }
  }, []);

  useEffect(() => {
    fetchSuggestions(style);
  }, [style, fetchSuggestions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (subject.trim() && style.trim() && color.trim() && placement.trim()) {
      onGenerate({ subject, style, size, color, placement, elements, complexity });
      setSubject('');
      setPlacement('');
      setElements('');
    }
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    setColor(suggestion);
  };

  const handleAnalyzeClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onAnalyze(file, { subject, style, size, color, placement, complexity });
    }
    if(event.target) {
      event.target.value = '';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 p-4 rounded-xl border border-gray-700">
       <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
        disabled={isLoading}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Subject */}
        <div className="md:col-span-2">
          <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-1">Soggetto Principale</label>
          <input
            id="subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Es: Un leone maestoso con una corona"
            className="w-full bg-gray-700 text-white border-gray-600 rounded-md p-2 focus:ring-purple-500 focus:border-purple-500 transition"
            required
            disabled={isLoading}
          />
        </div>

        {/* Style */}
        <div>
          <label htmlFor="style" className="block text-sm font-medium text-gray-300 mb-1">Stile</label>
          <select
            id="style"
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="w-full bg-gray-700 text-white border-gray-600 rounded-md p-2 focus:ring-purple-500 focus:border-purple-500 transition"
            required
            disabled={isLoading}
          >
            {TATTOO_STYLES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Placement */}
        <div>
          <label htmlFor="placement" className="block text-sm font-medium text-gray-300 mb-1">Posizionamento</label>
          <input
            id="placement"
            type="text"
            value={placement}
            onChange={(e) => setPlacement(e.target.value)}
            placeholder="Es: Avambraccio, Schiena, Caviglia"
            className="w-full bg-gray-700 text-white border-gray-600 rounded-md p-2 focus:ring-purple-500 focus:border-purple-500 transition"
            required
            disabled={isLoading}
          />
        </div>

        {/* Additional Elements */}
        <div className="md:col-span-2">
          <label htmlFor="elements" className="block text-sm font-medium text-gray-300 mb-1">Elementi Aggiuntivi (opzionale)</label>
          <input
            id="elements"
            type="text"
            value={elements}
            onChange={(e) => setElements(e.target.value)}
            placeholder="Es: con rose e un orologio, sfondo geometrico"
            className="w-full bg-gray-700 text-white border-gray-600 rounded-md p-2 focus:ring-purple-500 focus:border-purple-500 transition"
            disabled={isLoading}
          />
        </div>

        {/* Complexity */}
        <div>
          <label htmlFor="complexity" className="block text-sm font-medium text-gray-300 mb-1">Complessità</label>
          <select
            id="complexity"
            value={complexity}
            onChange={(e) => setComplexity(e.target.value as 'Semplice' | 'Moderata' | 'Intricata')}
            className="w-full bg-gray-700 text-white border-gray-600 rounded-md p-2 focus:ring-purple-500 focus:border-purple-500 transition"
            disabled={isLoading}
          >
            <option>Semplice</option>
            <option>Moderata</option>
            <option>Intricata</option>
          </select>
        </div>

        {/* Size */}
        <div>
          <label htmlFor="size" className="block text-sm font-medium text-gray-300 mb-1">Dimensione</label>
          <select
            id="size"
            value={size}
            onChange={(e) => setSize(e.target.value as 'Piccolo' | 'Medio' | 'Grande')}
            className="w-full bg-gray-700 text-white border-gray-600 rounded-md p-2 focus:ring-purple-500 focus:border-purple-500 transition"
            disabled={isLoading}
          >
            <option>Piccolo</option>
            <option>Medio</option>
            <option>Grande</option>
          </select>
        </div>

        {/* Color */}
        <div className="md:col-span-2">
          <label htmlFor="color" className="block text-sm font-medium text-gray-300 mb-1">Colori</label>
          <input
            id="color"
            type="text"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            placeholder="Es: Bianco e nero, Colori vivaci"
            className="w-full bg-gray-700 text-white border-gray-600 rounded-md p-2 focus:ring-purple-500 focus:border-purple-500 transition"
            required
            disabled={isLoading}
          />
           {(isSuggesting || suggestedColors.length > 0) && (
            <div className="mt-2">
              <h5 className="text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider flex items-center gap-2">
                <span>Suggerimenti Colore</span> 
                {isSuggesting && <LoadingSpinner size="sm" />}
              </h5>
              {!isSuggesting && suggestedColors.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {suggestedColors.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-200 font-medium py-1 px-2.5 rounded-full transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="mt-4 flex flex-col sm:flex-row gap-2">
          <button
            type="button"
            disabled={isLoading}
            onClick={handleAnalyzeClick}
            className="w-full sm:w-auto bg-gray-700 text-white font-bold py-2.5 px-6 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center flex-shrink-0"
          >
            Analizza Foto
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-2.5 px-4 rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
          >
            {isLoading ? <LoadingSpinner /> : 'Genera Immagine'}
          </button>
      </div>
    </form>
  );
};

export default TattooInputForm;