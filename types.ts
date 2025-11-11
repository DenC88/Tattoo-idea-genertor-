export interface TattooRequest {
  subject: string;
  style: string;
  size: 'Piccolo' | 'Medio' | 'Grande';
  color: string;
  placement: string;
  elements: string;
  complexity: 'Semplice' | 'Moderata' | 'Intricata';
}

export interface Message {
  id: number;
  sender: 'user' | 'bot';
  content: string;
  imageUrl?: string;
  prompt?: string;
  request?: TattooRequest;
  needleRecommendation?: string;
  colorPalette?: string[];
}