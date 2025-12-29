import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { GameState } from '../types';
import { colors, typography, spacing, shadows, borderRadius } from '../theme';

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
        <View
          key={i}
          style={[
            styles.heartContainer,
            i < lives ? styles.heartActive : styles.heartInactive,
          ]}
        >
          <Text style={styles.heart}>
            {i < lives ? '❤️' : '🤍'}
          </Text>
        </View>
      );
    }
    return hearts;
  };

  return (
    <View style={styles.container}>
      {/* Lives */}
      <View style={styles.section}>
        <View style={styles.livesCard}>
          {renderHearts()}
        </View>
      </View>

      {/* Level Badge */}
      <View style={styles.section}>
        <View style={styles.levelBadge}>
          <Text style={styles.levelLabel}>LEVEL</Text>
          <Text style={styles.levelValue}>{level}</Text>
        </View>
      </View>

      {/* Score & Pause */}
      <View style={[styles.section, styles.rightSection]}>
        <View style={styles.scoreCard}>
          <Text style={styles.scoreLabel}>Score</Text>
          <Text style={styles.scoreValue}>{score}</Text>
        </View>
        <TouchableOpacity
          onPress={onPause}
          style={styles.pauseButton}
          activeOpacity={0.7}
        >
          <Text style={styles.pauseIcon}>⏸️</Text>
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
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  section: {
    flex: 1,
  },
  rightSection: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  livesCard: {
    flexDirection: 'row',
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    alignSelf: 'flex-start',
    ...shadows.small,
  },
  heartContainer: {
    marginHorizontal: 2,
  },
  heartActive: {
    transform: [{ scale: 1 }],
  },
  heartInactive: {
    opacity: 0.5,
  },
  heart: {
    fontSize: 18,
  },
  levelBadge: {
    backgroundColor: colors.accent.yellow,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    alignItems: 'center',
    alignSelf: 'center',
    ...shadows.small,
  },
  levelLabel: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
    letterSpacing: 1,
  },
  levelValue: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.heavy,
    color: colors.text.primary,
    marginTop: -2,
  },
  scoreCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    alignItems: 'center',
    ...shadows.small,
  },
  scoreLabel: {
    fontSize: typography.sizes.xs,
    color: colors.text.secondary,
    fontWeight: typography.weights.medium,
  },
  scoreValue: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.rain.droplet,
  },
  pauseButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.background.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
    ...shadows.small,
  },
  pauseIcon: {
    fontSize: 20,
  },
});
