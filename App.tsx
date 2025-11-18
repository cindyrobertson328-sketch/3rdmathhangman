
import React, { useState, useEffect, useCallback } from 'react';
import { GameState } from './types';
import type { WordData, GuessedLetters } from './types';
import { MAX_WRONG_GUESSES, POINTS_PER_WORD } from './constants';
import fetchMathWords from './services/geminiService';
import WelcomeScreen from './components/WelcomeScreen';
import HangmanFigure from './components/HangmanFigure';
import WordDisplay from './components/WordDisplay';
import Keyboard from './components/Keyboard';
import Modal from './components/Modal';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.Welcome);
  const [words, setWords] = useState<WordData[]>([]);
  const [currentWord, setCurrentWord] = useState<WordData>({ word: '', definition: '' });
  const [guessedLetters, setGuessedLetters] = useState<GuessedLetters>({ correct: [], incorrect: [] });
  const [score, setScore] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const startNewGame = useCallback(() => {
    if (words.length === 0) {
      setError("Could not load words. Please try refreshing the page.");
      setGameState(GameState.Welcome);
      return;
    }
    const randomIndex = Math.floor(Math.random() * words.length);
    const newWord = words[randomIndex];
    setCurrentWord(newWord);
    setGuessedLetters({ correct: [], incorrect: [] });
    setGameState(GameState.Playing);
  }, [words]);
  
  const handleStart = useCallback(async () => {
    setGameState(GameState.Loading);
    setError(null);
    try {
      const fetchedWords = await fetchMathWords();
      setWords(fetchedWords);
    } catch (err) {
      setError("Failed to fetch words. Using fallback list.");
      console.error(err);
    }
  }, []);

  useEffect(() => {
    if (gameState === GameState.Loading && words.length > 0) {
      startNewGame();
    }
  }, [words, gameState, startNewGame]);


  const handleGuess = (letter: string) => {
    if (gameState !== GameState.Playing) return;

    if (currentWord.word.includes(letter)) {
      setGuessedLetters(prev => ({
        ...prev,
        correct: [...prev.correct, letter]
      }));
    } else {
      setGuessedLetters(prev => ({
        ...prev,
        incorrect: [...prev.incorrect, letter]
      }));
    }
  };

  useEffect(() => {
    if (gameState !== GameState.Playing) return;

    const incorrectCount = guessedLetters.incorrect.length;
    if (incorrectCount >= MAX_WRONG_GUESSES) {
      setGameState(GameState.Lost);
    }
    
    const isWordGuessed = currentWord.word.split('').every(letter => guessedLetters.correct.includes(letter));
    if (currentWord.word && isWordGuessed) {
      setGameState(GameState.Won);
      setScore(prevScore => prevScore + POINTS_PER_WORD);
    }
  }, [guessedLetters, currentWord.word, gameState]);

  const handleExit = () => {
    setScore(0);
    setGameState(GameState.Welcome);
  }

  const renderContent = () => {
    switch (gameState) {
      case GameState.Welcome:
        return <WelcomeScreen onStart={handleStart} />;
      case GameState.Loading:
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
            <p className="mt-4 text-xl text-blue-700">Loading Math Words...</p>
          </div>
        );
      case GameState.Playing:
      case GameState.Won:
      case GameState.Lost:
        return (
          <div className="relative w-full h-full flex flex-col items-center p-2 text-center">
            {(gameState === GameState.Won || gameState === GameState.Lost) && (
              <Modal 
                status={gameState === GameState.Won ? 'won' : 'lost'} 
                word={currentWord.word}
                onPlayAgain={startNewGame}
                onExit={handleExit}
              />
            )}
            <header className="w-full flex justify-between items-center px-4 shrink-0">
              <div className="bg-yellow-400 text-yellow-900 font-bold text-lg md:text-xl px-4 py-2 rounded-lg shadow-md">
                Score: {score}
              </div>
              <button
                onClick={handleExit}
                className="bg-red-500 text-white font-bold text-lg px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition"
              >
                Exit
              </button>
            </header>

            <main className="flex-grow w-full flex flex-col items-center justify-center min-h-0">
              <HangmanFigure wrongGuesses={guessedLetters.incorrect.length} />
              <WordDisplay word={currentWord.word} correctGuesses={guessedLetters.correct} />
              <div className="bg-white p-2 rounded-lg shadow-inner max-w-2xl mx-auto my-2">
                <p className="text-sm md:text-base text-gray-700 font-medium">
                  <span className="font-bold text-blue-700">Definition:</span> {currentWord.definition}
                </p>
              </div>
            </main>
            
            <footer className="w-full shrink-0">
                <Keyboard onGuess={handleGuess} guessedLetters={guessedLetters} />
            </footer>
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <div className="bg-gradient-to-br from-blue-200 to-cyan-200 h-screen w-screen flex items-center justify-center font-sans">
        <div className="w-full h-full max-w-screen-lg max-h-[768px] bg-blue-100 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            {error && <div className="bg-red-500 text-white text-center p-2">{error}</div>}
            {renderContent()}
        </div>
    </div>
  );
};

export default App;
