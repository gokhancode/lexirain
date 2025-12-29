import React from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { colors, typography, shadows, borderRadius, spacing } from '../theme';

interface FallingWordProps {
  meaning: string;
  x: number;
  animatedY: Animated.Value;
}

export const FallingWord: React.FC<FallingWordProps> = ({ meaning, x, animatedY }) => {
  // Create a subtle wobble effect
  const wobble = animatedY.interpolate({
    inputRange: [0, 100, 200, 300, 400],
    outputRange: ['0deg', '2deg', '-2deg', '1deg', '0deg'],
    extrapolate: 'extend',
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          left: `${x}%`,
          transform: [
            { translateY: animatedY },
            { rotate: wobble },
          ],
        },
      ]}
    >
      {/* Raindrop shape */}
      <View style={styles.raindrop}>
        {/* Highlight/shine effect */}
        <View style={styles.highlight} />

        {/* Word content */}
        <Text style={styles.text} numberOfLines={2} adjustsFontSizeToFit>
          {meaning}
        </Text>
      </View>

      {/* Droplet tail */}
      <View style={styles.dropletTail} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: -120,
    alignItems: 'center',
    marginLeft: -80, // Center the droplet
  },
  raindrop: {
    backgroundColor: colors.rain.droplet,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.xl,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    borderBottomLeftRadius: borderRadius.lg,
    borderBottomRightRadius: borderRadius.lg,
    minWidth: 120,
    maxWidth: 200,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.medium,
    // Gradient-like effect with border
    borderWidth: 2,
    borderColor: colors.rain.dropletLight,
  },
  highlight: {
    position: 'absolute',
    top: 8,
    left: 14,
    width: 20,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    transform: [{ rotate: '-20deg' }],
  },
  text: {
    color: colors.text.light,
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  dropletTail: {
    width: 0,
    height: 0,
    borderLeftWidth: 16,
    borderRightWidth: 16,
    borderTopWidth: 20,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: colors.rain.droplet,
    marginTop: -2,
  },
});
