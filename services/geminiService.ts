
import type { WordData, Difficulty } from '../types';

// Static list of 3rd Grade Math Vocabulary provided by user
const STATIC_WORDS: WordData[] = [
  { word: "NUMBER", definition: "A symbol used to count, measure, and label things" },
  { word: "PLACE VALUE", definition: "How much a digit is worth based on where it sits in a number" },
  { word: "FRACTION", definition: "A part of a whole object or set" },
  { word: "OPERATION", definition: "Action words in math like add, subtract, multiply, and divide" },
  { word: "PROPERTY", definition: "A special rule or feature of a number or shape" },
  { word: "SHAPE", definition: "The form of an object, like a square or circle" },
  { word: "LENGTH", definition: "The distance from one end to the other" },
  { word: "WIDTH", definition: "The distance from side to side" },
  { word: "AREA", definition: "The amount of flat space inside a shape" },
  { word: "VOLUME", definition: "The amount of space a 3D object takes up" },
  { word: "TIME", definition: "Measured in seconds, minutes, and hours" },
  { word: "CHART", definition: "A drawing or list that organizes facts" },
  { word: "GRAPH", definition: "A picture that shows data using bars, lines, or dots" },
  { word: "TABLE", definition: "Facts organized in rows and columns" },
  { word: "WHOLE NUMBER", definition: "Counting numbers like 0, 1, 2, 3 with no fractions" },
  { word: "VALUE", definition: "How much a number is worth" },
  { word: "ROUND", definition: "Changing a number to a nearby ten or hundred to make it simpler" },
  { word: "ADD", definition: "To put numbers together to find a total" },
  { word: "SUBTRACT", definition: "To take one amount away from another" },
  { word: "EXPANDED FORM", definition: "Writing a number to show the value of each digit, like 300 + 20 + 5" },
  { word: "INEQUALITY", definition: "A math sentence showing that two amounts are not equal" },
  { word: "NUMERATOR", definition: "The top number in a fraction showing how many parts you have" },
  { word: "DENOMINATOR", definition: "The bottom number in a fraction showing the total parts in the whole" },
  { word: "PARTITION", definition: "To split a shape or number into smaller groups" },
  { word: "RECTANGLE", definition: "A shape with four straight sides and four square corners" },
  { word: "CIRCLE", definition: "A round shape with no corners" },
  { word: "NUMBER LINE", definition: "A straight line with numbers placed in order" },
  { word: "DECOMPOSE", definition: "To break a number or shape apart into smaller pieces" },
  { word: "COMPOSE", definition: "To put smaller numbers or shapes together to make a bigger one" },
  { word: "DIAGRAM", definition: "A drawing that explains how something works" },
  { word: "SUM", definition: "The total you get when you add numbers" },
  { word: "DIFFERENCE", definition: "The result of taking one number away from another" },
  { word: "MODEL", definition: "A picture or object used to show a math idea" },
  { word: "ALGORITHM", definition: "A list of steps to follow to solve a problem" },
  { word: "FLUENCY", definition: "Being able to do math quickly and accurately" },
  { word: "MASTERY", definition: "Knowing a subject really, really well" },
  { word: "PRODUCT", definition: "The answer when you multiply numbers" },
  { word: "FACTOR", definition: "A number that is multiplied by another number" },
  { word: "MULTIPLE", definition: "The result of multiplying a number by a counting number" },
  { word: "EQUATION", definition: "A math sentence with an equal sign" },
  { word: "DISTRIBUTIVE", definition: "Breaking a big multiplication problem into two smaller ones" },
  { word: "COMMUTATIVE", definition: "The rule that order doesn't matter when adding or multiplying" },
  { word: "ASSOCIATIVE", definition: "The rule that grouping doesn't matter when adding or multiplying" },
  { word: "ARRAY", definition: "Objects arranged in rows and columns" },
  { word: "MEASUREMENT", definition: "Finding the size, height, or weight of something" },
  { word: "QUADRILATERAL", definition: "Any shape with four sides" },
  { word: "ATTRIBUTE", definition: "A feature like color, size, or shape" },
  { word: "EQUIVALENT", definition: "Having the same value or amount" },
  { word: "PERPENDICULAR", definition: "Lines that cross to make a square corner" },
  { word: "PARALLEL", definition: "Lines that are always the same distance apart and never touch" },
  { word: "PLANE", definition: "A flat surface that goes on forever" },
  { word: "MASS", definition: "How much stuff is in an object" },
  { word: "INTERVAL", definition: "The space between two numbers on a scale" },
  { word: "DATA", definition: "Facts or numbers collected to learn something" },
  { word: "LINE PLOT", definition: "A graph that shows data as marks above a number line" },
  { word: "DIVISION", definition: "Sharing or grouping a number into equal parts" },
  { word: "QUOTIENT", definition: "The answer you get when you divide" },
  { word: "DIVISOR", definition: "The number used to divide another number" },
  { word: "DIVIDEND", definition: "The amount that is being divided up" },
  { word: "COUNTING ON", definition: "Starting with a number and counting up from there" }
];

const fetchMathWords = async (difficulty: Difficulty): Promise<WordData[]> => {
  // We ignore the 'difficulty' parameter for the word list itself, as we want to use
  // the full comprehensive curriculum list provided. 
  // App.tsx handles gameplay difficulty (timer, guesses) separately.
  
  return new Promise((resolve) => {
    // Return a shuffled copy of the list to ensure variety each session
    const shuffled = [...STATIC_WORDS].sort(() => Math.random() - 0.5);
    resolve(shuffled);
  });
};

export default fetchMathWords;
