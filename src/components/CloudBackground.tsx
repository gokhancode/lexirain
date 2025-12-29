import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface CloudProps {
  size: number;
  initialX: number;
  y: number;
  speed: number;
  opacity: number;
  delay: number;
}

const Cloud: React.FC<CloudProps> = ({ size, initialX, y, speed, opacity, delay }) => {
  const translateX = useRef(new Animated.Value(initialX)).current;

  useEffect(() => {
    const animate = () => {
      translateX.setValue(-size * 2);
      Animated.timing(translateX, {
        toValue: SCREEN_WIDTH + size,
        duration: speed,
        delay,
        useNativeDriver: true,
      }).start(() => animate());
    };
    animate();
  }, [translateX, size, speed, delay]);

  return (
    <Animated.View
      style={[
        styles.cloud,
        {
          width: size,
          height: size * 0.6,
          top: y,
          opacity,
          transform: [{ translateX }],
        },
      ]}
    >
      {/* Main cloud body */}
      <View style={[styles.cloudCircle, { width: size * 0.5, height: size * 0.5, left: size * 0.25, bottom: 0 }]} />
      <View style={[styles.cloudCircle, { width: size * 0.4, height: size * 0.4, left: 0, bottom: size * 0.05 }]} />
      <View style={[styles.cloudCircle, { width: size * 0.35, height: size * 0.35, right: 0, bottom: size * 0.08 }]} />
      <View style={[styles.cloudCircle, { width: size * 0.3, height: size * 0.3, left: size * 0.15, bottom: size * 0.2 }]} />
      <View style={[styles.cloudCircle, { width: size * 0.28, height: size * 0.28, right: size * 0.12, bottom: size * 0.18 }]} />
    </Animated.View>
  );
};

interface CloudBackgroundProps {
  variant?: 'day' | 'sunset' | 'night';
  children?: React.ReactNode;
  showClouds?: boolean;
}

export const CloudBackground: React.FC<CloudBackgroundProps> = ({
  variant = 'day',
  children,
  showClouds = true,
}) => {
  const gradients = {
    day: colors.background.gradient.sky as [string, string, string],
    sunset: colors.background.gradient.sunset as [string, string, string],
    night: colors.background.gradient.night as [string, string, string],
  };

  const clouds: CloudProps[] = [
    { size: 120, initialX: -150, y: SCREEN_HEIGHT * 0.08, speed: 45000, opacity: 0.9, delay: 0 },
    { size: 80, initialX: SCREEN_WIDTH * 0.3, y: SCREEN_HEIGHT * 0.15, speed: 55000, opacity: 0.7, delay: 5000 },
    { size: 100, initialX: SCREEN_WIDTH * 0.6, y: SCREEN_HEIGHT * 0.05, speed: 50000, opacity: 0.8, delay: 2000 },
    { size: 60, initialX: -80, y: SCREEN_HEIGHT * 0.22, speed: 60000, opacity: 0.6, delay: 8000 },
    { size: 90, initialX: SCREEN_WIDTH * 0.1, y: SCREEN_HEIGHT * 0.12, speed: 48000, opacity: 0.75, delay: 12000 },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={gradients[variant]}
        style={styles.gradient}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      >
        {showClouds && (
          <View style={styles.cloudsContainer} pointerEvents="none">
            {clouds.map((cloud, index) => (
              <Cloud key={index} {...cloud} />
            ))}
          </View>
        )}
        {children}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  cloudsContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  cloud: {
    position: 'absolute',
  },
  cloudCircle: {
    position: 'absolute',
    backgroundColor: colors.primary.cloud,
    borderRadius: 999,
  },
});
