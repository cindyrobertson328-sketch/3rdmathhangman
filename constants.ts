
import type { Difficulty } from "./types";

export const POINTS_PER_WORD = 5;
export const HINT_COST = 2;
export const INITIAL_SCORE = 10;

// Skip Logic Constants
export const SKIP_COST = 3;
export const SKIP_MIN_WRONG_GUESSES = 3;
export const SKIP_MAX_TIME_LEFT = 30; // Adjusted to 30s so it works well for Hard (60s), Medium (90s), etc.

interface DifficultyConfig {
  maxGuesses: number;
  timeLimit: number;
  label: string;
  color: string;
  description: string;
  promptContext: string; // Context sent to AI
}

export const DIFFICULTY_SETTINGS: Record<Difficulty, DifficultyConfig> = {
  Easy: {
    maxGuesses: 9,
    timeLimit: 120,
    label: "Easy",
    color: "bg-green-500",
    description: "More time, more guesses, basic words.",
    promptContext: "Select simple, foundational math vocabulary (e.g., shapes, basic numbers, simple operations) suitable for early 3rd grade."
  },
  Medium: {
    maxGuesses: 6,
    timeLimit: 90,
    label: "Medium",
    color: "bg-yellow-500",
    description: "Standard rules.",
    promptContext: "Select standard 3rd-grade math vocabulary covering fractions, measurements, data, and operations."
  },
  Hard: {
    maxGuesses: 5,
    timeLimit: 60,
    label: "Hard",
    color: "bg-red-500",
    description: "Less time, fewer guesses, challenge words.",
    promptContext: "Select challenging 3rd-grade math vocabulary, focusing on multi-step concepts, geometry properties, and advanced measurement."
  }
};
