import { useState, useCallback, useRef, useEffect } from 'react';
import { Animated, Dimensions } from 'react-native';
import { VocabularyWord, GameState } from '../types';
import { vocabularyLibrary, LanguageKey } from '../data/vocabulary';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const INITIAL_LIVES = 3;

// SLOWER difficulty settings for a more relaxed experience
const BASE_FALL_DURATION = 18000; // 18 seconds base fall time (slower)
const MIN_FALL_DURATION = 8000;   // Minimum 8 seconds (slower)
const FALL_SPEED_DECREASE_PER_LEVEL = 200; // Even slower decrease per level

const SPAWN_INTERVAL_BASE = 6000; // 6 seconds between spawns (slower)
const SPAWN_INTERVAL_MIN = 3000;  // Minimum 3 seconds (slower)
const SPAWN_INTERVAL_DECREASE_PER_LEVEL = 100; // Even slower decrease per level

const POINTS_PER_WORD = 10;
const WORDS_PER_LEVEL = 10; // 10 words per level (was 5) - slower progression

interface FallingWord {
  id: string;
  word: VocabularyWord;
  x: number;
  animatedY: Animated.Value;
  isActive: boolean;
}

export const useGameLogic = (language: LanguageKey = 'spanish') => {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    lives: INITIAL_LIVES,
    level: 1,
    wordsCompleted: 0,
    isPlaying: false,
    isPaused: false,
    isGameOver: false,
  });

  const [fallingWords, setFallingWords] = useState<FallingWord[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'wrong' | 'missed' | null; word?: string }>({ type: null });

  const vocabulary = vocabularyLibrary[language];
  const usedWordsRef = useRef<Set<string>>(new Set());
  const spawnIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const animationsRef = useRef<Map<string, Animated.CompositeAnimation>>(new Map());

  const getRandomWord = useCallback((): VocabularyWord | null => {
    const availableWords = vocabulary.filter(w => !usedWordsRef.current.has(w.id));
    if (availableWords.length === 0) {
      usedWordsRef.current.clear();
      return vocabulary[Math.floor(Math.random() * vocabulary.length)];
    }
    const word = availableWords[Math.floor(Math.random() * availableWords.length)];
    usedWordsRef.current.add(word.id);
    return word;
  }, [vocabulary]);

  const getFallDuration = useCallback((level: number) => {
    // Gradual decrease in fall duration (slower progression)
    const duration = BASE_FALL_DURATION - (level - 1) * FALL_SPEED_DECREASE_PER_LEVEL;
    return Math.max(duration, MIN_FALL_DURATION);
  }, []);

  const getSpawnInterval = useCallback((level: number) => {
    // Gradual decrease in spawn interval (slower progression)
    const interval = SPAWN_INTERVAL_BASE - (level - 1) * SPAWN_INTERVAL_DECREASE_PER_LEVEL;
    return Math.max(interval, SPAWN_INTERVAL_MIN);
  }, []);

  const removeWord = useCallback((wordId: string) => {
    const animation = animationsRef.current.get(wordId);
    if (animation) {
      animation.stop();
      animationsRef.current.delete(wordId);
    }
    setFallingWords(prev => prev.filter(w => w.id !== wordId));
  }, []);

  const spawnWord = useCallback(() => {
    if (gameState.isPaused || gameState.isGameOver) return;

    const word = getRandomWord();
    if (!word) return;

    const id = `${word.id}-${Date.now()}`;
    // Ensure words spawn with enough margin from edges
    const x = 15 + Math.random() * 50; // 15-65% from left (better centering)
    const animatedY = new Animated.Value(0);

    const newWord: FallingWord = {
      id,
      word,
      x,
      animatedY,
      isActive: true,
    };

    setFallingWords(prev => [...prev, newWord]);

    const fallDuration = getFallDuration(gameState.level);
    const animation = Animated.timing(animatedY, {
      toValue: SCREEN_HEIGHT,
      duration: fallDuration,
      useNativeDriver: true,
    });

    animationsRef.current.set(id, animation);

    animation.start(({ finished }) => {
      if (finished) {
        // Word hit the ground - lose a life
        setGameState(prev => {
          const newLives = prev.lives - 1;
          if (newLives <= 0) {
            return { ...prev, lives: 0, isGameOver: true, isPlaying: false };
          }
          return { ...prev, lives: newLives };
        });
        setFeedback({ type: 'missed', word: word.translation });
        setTimeout(() => setFeedback({ type: null }), 1500);
        removeWord(id);
      }
    });
  }, [gameState.isPaused, gameState.isGameOver, gameState.level, getRandomWord, getFallDuration, removeWord]);

  const checkAnswer = useCallback((input: string) => {
    const normalizedInput = input.toLowerCase().trim();

    for (const fallingWord of fallingWords) {
      const { word, id } = fallingWord;
      const isCorrect =
        word.translation.toLowerCase() === normalizedInput ||
        word.alternatives?.some(alt => alt.toLowerCase() === normalizedInput);

      if (isCorrect) {
        removeWord(id);

        setGameState(prev => {
          const newWordsCompleted = prev.wordsCompleted + 1;
          const newLevel = Math.floor(newWordsCompleted / WORDS_PER_LEVEL) + 1;
          const levelBonus = newLevel > prev.level ? 50 : 0;

          return {
            ...prev,
            score: prev.score + POINTS_PER_WORD + levelBonus,
            wordsCompleted: newWordsCompleted,
            level: newLevel,
          };
        });

        setFeedback({ type: 'correct', word: word.translation });
        setTimeout(() => setFeedback({ type: null }), 500);
        setCurrentInput('');
        return true;
      }
    }

    // Wrong answer
    setFeedback({ type: 'wrong' });
    setTimeout(() => setFeedback({ type: null }), 300);
    return false;
  }, [fallingWords, removeWord]);

  const startGame = useCallback(() => {
    // Clear all existing words and animations
    fallingWords.forEach(w => {
      const animation = animationsRef.current.get(w.id);
      if (animation) animation.stop();
    });
    animationsRef.current.clear();
    usedWordsRef.current.clear();

    setFallingWords([]);
    setCurrentInput('');
    setFeedback({ type: null });
    setGameState({
      score: 0,
      lives: INITIAL_LIVES,
      level: 1,
      wordsCompleted: 0,
      isPlaying: true,
      isPaused: false,
      isGameOver: false,
    });
  }, [fallingWords]);

  const pauseGame = useCallback(() => {
    setGameState(prev => ({ ...prev, isPaused: true }));
    // Pause all animations
    animationsRef.current.forEach(animation => animation.stop());
  }, []);

  const resumeGame = useCallback(() => {
    setGameState(prev => ({ ...prev, isPaused: false }));
    // Resume animations - they will continue from where they stopped
    fallingWords.forEach(fw => {
      const animation = animationsRef.current.get(fw.id);
      if (animation) {
        animation.start();
      }
    });
  }, [fallingWords]);

  // Spawn words at intervals
  useEffect(() => {
    if (gameState.isPlaying && !gameState.isPaused && !gameState.isGameOver) {
      // Small delay before spawning first word for better UX
      const initialDelay = setTimeout(() => {
        spawnWord();
      }, 500);

      const interval = getSpawnInterval(gameState.level);
      spawnIntervalRef.current = setInterval(spawnWord, interval);

      return () => {
        clearTimeout(initialDelay);
        if (spawnIntervalRef.current) {
          clearInterval(spawnIntervalRef.current);
        }
      };
    }
  }, [gameState.isPlaying, gameState.isPaused, gameState.isGameOver, gameState.level, spawnWord, getSpawnInterval]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (spawnIntervalRef.current) {
        clearInterval(spawnIntervalRef.current);
      }
      animationsRef.current.forEach(animation => animation.stop());
    };
  }, []);

  return {
    gameState,
    fallingWords,
    currentInput,
    setCurrentInput,
    feedback,
    checkAnswer,
    startGame,
    pauseGame,
    resumeGame,
  };
};
