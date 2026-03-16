/// <reference types="vite/client" />
import { db } from '../firebase';
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || '' });

export interface Word {
  id?: string;
  word: string;
  meaning: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export const getStoredWords = async (): Promise<Word[]> => {
  const wordsRef = collection(db, 'words');
  const snapshot = await getDocs(wordsRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Word));
};

export const generateAndStoreWords = async (existingWords: Word[]): Promise<Word[]> => {
  if (!navigator.onLine) return existingWords;

  const existingWordStrings = existingWords.map(w => w.word.toLowerCase());

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate 5 new unique English words for a word game. Do not use these words: ${existingWordStrings.join(', ')}. Return as JSON array of objects with word, meaning, and difficulty (easy, medium, hard).`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            word: { type: Type.STRING },
            meaning: { type: Type.STRING },
            difficulty: { type: Type.STRING, enum: ['easy', 'medium', 'hard'] }
          },
          required: ['word', 'meaning', 'difficulty']
        }
      }
    }
  });

  const newWords: Word[] = JSON.parse(response.text || '[]');
  const wordsRef = collection(db, 'words');
  
  for (const word of newWords) {
    await addDoc(wordsRef, word);
  }

  return [...existingWords, ...newWords];
};
