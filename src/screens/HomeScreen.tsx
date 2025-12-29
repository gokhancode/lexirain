import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Animated,
  Dimensions,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CloudBackground } from '../components/CloudBackground';
import { Button } from '../components/Button';
import { colors, typography, spacing, shadows, borderRadius } from '../theme';
import { RootStackParamList } from '../navigation/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

// Animated raindrop for decoration
const AnimatedRaindrop: React.FC<{ delay: number; x: number }> = ({ delay, x }) => {
  const translateY = useRef(new Animated.Value(-50)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = () => {
      translateY.setValue(-50);
      opacity.setValue(0);

      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0.6,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: 400,
            duration: 3000,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => animate());
    };
    animate();
  }, [translateY, opacity, delay]);

  return (
    <Animated.View
      style={[
        styles.raindrop,
        {
          left: x,
          opacity,
          transform: [{ translateY }],
        },
      ]}
    />
  );
};

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;
  const buttonsOpacity = useRef(new Animated.Value(0)).current;
  const buttonsTranslateY = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    // Entrance animations
    Animated.sequence([
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(buttonsOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(buttonsTranslateY, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Continuous subtle logo animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoRotate, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(logoRotate, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [logoScale, logoRotate, buttonsOpacity, buttonsTranslateY]);

  const logoRotateInterpolate = logoRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['-3deg', '3deg'],
  });

  const raindrops = Array.from({ length: 8 }, (_, i) => ({
    x: (SCREEN_WIDTH / 8) * i + 20,
    delay: i * 400,
  }));

  return (
    <CloudBackground variant="day">
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        {/* Decorative raindrops */}
        <View style={styles.rainContainer} pointerEvents="none">
          {raindrops.map((drop, index) => (
            <AnimatedRaindrop key={index} x={drop.x} delay={drop.delay} />
          ))}
        </View>

        {/* Logo Section */}
        <View style={styles.logoSection}>
          <Animated.View
            style={[
              styles.logoContainer,
              {
                transform: [
                  { scale: logoScale },
                  { rotate: logoRotateInterpolate },
                ],
              },
            ]}
          >
            <View style={styles.logoCloud}>
              <Text style={styles.logoEmoji}>🌧️</Text>
            </View>
            <Text style={styles.logoText}>LexiRain</Text>
            <Text style={styles.tagline}>Learn words like raindrops</Text>
          </Animated.View>
        </View>

        {/* Menu Buttons */}
        <Animated.View
          style={[
            styles.menuSection,
            {
              opacity: buttonsOpacity,
              transform: [{ translateY: buttonsTranslateY }],
            },
          ]}
        >
          <View style={styles.menuCard}>
            <Button
              title="Play"
              size="large"
              fullWidth
              onPress={() => navigation.navigate('LanguageSelect')}
              icon={<Text style={styles.buttonIcon}>🎮</Text>}
            />

            <View style={styles.buttonSpacer} />

            <Button
              title="Settings"
              variant="secondary"
              size="large"
              fullWidth
              onPress={() => navigation.navigate('Settings')}
              icon={<Text style={styles.buttonIcon}>⚙️</Text>}
            />

            <View style={styles.buttonSpacer} />

            <Button
              title="How to Play"
              variant="outline"
              size="medium"
              fullWidth
              onPress={() => navigation.navigate('HowToPlay')}
              icon={<Text style={styles.buttonIcon}>📖</Text>}
            />
          </View>
        </Animated.View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Made with 💙 for language learners</Text>
        </View>
      </SafeAreaView>
    </CloudBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  rainContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  raindrop: {
    position: 'absolute',
    width: 4,
    height: 20,
    backgroundColor: colors.rain.droplet,
    borderRadius: 2,
  },
  logoSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: spacing.xxl,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoCloud: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.background.card,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.large,
    marginBottom: spacing.md,
  },
  logoEmoji: {
    fontSize: 64,
  },
  logoText: {
    fontSize: typography.sizes.display,
    fontWeight: typography.weights.heavy,
    color: colors.text.primary,
    letterSpacing: -2,
  },
  tagline: {
    fontSize: typography.sizes.lg,
    color: colors.text.secondary,
    marginTop: spacing.xs,
    fontWeight: typography.weights.medium,
  },
  menuSection: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  menuCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    ...shadows.large,
  },
  buttonSpacer: {
    height: spacing.md,
  },
  buttonIcon: {
    fontSize: 20,
  },
  footer: {
    paddingBottom: spacing.lg,
    alignItems: 'center',
  },
  footerText: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
  },
});
