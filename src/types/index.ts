export interface VocabularyWord {
  id: string;
  meaning: string; // The meaning/definition shown to the player
  translation: string; // The correct translation the player must type
  alternatives?: string[]; // Alternative correct answers
}

export interface FallingWordState {
  id: string;
  word: VocabularyWord;
  x: number; // Horizontal position (percentage)
  y: number; // Vertical position (animated)
  speed: number; // Fall speed
  isActive: boolean;
}

export interface GameState {
  score: number;
  lives: number;
  level: number;
  wordsCompleted: number;
  isPlaying: boolean;
  isPaused: boolean;
  isGameOver: boolean;
}

export type LanguagePair = {
  source: string; // Language of the meaning shown
  target: string; // Language the player types in
};
