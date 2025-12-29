import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { GameState } from '../types';

interface GameHeaderProps {
  gameState: GameState;
  onPause: () => void;
}

export const GameHeader: React.FC<GameHeaderProps> = ({ gameState, onPause }) => {
  const { score, lives, level } = gameState;

  const renderHearts = () => {
    const hearts = [];
    for (let i = 0; i < 3; i++) {
      hearts.push(
        <Text key={i} style={styles.heart}>
          {i < lives ? '❤️' : '🖤'}
        </Text>
      );
    }
    return hearts;
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <View style={styles.livesContainer}>{renderHearts()}</View>
      </View>

      <View style={styles.centerSection}>
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>Level {level}</Text>
        </View>
      </View>

      <View style={styles.rightSection}>
        <Text style={styles.scoreLabel}>Score</Text>
        <Text style={styles.scoreValue}>{score}</Text>
        <TouchableOpacity onPress={onPause} style={styles.pauseButton}>
          <Text style={styles.pauseText}>⏸️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  leftSection: {
    flex: 1,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
  },
  rightSection: {
    flex: 1,
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  livesContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  heart: {
    fontSize: 20,
  },
  levelBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 15,
  },
  levelText: {
    color: '#333',
    fontWeight: '700',
    fontSize: 14,
  },
  scoreLabel: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.8,
  },
  scoreValue: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  pauseButton: {
    marginLeft: 8,
    padding: 4,
  },
  pauseText: {
    fontSize: 20,
  },
});
