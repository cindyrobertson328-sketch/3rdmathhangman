
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameState } from './types';
import type { WordData, GuessedLetters, GameHistoryItem, Difficulty } from './types';
import { 
  POINTS_PER_WORD, 
  HINT_COST, 
  INITIAL_SCORE,
  SKIP_COST,
  SKIP_MIN_WRONG_GUESSES,
  SKIP_MAX_TIME_LEFT,
  DIFFICULTY_SETTINGS
} from './constants';
import fetchMathWords from './services/geminiService';
import { soundService } from './services/soundService';
import WelcomeScreen from './components/WelcomeScreen';
import HangmanFigure from './components/HangmanFigure';
import WordDisplay from './components/WordDisplay';
import Keyboard from './components/Keyboard';
import Modal from './components/Modal';
import IncorrectGuesses from './components/IncorrectGuesses';
import HistoryModal from './components/HistoryModal';
import StatsModal from './components/StatsModal';
import ToggleSwitch from './components/ToggleSwitch';
import ConfirmationModal from './components/ConfirmationModal';
import Tooltip from './components/Tooltip';
// @ts-ignore
import confetti from 'canvas-confetti';

interface PersistentStats {
  gamesPlayed: number;
  gamesWon: number;
  longestStreak: number;
  totalScoreDelta: number;
}

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.Welcome);
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium');
  const [words, setWords] = useState<WordData[]>([]);
  const [currentWord, setCurrentWord] = useState<WordData>({ word: '', definition: '' });
  const [guessedLetters, setGuessedLetters] = useState<GuessedLetters>({ correct: [], incorrect: [] });
  const [score, setScore] = useState<number>(INITIAL_SCORE);
  const [wordsSolved, setWordsSolved] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [history, setHistory] = useState<GameHistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [showStats, setShowStats] = useState<boolean>(false);
  const [showHintConfirmation, setShowHintConfirmation] = useState<boolean>(false);
  const [showExitConfirmation, setShowExitConfirmation] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [gameId, setGameId] = useState<number>(0);
  
  // Difficulty Derived Settings
  const currentSettings = DIFFICULTY_SETTINGS[difficulty];
  const [timeLeft, setTimeLeft] = useState<number>(currentSettings.timeLimit);
  
  // Stats State
  const [stats, setStats] = useState<PersistentStats>(() => {
    try {
      const saved = localStorage.getItem('math-hangman-stats');
      return saved ? JSON.parse(saved) : { gamesPlayed: 0, gamesWon: 0, longestStreak: 0, totalScoreDelta: 0 };
    } catch (e) {
      return { gamesPlayed: 0, gamesWon: 0, longestStreak: 0, totalScoreDelta: 0 };
    }
  });

  // Track score at start of round to calculate delta
  const [roundStartScore, setRoundStartScore] = useState<number>(INITIAL_SCORE);

  // Settings State
  const [isTimerEnabled, setIsTimerEnabled] = useState<boolean>(true);
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(true);
  
  // Hint Visuals State
  const [revealedHintLetter, setRevealedHintLetter] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Parallax Refs
  const backgroundRef = useRef<HTMLDivElement>(null);
  const shapesRef = useRef<HTMLDivElement>(null);

  // Parallax Effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!backgroundRef.current || !shapesRef.current) return;
      
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Calculate normalized mouse position (-0.5 to 0.5)
      const x = (e.clientX / width) - 0.5;
      const y = (e.clientY / height) - 0.5;
      
      // Move background gradient slowly (Base layer)
      backgroundRef.current.style.transform = `translate(${x * 15}px, ${y * 15}px)`;
      
      // Move shapes faster and in opposite direction (Floating elements layer)
      shapesRef.current.style.transform = `translate(${x * -30}px, ${y * -30}px)`;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const playSound = useCallback((type: 'correct' | 'incorrect' | 'win' | 'loss') => {
    if (!isSoundEnabled) return;
    switch (type) {
        case 'correct': soundService.playCorrect(); break;
        case 'incorrect': soundService.playIncorrect(); break;
        case 'win': soundService.playWin(); break;
        case 'loss': soundService.playLoss(); break;
    }
  }, [isSoundEnabled]);

  // Persist Stats
  useEffect(() => {
    localStorage.setItem('math-hangman-stats', JSON.stringify(stats));
  }, [stats]);

  const updatePersistentStats = useCallback((isWin: boolean, scoreDelta: number, finalStreak: number) => {
    setStats(prev => ({
        gamesPlayed: prev.gamesPlayed + 1,
        gamesWon: isWin ? prev.gamesWon + 1 : prev.gamesWon,
        longestStreak: Math.max(prev.longestStreak, finalStreak),
        totalScoreDelta: prev.totalScoreDelta + scoreDelta
    }));
  }, []);

  const startNewGame = useCallback((overrideScore?: number) => {
    if (words.length === 0) {
      setError("Could not load words. Please try refreshing the page.");
      setGameState(GameState.Welcome);
      return;
    }

    // Set baseline score for stats calculation (use override if provided, else current state)
    setRoundStartScore(overrideScore !== undefined ? overrideScore : score);

    let nextWord: WordData;
    const candidates = words.length > 1 
      ? words.filter(w => w.word !== currentWord.word) 
      : words;

    const pool = candidates.length > 0 ? candidates : words;
    const randomIndex = Math.floor(Math.random() * pool.length);
    nextWord = pool[randomIndex];

    setCurrentWord(nextWord);
    setGuessedLetters({ correct: [], incorrect: [] });
    setGameId(prev => prev + 1);
    setTimeLeft(DIFFICULTY_SETTINGS[difficulty].timeLimit);
    setGameState(GameState.Playing);
  }, [words, currentWord, score, difficulty]);
  
  const handleStart = useCallback(async () => {
    setGameState(GameState.Loading);
    setError(null);
    try {
      const fetchedWords = await fetchMathWords(difficulty);
      setWords(fetchedWords);
    } catch (err) {
      setError("Failed to fetch words.");
      console.error(err);
    }
  }, [difficulty]);

  useEffect(() => {
    if (gameState === GameState.Loading && words.length > 0) {
      startNewGame();
    }
  }, [words, gameState, startNewGame]);

  // Timer Decrement Logic
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    if (gameState === GameState.Playing && isTimerEnabled) {
        timer = setInterval(() => {
            setTimeLeft((prev) => Math.max(0, prev - 1));
        }, 1000);
    }
    return () => {
        if (timer !== undefined) clearInterval(timer);
    };
  }, [gameState, isTimerEnabled]);

  // Game Over Check (Time Out)
  useEffect(() => {
    if (gameState === GameState.Playing && isTimerEnabled && timeLeft === 0) {
        playSound('loss');
        
        // Update Stats
        const delta = score - roundStartScore;
        updatePersistentStats(false, delta, streak); 
        
        setGameState(GameState.Lost);
        setStreak(0);
        setHistory(prev => [{ word: currentWord.word, definition: currentWord.definition, status: 'lost' }, ...prev]);
    }
  }, [timeLeft, gameState, currentWord, isTimerEnabled, playSound, score, roundStartScore, streak, updatePersistentStats]);

  const handleGuess = (letter: string) => {
    if (gameState !== GameState.Playing) return;

    if (currentWord.word.includes(letter)) {
      playSound('correct');
      setGuessedLetters(prev => ({
        ...prev,
        correct: [...prev.correct, letter]
      }));
    } else {
      playSound('incorrect');
      setGuessedLetters(prev => ({
        ...prev,
        incorrect: [...prev.incorrect, letter]
      }));
    }
  };

  const handleHintClick = () => {
    if (gameState !== GameState.Playing) return;
    if (score < HINT_COST) return;
    setShowHintConfirmation(true);
  };

  const confirmHint = () => {
    setShowHintConfirmation(false);
    
    if (score < HINT_COST) return; // Double check

    // Only filter for letters (A-Z) that are hidden
    const hiddenLetters = currentWord.word.split('')
        .filter(letter => /^[A-Z]$/.test(letter))
        .filter(letter => !guessedLetters.correct.includes(letter));
        
    if (hiddenLetters.length === 0) return;

    const randomLetter = hiddenLetters[Math.floor(Math.random() * hiddenLetters.length)];

    setScore(prev => Math.max(0, prev - HINT_COST));
    handleGuess(randomLetter);

    setRevealedHintLetter(randomLetter);
    setFeedbackMessage(`Hint Used! -${HINT_COST} Points`);
    setTimeout(() => {
        setRevealedHintLetter(null);
        setFeedbackMessage(null);
    }, 2000);
  };

  const handleSkip = () => {
    if (gameState !== GameState.Playing) return;

    const newScore = Math.max(0, score - SKIP_COST);
    const delta = newScore - roundStartScore;
    
    // Update Stats
    updatePersistentStats(false, delta, streak);

    setScore(newScore);
    setStreak(0);

    setHistory(prev => [{
        word: currentWord.word,
        definition: currentWord.definition,
        status: 'skipped'
    }, ...prev]);

    // Pass newScore to startNewGame so roundStartScore is set correctly for the next game
    startNewGame(newScore);
  };

  // Game Over Check (Win/Loss via Guesses)
  useEffect(() => {
    if (gameState !== GameState.Playing) return;

    const incorrectCount = guessedLetters.incorrect.length;
    
    // Win Condition: All LETTERS (A-Z) must be guessed. Spaces/Special chars are ignored.
    const isWordGuessed = currentWord.word && currentWord.word.split('').every(letter => {
        const isLetter = /^[A-Z]$/.test(letter);
        return !isLetter || guessedLetters.correct.includes(letter);
    });
    
    // Use settings for max guesses
    if (incorrectCount >= currentSettings.maxGuesses) {
      playSound('loss');
      
      const delta = score - roundStartScore;
      updatePersistentStats(false, delta, streak);

      setGameState(GameState.Lost);
      setStreak(0);
      setHistory(prev => [{ word: currentWord.word, definition: currentWord.definition, status: 'lost' }, ...prev]);
    } else if (isWordGuessed) {
      playSound('win');
      
      // Trigger confetti
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#60A5FA', '#34D399', '#FBBF24', '#A78BFA'], // Matches Tailwind colors
        zIndex: 2000
      });
      
      const newScore = score + POINTS_PER_WORD;
      const newStreak = streak + 1;
      const delta = newScore - roundStartScore;
      
      updatePersistentStats(true, delta, newStreak);

      setGameState(GameState.Won);
      setScore(newScore);
      setWordsSolved(prev => prev + 1);
      setStreak(newStreak);
      setHistory(prev => [{ word: currentWord.word, definition: currentWord.definition, status: 'won' }, ...prev]);
    }
  }, [guessedLetters, currentWord, gameState, playSound, score, roundStartScore, streak, updatePersistentStats, currentSettings.maxGuesses]);

  const handleExit = () => {
    setScore(INITIAL_SCORE);
    setWordsSolved(0);
    setStreak(0);
    setHistory([]);
    setGameState(GameState.Welcome);
    // Reset words so they re-fetch/shuffle if difficulty changes next time
    setWords([]); 
  }
  
  const handleResetStats = () => {
    const resetStats = { gamesPlayed: 0, gamesWon: 0, longestStreak: 0, totalScoreDelta: 0 };
    setStats(resetStats);
    localStorage.setItem('math-hangman-stats', JSON.stringify(resetStats));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const renderContent = () => {
    switch (gameState) {
      case GameState.Welcome:
        return (
            <div className="w-full h-full animate-slide-up relative flex flex-col">
                <WelcomeScreen 
                    onStart={handleStart} 
                    difficulty={difficulty}
                    setDifficulty={setDifficulty}
                />
                <div className="absolute top-2 right-2 md:top-4 md:right-4 flex flex-col md:flex-row gap-2 items-end md:items-center z-20">
                   <button 
                        onClick={() => setShowStats(true)}
                        className="bg-white/80 hover:bg-white text-blue-900 font-bold py-1.5 px-3 rounded-full shadow-sm transition-all flex items-center gap-2 text-sm"
                   >
                        <span className="text-lg">📊</span> Stats
                   </button>
                   <div className="flex gap-2 scale-90 md:scale-100 origin-right">
                        <ToggleSwitch label="🔊 Sound" isChecked={isSoundEnabled} onChange={setIsSoundEnabled} />
                        <ToggleSwitch label="⏱️ Timer" isChecked={isTimerEnabled} onChange={setIsTimerEnabled} />
                   </div>
                </div>
                {showStats && <StatsModal stats={stats} onClose={() => setShowStats(false)} onReset={handleResetStats} />}
            </div>
        );
      case GameState.Loading:
        return (
          <div className="flex flex-col items-center justify-center h-full animate-slide-up">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
            <p className="mt-4 text-lg text-blue-700 font-bold">Loading Math Words...</p>
          </div>
        );
      case GameState.Playing:
      case GameState.Won:
      case GameState.Lost:
        const isLowTime = timeLeft <= 10;
        const isSkipAvailable = guessedLetters.incorrect.length >= SKIP_MIN_WRONG_GUESSES || (isTimerEnabled && timeLeft <= SKIP_MAX_TIME_LEFT);
        
        return (
          <div key={gameId} className="relative w-full h-full flex flex-col items-center p-1 text-center animate-slide-up overflow-hidden">
            {(gameState === GameState.Won || gameState === GameState.Lost) && (
              <Modal 
                status={gameState === GameState.Won ? 'won' : 'lost'} 
                word={currentWord.word}
                onPlayAgain={() => startNewGame()}
                onExit={handleExit}
              />
            )}
            {showHistory && (
                <HistoryModal history={history} onClose={() => setShowHistory(false)} />
            )}
            {showStats && (
                <StatsModal stats={stats} onClose={() => setShowStats(false)} onReset={handleResetStats} />
            )}
            {showHintConfirmation && (
                <ConfirmationModal
                    title="Use Hint?"
                    message={<>This will reveal one random letter but cost you <span className="font-bold text-red-500">{HINT_COST} points</span>. Are you sure?</>}
                    onConfirm={confirmHint}
                    onCancel={() => setShowHintConfirmation(false)}
                    confirmLabel={`Use Hint (-${HINT_COST})`}
                    confirmColorClass="bg-purple-600 hover:bg-purple-700"
                />
            )}
            {showExitConfirmation && (
                <ConfirmationModal
                    title="Exit Game?"
                    message="Are you sure you want to exit? Your current game progress will be lost."
                    onConfirm={() => { handleExit(); setShowExitConfirmation(false); }}
                    onCancel={() => setShowExitConfirmation(false)}
                    confirmLabel="Exit Game"
                    confirmColorClass="bg-red-600 hover:bg-red-700"
                />
            )}

            {feedbackMessage && (
              <div className="absolute top-24 left-0 right-0 flex justify-center z-20 pointer-events-none">
                <div className="bg-yellow-400 text-yellow-900 font-bold px-4 py-1.5 rounded-full shadow-lg border-4 border-yellow-200 animate-bounce-in text-base md:text-lg">
                  {feedbackMessage}
                </div>
              </div>
            )}
            
            {/* Exit Button (Top Left) */}
            <button 
                onClick={() => setShowExitConfirmation(true)}
                className="absolute top-2 left-2 flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-800 hover:bg-red-200 border-2 border-red-200 font-bold rounded-xl text-xs md:text-sm transition-transform hover:scale-105 shadow-md z-50"
                aria-label="Exit Game"
            >
                <span className="text-base">🚪</span> Exit
            </button>

            <div className="w-full flex justify-end px-2 pt-1 gap-2 absolute top-1 right-1 z-10 scale-90 md:scale-100 origin-top-right">
               {/* Difficulty Badge */}
               <div className={`px-2 py-0.5 rounded-full text-white font-bold text-[10px] uppercase shadow-sm flex items-center ${currentSettings.color}`}>
                  {difficulty}
               </div>
               <ToggleSwitch label="🔊" isChecked={isSoundEnabled} onChange={setIsSoundEnabled} />
               <ToggleSwitch label="⏱️" isChecked={isTimerEnabled} onChange={setIsTimerEnabled} />
            </div>

            {/* Header Bar - Reduced top margin */}
            <header className="w-full flex flex-row justify-center items-center px-2 py-1 shrink-0 gap-2 md:gap-4 mt-2 mb-0.5 z-10 relative">
                <Tooltip content="Current Score">
                    <div className="bg-yellow-400 text-yellow-900 font-bold text-xs md:text-sm px-2 py-1 md:px-3 md:py-1.5 rounded-lg shadow-md flex items-center border-2 border-yellow-300 cursor-help">
                        <span className="mr-1 text-sm md:text-base">⭐</span> {score}
                    </div>
                </Tooltip>
                
                <Tooltip content="Words Solved">
                    <div className="bg-green-400 text-green-900 font-bold text-xs md:text-sm px-2 py-1 md:px-3 md:py-1.5 rounded-lg shadow-md flex items-center border-2 border-green-300 cursor-help">
                        <span className="mr-1 text-sm md:text-base">📚</span> {wordsSolved}
                    </div>
                </Tooltip>
                
                <Tooltip content="Winning Streak">
                    <div className="bg-orange-400 text-orange-900 font-bold text-xs md:text-sm px-2 py-1 md:px-3 md:py-1.5 rounded-lg shadow-md flex items-center border-2 border-orange-300 cursor-help">
                        <span className="mr-1 text-sm md:text-base">🔥</span> {streak}
                    </div>
                </Tooltip>

                <Tooltip content="Time Remaining">
                    <div className={`${isLowTime && isTimerEnabled ? 'bg-red-500 text-white animate-pulse' : 'bg-blue-400 text-blue-900'} font-bold text-xs md:text-sm px-2 py-1 md:px-3 md:py-1.5 rounded-lg shadow-md flex items-center transition-colors duration-300 border-2 border-blue-300 ${!isTimerEnabled ? 'opacity-50 grayscale' : ''} cursor-help`}>
                        <span className="mr-1 text-sm md:text-base">⏰</span> {isTimerEnabled ? formatTime(timeLeft) : '--:--'}
                    </div>
                </Tooltip>
                
                <div className="flex gap-1 ml-1">
                    <Tooltip content="Statistics">
                        <button onClick={() => setShowStats(true)} className="p-1 hover:bg-blue-100 rounded-full text-base" title="Stats">📊</button>
                    </Tooltip>
                    <Tooltip content="Word History">
                        <button onClick={() => setShowHistory(true)} className="p-1 hover:bg-blue-100 rounded-full text-base" title="History">📜</button>
                    </Tooltip>
                </div>
            </header>

            {/* Main Game Vertical Stack - Reduced gap */}
            <main className="flex flex-col items-center w-full max-w-2xl px-2 grow h-full overflow-hidden z-10 relative justify-start md:justify-center">
                
                {/* 1. Hangman Figure */}
                <div className="flex flex-col items-center shrink-0 mb-0.5">
                    <HangmanFigure 
                        wrongGuesses={guessedLetters.incorrect.length} 
                        maxGuesses={currentSettings.maxGuesses}
                    />
                    <IncorrectGuesses incorrectLetters={guessedLetters.incorrect} />
                    <div className="text-[9px] text-gray-500 font-bold bg-white/50 px-2 py-0.5 rounded-full mt-0">
                        {currentSettings.maxGuesses - guessedLetters.incorrect.length} Attempts Left
                    </div>
                </div>

                {/* 2. Word Display & Hint */}
                <div className="flex flex-col items-center w-full mb-1 shrink-0">
                     <WordDisplay 
                        word={currentWord.word} 
                        correctGuesses={guessedLetters.correct} 
                        revealedLetter={revealedHintLetter}
                    />
                     <button
                        onClick={handleHintClick}
                        disabled={score < HINT_COST}
                        className={`mt-0.5 flex items-center gap-1.5 px-2 py-0.5 rounded-full font-bold shadow-sm transition-all transform text-[9px] md:text-[10px]
                            ${score >= HINT_COST 
                                ? 'bg-purple-100 text-purple-700 border border-purple-300 hover:bg-purple-200 hover:scale-105' 
                                : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'}`}
                    >
                        <span>💡</span> Hint <span className="text-[9px] bg-purple-200 px-1 rounded-full">-{HINT_COST}</span>
                    </button>
                </div>

                {/* 3. Definition (Below Word) */}
                <div className="bg-white/90 backdrop-blur-sm p-1.5 md:p-2 rounded-xl shadow-md border-2 border-blue-100 w-full max-w-lg mb-1 relative flex flex-col items-center justify-center shrink-0 transition-all duration-300">
                        <h3 className="text-gray-400 text-[9px] uppercase font-bold mb-0.5 tracking-wider">Definition</h3>
                        <p className="text-xs md:text-sm text-blue-900 font-medium leading-snug text-center px-2 mb-1.5 max-h-20 overflow-y-auto custom-scrollbar">
                        {currentWord.definition}
                        </p>

                        <div className="w-full flex justify-center border-t border-blue-50 pt-1 mt-0">
                            <button
                            onClick={handleSkip}
                            disabled={!isSkipAvailable}
                            className={`
                                flex items-center gap-1 px-3 py-0.5 rounded-full font-bold text-[9px] md:text-[10px] uppercase tracking-wider shadow-sm transition-all
                                ${isSkipAvailable 
                                    ? 'bg-orange-100 text-orange-700 border border-orange-300 hover:bg-orange-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer ring-2 ring-orange-200/50' 
                                    : 'bg-slate-50 text-slate-300 border border-slate-100 cursor-not-allowed'}
                            `}
                            title={!isSkipAvailable ? `Skip available after ${SKIP_MIN_WRONG_GUESSES} mistakes or low time` : 'Skip this word'}
                            >
                            <span className={isSkipAvailable ? "animate-bounce" : ""}>⏭️</span> 
                            {isSkipAvailable ? `Skip Word (-${SKIP_COST} pts)` : 'Skip Word'}
                            </button>
                        </div>
                </div>

                {/* 4. Keyboard (Bottom) - Increased padding bottom, reduced margin top */}
                <div className="mt-1 w-full pb-6 md:pb-10 shrink-0">
                     <Keyboard onGuess={handleGuess} guessedLetters={guessedLetters} />
                </div>
            </main>
            
            <footer className="mt-auto pb-0.5 text-blue-400/80 font-bold text-[9px] shrink-0 relative z-10">
                Math Hangman • Grade 3
            </footer>
          </div>
        );
    }
  };

  return (
    <div className="w-full h-screen bg-blue-50 overflow-hidden font-sans select-none relative">
      {/* Parallax Background Layers */}
      <div ref={backgroundRef} className="absolute inset-[-50px] opacity-60 pointer-events-none z-0 transition-transform duration-100 ease-out will-change-transform">
         {/* Subtle Gradient Blob */}
         <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-200/40 via-blue-100/10 to-transparent"></div>
      </div>
      
      <div ref={shapesRef} className="absolute inset-[-50px] pointer-events-none z-0 overflow-hidden transition-transform duration-100 ease-out will-change-transform">
          {/* Floating Math Symbols with parallax depth */}
          <div className="absolute top-[20%] left-[15%] text-blue-200 text-9xl font-serif opacity-20 select-none rotate-12">π</div>
          <div className="absolute bottom-[15%] right-[10%] text-blue-200 text-9xl font-serif opacity-20 select-none -rotate-12">∑</div>
          <div className="absolute top-[30%] right-[25%] text-blue-200 text-8xl font-mono opacity-10 select-none rotate-45">÷</div>
          <div className="absolute bottom-[40%] left-[8%] text-indigo-100 text-8xl font-mono opacity-20 select-none -rotate-6">×</div>
          <div className="absolute top-[10%] right-[5%] text-indigo-200 text-6xl font-bold opacity-15 select-none">√</div>
          <div className="absolute bottom-[5%] left-[30%] text-indigo-200 text-6xl font-bold opacity-15 select-none">%</div>
      </div>

      {/* Main Content Wrapper */}
      <div className="relative z-10 w-full h-full flex flex-col">
        {error && (
            <div className="absolute top-0 left-0 w-full bg-red-500 text-white p-2 text-center z-50 shadow-md">
            {error}
            </div>
        )}
        {renderContent()}
      </div>
    </div>
  );
};

export default App;
