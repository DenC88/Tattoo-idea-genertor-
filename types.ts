
export interface TattooRequest {
  subject: string;
  style: string;
  size: 'Piccolo' | 'Medio' | 'Grande';
  color: string;
}

export interface Message {
  id: number;
  sender: 'user' | 'bot';
  content: string;
  imageUrl?: string;
  prompt?: string;
}
