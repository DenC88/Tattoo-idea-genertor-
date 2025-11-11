
import { GoogleGenAI } from "@google/genai";
import { TattooRequest } from '../types';

const generateTattooImage = async (request: TattooRequest): Promise<{ prompt: string; base64Image: string; }> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `Un'immagine di riferimento per un tatuaggio di un ${request.subject}, in stile ${request.style}. Il tatuaggio è di dimensione ${request.size.toLowerCase()}. Schema di colori: ${request.color}. L'immagine dovrebbe essere un design pulito su sfondo bianco, perfetto per un artista tatuatore.`;

  console.log("Generating image with prompt:", prompt);
  
  const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '1:1',
      },
  });

  if (!response.generatedImages || response.generatedImages.length === 0) {
      throw new Error("Image generation failed, no images returned.");
  }
  
  const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
  return { prompt, base64Image: base64ImageBytes };
};

export { generateTattooImage };
