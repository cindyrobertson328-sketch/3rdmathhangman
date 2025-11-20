
import { GoogleGenAI, Type } from "@google/genai";
import type { WordData, Difficulty } from '../types';
import { DIFFICULTY_SETTINGS } from '../constants';

const fetchMathWords = async (difficulty: Difficulty): Promise<WordData[]> => {
  try {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const difficultyContext = DIFFICULTY_SETTINGS[difficulty].promptContext;

    // Broader list to allow AI to filter based on difficulty
    const wordList = "number, fraction, operation, property, shape, length, width, area, volume, time, chart, graph, table, value, round, add, subtract, inequality, numerator, denominator, partition, rectangle, circle, decompose, compose, sum, difference, diagram, model, algorithm, fluency, mastery, product, factor, distributive, commutative, associative, multiples, array, measurement, equation, quadrilateral, attribute, equivalent, perpendicular, parallel, plane, mass, interval, data, division, quotient, divisor, dividend, polygon, rhombus, trapezoid, hexagon, octagon, perimeter, capacity, weight, estimate";

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `From the following list of math vocabulary words, select 30 distinct words that match this difficulty level: "${difficulty}".
      
      Difficulty Context: ${difficultyContext}

      Provide a simple, fun, and engaging definition for a 3rd-grade student for each.
      
      Rules:
      1. Keep definitions short and easy to read.
      2. Do NOT use the vocabulary word itself (or any variation) in the definition.
      3. Make it sound like a helpful teacher explaining it to a child.

      List: ${wordList}`,
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
    // Fallback lists based on difficulty
    if (difficulty === 'Easy') {
         return [
            { word: "SUM", definition: "The total amount you get when you add numbers together." },
            { word: "AREA", definition: "The amount of flat space taken up by a shape." },
            { word: "CIRCLE", definition: "A perfectly round shape with no corners." },
            { word: "ADD", definition: "To put two or more numbers together to make a bigger number." },
            { word: "SHAPE", definition: "The form of an object, like a square, circle, or triangle." }
        ];
    } else if (difficulty === 'Hard') {
        return [
            { word: "NUMERATOR", definition: "The top number in a fraction that counts the parts you have." },
            { word: "DENOMINATOR", definition: "The bottom number in a fraction that tells how many equal parts are in the whole." },
            { word: "QUADRILATERAL", definition: "A shape that has exactly four sides and four corners." },
            { word: "EQUIVALENT", definition: "Having the same value or amount, even if it looks different." },
            { word: "PERIMETER", definition: "The distance all the way around the outside edge of a shape." }
        ];
    }
    
    // Medium/Default fallback
    return [
        { word: "PRODUCT", definition: "The answer you find when you multiply two numbers." },
        { word: "DIFFERENCE", definition: "How much bigger or smaller one number is compared to another." },
        { word: "FRACTION", definition: "A specific part of a whole object or a group." },
        { word: "ARRAY", definition: "A set of objects organized into neat rows and columns." },
        { word: "RECTANGLE", definition: "A four-sided shape with straight sides and four square corners." }
    ];
  }
};

export default fetchMathWords;
