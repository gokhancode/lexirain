import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { CloudBackground } from '../components/CloudBackground';
import { FallingWord } from '../components/FallingWord';
import { GameHeader } from '../components/GameHeader';
import { GameInput } from '../components/GameInput';
import { Button } from '../components/Button';
import { useGameLogic } from '../hooks/useGameLogic';
import { colors, typography, spacing, shadows, borderRadius } from '../theme';
import { RootStackParamList } from '../navigation/types';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

type GameScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Game'>;
  route: RouteProp<RootStackParamList, 'Game'>;
};

// Countdown overlay before game starts
const CountdownOverlay: React.FC<{ count: number }> = ({ count }) => {
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    scaleAnim.setValue(0.5);
    opacityAnim.setValue(0);

    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [count, scaleAnim, opacityAnim]);

  return (
    <View style={styles.countdownOverlay}>
      <Animated.View
        style={[
          styles.countdownContainer,
          {
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          },
        ]}
      >
        <Text style={styles.countdownText}>
          {count === 0 ? 'GO!' : count}
        </Text>
      </Animated.View>
    </View>
  );
};

// Pause Modal
const PauseModal: React.FC<{
  visible: boolean;
  onResume: () => void;
  onRestart: () => void;
  onQuit: () => void;
}> = ({ visible, onResume, onRestart, onQuit }) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <Text style={styles.modalEmoji}>⏸️</Text>
          <Text style={styles.modalTitle}>Game Paused</Text>

          <View style={styles.modalButtons}>
            <Button
              title="Resume"
              onPress={onResume}
              fullWidth
              size="large"
            />
            <View style={styles.buttonSpacer} />
            <Button
              title="Restart"
              variant="secondary"
              onPress={onRestart}
              fullWidth
            />
            <View style={styles.buttonSpacer} />
            <Button
              title="Quit to Menu"
              variant="outline"
              onPress={onQuit}
              fullWidth
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Game Over Modal
const GameOverModal: React.FC<{
  visible: boolean;
  score: number;
  level: number;
  wordsCompleted: number;
  onRestart: () => void;
  onQuit: () => void;
}> = ({ visible, score, level, wordsCompleted, onRestart, onQuit }) => {
  const getPerformanceEmoji = () => {
    if (wordsCompleted >= 50) return '🏆';
    if (wordsCompleted >= 30) return '🌟';
    if (wordsCompleted >= 15) return '👏';
    if (wordsCompleted >= 5) return '💪';
    return '🌱';
  };

  const getPerformanceMessage = () => {
    if (wordsCompleted >= 50) return 'Incredible!';
    if (wordsCompleted >= 30) return 'Amazing!';
    if (wordsCompleted >= 15) return 'Great job!';
    if (wordsCompleted >= 5) return 'Good effort!';
    return 'Keep practicing!';
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <Text style={styles.gameOverEmoji}>{getPerformanceEmoji()}</Text>
          <Text style={styles.gameOverTitle}>Game Over</Text>
          <Text style={styles.performanceMessage}>{getPerformanceMessage()}</Text>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{score}</Text>
              <Text style={styles.statLabel}>Score</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{level}</Text>
              <Text style={styles.statLabel}>Level</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{wordsCompleted}</Text>
              <Text style={styles.statLabel}>Words</Text>
            </View>
          </View>

          <View style={styles.modalButtons}>
            <Button
              title="Play Again"
              onPress={onRestart}
              fullWidth
              size="large"
              icon={<Text style={{ fontSize: 20 }}>🔄</Text>}
            />
            <View style={styles.buttonSpacer} />
            <Button
              title="Back to Menu"
              variant="outline"
              onPress={onQuit}
              fullWidth
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export const GameScreen: React.FC<GameScreenProps> = ({ navigation, route }) => {
  const { language } = route.params;
  const [isCountingDown, setIsCountingDown] = useState(true);
  const [countdown, setCountdown] = useState(3);

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
  } = useGameLogic(language);

  // Countdown effect
  useEffect(() => {
    if (isCountingDown) {
      if (countdown > 0) {
        const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => {
          setIsCountingDown(false);
          startGame();
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [countdown, isCountingDown, startGame]);

  const handleSubmit = () => {
    if (currentInput.trim()) {
      checkAnswer(currentInput);
    }
  };

  const handleRestart = () => {
    setCountdown(3);
    setIsCountingDown(true);
  };

  const handleQuit = () => {
    navigation.navigate('Home');
  };

  const handlePause = () => {
    pauseGame();
  };

  const handleResume = () => {
    resumeGame();
  };

  // Danger zone indicator (bottom area)
  const dangerZoneHeight = 120;

  return (
    <CloudBackground variant="day" showClouds={!gameState.isPlaying}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        {/* Game Header */}
        {gameState.isPlaying && !isCountingDown && (
          <GameHeader gameState={gameState} onPause={handlePause} />
        )}

        {/* Game Area */}
        <View style={styles.gameArea}>
          {/* Falling Words */}
          {fallingWords.map((fw) => (
            <FallingWord
              key={fw.id}
              meaning={fw.word.meaning}
              x={fw.x}
              animatedY={fw.animatedY}
            />
          ))}

          {/* Danger Zone Indicator */}
          {gameState.isPlaying && !gameState.isPaused && (
            <View
              style={[
                styles.dangerZone,
                { height: dangerZoneHeight }
              ]}
              pointerEvents="none"
            />
          )}
        </View>

        {/* Input Area */}
        {gameState.isPlaying && !gameState.isPaused && !isCountingDown && (
          <GameInput
            value={currentInput}
            onChangeText={setCurrentInput}
            onSubmit={handleSubmit}
            feedback={feedback}
            disabled={gameState.isGameOver}
          />
        )}

        {/* Countdown Overlay */}
        {isCountingDown && <CountdownOverlay count={countdown} />}

        {/* Pause Modal */}
        <PauseModal
          visible={gameState.isPaused}
          onResume={handleResume}
          onRestart={handleRestart}
          onQuit={handleQuit}
        />

        {/* Game Over Modal */}
        <GameOverModal
          visible={gameState.isGameOver}
          score={gameState.score}
          level={gameState.level}
          wordsCompleted={gameState.wordsCompleted}
          onRestart={handleRestart}
          onQuit={handleQuit}
        />
      </SafeAreaView>
    </CloudBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gameArea: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  dangerZone: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(229, 115, 115, 0.15)',
    borderTopWidth: 2,
    borderTopColor: 'rgba(229, 115, 115, 0.3)',
  },
  countdownOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  countdownContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: colors.rain.droplet,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.large,
  },
  countdownText: {
    fontSize: 72,
    fontWeight: typography.weights.heavy,
    color: colors.text.light,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.background.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    ...shadows.large,
  },
  modalEmoji: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  modalTitle: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  modalButtons: {
    width: '100%',
  },
  buttonSpacer: {
    height: spacing.md,
  },
  gameOverEmoji: {
    fontSize: 80,
    marginBottom: spacing.md,
  },
  gameOverTitle: {
    fontSize: typography.sizes.xxxl,
    fontWeight: typography.weights.heavy,
    color: colors.text.primary,
  },
  performanceMessage: {
    fontSize: typography.sizes.lg,
    color: colors.rain.droplet,
    fontWeight: typography.weights.semibold,
    marginBottom: spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary.skyLight,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    width: '100%',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.heavy,
    color: colors.text.primary,
  },
  statLabel: {
    fontSize: typography.sizes.xs,
    color: colors.text.secondary,
    marginTop: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.text.muted,
  },
});
