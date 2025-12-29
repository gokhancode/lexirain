import React from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

interface FallingWordProps {
  meaning: string;
  x: number;
  animatedY: Animated.Value;
}

export const FallingWord: React.FC<FallingWordProps> = ({ meaning, x, animatedY }) => {
  return (
    <Animated.View
      style={[
        styles.container,
        {
          left: `${x}%`,
          transform: [{ translateY: animatedY }],
        },
      ]}
    >
      <View style={styles.bubble}>
        <Text style={styles.text}>{meaning}</Text>
      </View>
      <View style={styles.droplet} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: -60,
    alignItems: 'center',
  },
  bubble: {
    backgroundColor: '#4A90D9',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    minWidth: 60,
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  droplet: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#4A90D9',
  },
});
