import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  FallingWord,
  GameHeader,
  GameInput,
  StartScreen,
  PauseScreen,
  GameOverScreen,
} from '../components';
import { useGameLogic } from '../hooks/useGameLogic';
import { LanguageKey } from '../data/vocabulary';

export const GameScreen: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageKey>('spanish');
  const [showStartScreen, setShowStartScreen] = useState(true);

  const {
    gameState,
    fallingWords,
    currentInput,
    setCurrentInput,
    feedback,
    checkAnswer,
    startGame,
    pauseGame,
    resumeGame,
  } = useGameLogic(selectedLanguage);

  const handleStart = () => {
    setShowStartScreen(false);
    startGame();
  };

  const handleRestart = () => {
    startGame();
  };

  const handleSubmit = () => {
    if (currentInput.trim()) {
      checkAnswer(currentInput);
    }
  };

  const handleBackToMenu = () => {
    setShowStartScreen(true);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#0f0c29', '#302b63', '#24243e']}
        style={styles.background}
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Game Header */}
          {gameState.isPlaying && (
            <GameHeader gameState={gameState} onPause={pauseGame} />
          )}

          {/* Game Area - Falling Words */}
          <View style={styles.gameArea}>
            {fallingWords.map((fw) => (
              <FallingWord
                key={fw.id}
                meaning={fw.word.meaning}
                x={fw.x}
                animatedY={fw.animatedY}
              />
            ))}
          </View>

          {/* Input Area */}
          {gameState.isPlaying && !gameState.isPaused && (
            <GameInput
              value={currentInput}
              onChangeText={setCurrentInput}
              onSubmit={handleSubmit}
              feedback={feedback}
              disabled={gameState.isGameOver}
            />
          )}
        </SafeAreaView>

        {/* Overlays */}
        <StartScreen
          visible={showStartScreen}
          selectedLanguage={selectedLanguage}
          onSelectLanguage={setSelectedLanguage}
          onStart={handleStart}
        />

        <PauseScreen
          visible={gameState.isPaused}
          onResume={resumeGame}
          onRestart={handleRestart}
        />

        <GameOverScreen
          visible={gameState.isGameOver}
          gameState={gameState}
          onRestart={handleRestart}
        />
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  gameArea: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
});
