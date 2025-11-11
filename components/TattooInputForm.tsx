
import React, { useState } from 'react';
import { TattooRequest } from '../types';
// Fix: Import the LoadingSpinner component to resolve the "Cannot find name 'LoadingSpinner'" error.
import LoadingSpinner from './LoadingSpinner';

interface TattooInputFormProps {
  onGenerate: (request: TattooRequest) => void;
  isLoading: boolean;
}

const TattooInputForm: React.FC<TattooInputFormProps> = ({ onGenerate, isLoading }) => {
  const [subject, setSubject] = useState('');
  const [style, setStyle] = useState('');
  const [size, setSize] = useState<'Piccolo' | 'Medio' | 'Grande'>('Medio');
  const [color, setColor] = useState('Bianco e nero');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (subject.trim() && style.trim() && color.trim()) {
      onGenerate({ subject, style, size, color });
      setSubject('');
      setStyle('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 p-4 rounded-xl border border-gray-700">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Subject */}
        <div className="md:col-span-2">
          <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-1">Soggetto</label>
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
          <input
            id="style"
            type="text"
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            placeholder="Es: Realistico, Tradizionale, Minimalista"
            className="w-full bg-gray-700 text-white border-gray-600 rounded-md p-2 focus:ring-purple-500 focus:border-purple-500 transition"
            required
            disabled={isLoading}
          />
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
        </div>
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-2.5 px-4 rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
      >
        {isLoading ? <LoadingSpinner /> : 'Genera Immagine'}
      </button>
    </form>
  );
};

export default TattooInputForm;