
import { GoogleGenAI, Type } from "@google/genai";
import type { WordData } from '../types';

const fetchMathWords = async (): Promise<WordData[]> => {
  try {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Generate a list of 20 math vocabulary words suitable for a 3rd-grade student. For each word, provide a simple, one-sentence definition that a 3rd grader can understand.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            words: {
              type: Type.ARRAY,
              description: "A list of math vocabulary words and definitions.",
              items: {
                type: Type.OBJECT,
                properties: {
                  word: {
                    type: Type.STRING,
                    description: "The math vocabulary word, in all uppercase.",
                  },
                  definition: {
                    type: Type.STRING,
                    description: "A simple definition of the word for a 3rd grader.",
                  },
                },
                required: ["word", "definition"],
              },
            },
          },
          required: ["words"],
        },
      },
    });
    
    const jsonText = response.text.trim();
    const parsed = JSON.parse(jsonText);
    
    // Validate the structure
    if (parsed && Array.isArray(parsed.words)) {
        return parsed.words.map((item: any) => ({
            word: item.word.toUpperCase(), // Ensure word is uppercase
            definition: item.definition
        }));
    } else {
        throw new Error("Invalid data structure received from API");
    }
  } catch (error) {
    console.error("Error fetching words from Gemini API:", error);
    // Fallback to default words in case of API error
    return [
        { word: "SUM", definition: "The answer when you add numbers together." },
        { word: "AREA", definition: "The space inside a flat shape." },
        { word: "EVEN", definition: "A number that can be split into two equal groups." },
        { word: "ODD", definition: "A number that cannot be split into two equal groups." },
        { word: "VERTEX", definition: "A corner where two sides of a shape meet." },
        { word: "FRACTION", definition: "A part of a whole number." },
        { word: "PERIMETER", definition: "The distance around the outside of a shape." },
    ];
  }
};

export default fetchMathWords;
