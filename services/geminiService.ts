import { GoogleGenAI, Type } from "@google/genai";
import { TattooRequest } from '../types';

const generateTattooImage = async (request: TattooRequest): Promise<{ prompt: string; base64Image: string; }> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `Un'immagine di riferimento per un tatuaggio di un ${request.subject} ${request.elements ? `con elementi aggiuntivi: ${request.elements}` : ''}, in stile ${request.style}. 
Il tatuaggio è da posizionare su: ${request.placement}.
Livello di complessità: ${request.complexity}.
Dimensione: ${request.size}.
Schema di colori: ${request.color}.
L'immagine deve essere un design pulito e professionale su sfondo bianco, perfetto come riferimento per un artista tatuatore.`;

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

const analyzeTattooImage = async (base64Image: string, request: Partial<TattooRequest>): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  let prompt = `Sei un tatuatore esperto. Analizza l'immagine di questo tatuaggio.\n`;

  const detailsProvided = request.size || request.placement || request.complexity || request.subject || request.style || request.color;

  if (detailsProvided) {
    prompt += `Considerando che i dettagli forniti (se presenti) sono:\n`;
    if (request.subject) prompt += `- Soggetto: '${request.subject}'\n`;
    if (request.style) prompt += `- Stile: '${request.style}'\n`;
    if (request.color) prompt += `- Colori: '${request.color}'\n`;
    if (request.size) prompt += `- Dimensione: '${request.size}'\n`;
    if (request.placement) prompt += `- Posizionamento: '${request.placement}'\n`;
    if (request.complexity) prompt += `- Complessità: '${request.complexity}'\n`;
  }
  
  prompt += `fornisci consigli dettagliati e professionali sulle misure degli aghi da utilizzare. Struttura la tua risposta in sezioni con markdown:
- **Aghi per Linee (Liners):** Specifica le configurazioni (es. 3RL, 7RL, 9RL) e il loro utilizzo per i diversi tipi di contorni (dettagli fini, contorni principali), considerando la complessità richiesta.
- **Aghi per Sfumature (Shaders):** Specifica le configurazioni (es. 5RS, 9RS) per le diverse aree di sfumatura.
- **Aghi per Riempimento (Magnums):** Specifica le configurazioni (es. 7M1, 11M1) per riempire le aree di colore solido, tenendo conto della dimensione e del posizionamento.
La tua risposta deve essere chiara, concisa e utile per un altro tatuatore.`;


  const imagePart = {
    inlineData: {
      mimeType: 'image/jpeg',
      data: base64Image,
    },
  };

  const textPart = {
    text: prompt,
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: { parts: [imagePart, textPart] },
    });
    return response.text;
  } catch (error) {
    console.error("Error analyzing tattoo image:", error);
    return "Non è stato possibile analizzare l'immagine per i consigli sugli aghi.";
  }
};

const extractColorPalette = async (base64Image: string): Promise<string[]> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = "Analizza l'immagine e estrai i 5 colori dominanti. Restituisci un array JSON di stringhe contenenti i codici esadecimali dei colori.";

  const imagePart = {
    inlineData: {
      mimeType: 'image/jpeg',
      data: base64Image,
    },
  };

  const textPart = {
    text: prompt,
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
            description: 'Codice colore esadecimale (es. #RRGGBB)',
          },
        },
      },
    });
    
    const jsonString = response.text.trim();
    const colors = JSON.parse(jsonString);

    if (Array.isArray(colors) && colors.every(c => typeof c === 'string' && c.startsWith('#'))) {
      return colors;
    } else {
      console.warn("Parsed JSON is not a valid color palette array:", colors);
      return [];
    }
  } catch (error) {
    console.error("Error extracting color palette:", error);
    return [];
  }
};

const getSuggestedColorPalette = async (style: string): Promise<string[]> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }
  if (!style || style.trim().length < 3) {
    return [];
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `Dato lo stile di tatuaggio "${style}", suggerisci 4 palette di colori descrittive. Esempi: "Colori vivaci al neon", "Toni della terra tenui", "Scala di grigi con un tocco di rosso", "Pastelli sognanti". Restituisci solo un array JSON di stringhe.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
            description: 'Descrizione della palette di colori (es. "Colori vivaci al neon")',
          },
        },
      },
    });
    
    const jsonString = response.text.trim();
    const palettes = JSON.parse(jsonString);

    if (Array.isArray(palettes) && palettes.every(p => typeof p === 'string')) {
      return palettes;
    } else {
      console.warn("Parsed JSON is not a valid color palette array:", palettes);
      return [];
    }
  } catch (error) {
    console.error("Error getting suggested color palettes:", error);
    return [];
  }
};

export { generateTattooImage, analyzeTattooImage, extractColorPalette, getSuggestedColorPalette };
