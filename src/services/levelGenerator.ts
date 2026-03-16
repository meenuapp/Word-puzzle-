import { GoogleGenAI, Type } from '@google/genai';
import { Level } from '../types/game';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const generateDynamicLevel = async (difficulty: 'Easy' | 'Medium' | 'Hard', levelId: number): Promise<Level> => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('Gemini API key is missing');
  }

  const prompt = `Generate a crossword-style word puzzle level for a game.
  Difficulty: ${difficulty}
  Level ID: ${levelId}
  
  Requirements:
  1. Provide 4-6 letters that can form multiple words.
  2. Provide 3-5 main words that fit in a small grid (max 7x7).
  3. Each word must have x, y coordinates and a direction (horizontal or vertical).
  4. Words must intersect at least at one letter if possible.
  5. Provide 3-5 bonus words that can be formed from the letters but are not in the grid.
  
  Return as JSON matching this structure:
  {
    "id": number,
    "difficulty": string,
    "letters": string[],
    "words": [
      { "word": string, "x": number, "y": number, "direction": "horizontal" | "vertical" }
    ],
    "bonusWords": string[]
  }`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.NUMBER },
            difficulty: { type: Type.STRING },
            letters: { type: Type.ARRAY, items: { type: Type.STRING } },
            words: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  word: { type: Type.STRING },
                  x: { type: Type.NUMBER },
                  y: { type: Type.NUMBER },
                  direction: { type: Type.STRING, enum: ['horizontal', 'vertical'] }
                },
                required: ['word', 'x', 'y', 'direction']
              }
            },
            bonusWords: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ['id', 'difficulty', 'letters', 'words', 'bonusWords']
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error('Empty response from AI');
    }

    const level = JSON.parse(text) as Level;
    
    if (!level.letters || !level.words) {
      throw new Error('Invalid level data structure');
    }

    // Ensure letters are uppercase
    level.letters = level.letters.map(l => l.toUpperCase());
    level.words = level.words.map(w => ({ ...w, word: w.word.toUpperCase() }));
    level.bonusWords = (level.bonusWords || []).map(w => w.toUpperCase());
    
    return level;
  } catch (error) {
    console.error('Failed to generate dynamic level:', error);
    throw error;
  }
};
