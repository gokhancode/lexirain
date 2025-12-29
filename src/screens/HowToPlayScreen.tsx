import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CloudBackground } from '../components/CloudBackground';
import { colors, typography, spacing, shadows, borderRadius } from '../theme';
import { RootStackParamList } from '../navigation/types';

type HowToPlayScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'HowToPlay'>;
};

interface InstructionCardProps {
  number: number;
  emoji: string;
  title: string;
  description: string;
  delay: number;
}

const InstructionCard: React.FC<InstructionCardProps> = ({
  number,
  emoji,
  title,
  description,
  delay,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim, delay]);

  return (
    <Animated.View
      style={[
        styles.instructionCard,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.numberBadge}>
        <Text style={styles.numberText}>{number}</Text>
      </View>
      <View style={styles.instructionContent}>
        <View style={styles.instructionHeader}>
          <Text style={styles.instructionEmoji}>{emoji}</Text>
          <Text style={styles.instructionTitle}>{title}</Text>
        </View>
        <Text style={styles.instructionDescription}>{description}</Text>
      </View>
    </Animated.View>
  );
};

export const HowToPlayScreen: React.FC<HowToPlayScreenProps> = ({ navigation }) => {
  const instructions = [
    {
      emoji: '🌧️',
      title: 'Words Fall Like Rain',
      description: 'English words appear at the top of the screen and slowly fall down like raindrops.',
    },
    {
      emoji: '⌨️',
      title: 'Type the Translation',
      description: 'Before a word reaches the bottom, type its translation in your chosen language.',
    },
    {
      emoji: '✅',
      title: 'Score Points',
      description: 'Correct answers earn you 10 points. Level up every 10 words for bonus points!',
    },
    {
      emoji: '❤️',
      title: 'Watch Your Lives',
      description: 'You have 3 lives. Miss a word and you lose one. Lose all lives and it\'s game over!',
    },
    {
      emoji: '📈',
      title: 'Progressive Difficulty',
      description: 'As you advance, words fall faster and appear more frequently. Stay sharp!',
    },
    {
      emoji: '🇩🇪',
      title: 'German Articles',
      description: 'For German nouns, include the article (der/die/das) or just type the word - both work!',
    },
  ];

  return (
    <CloudBackground variant="day">
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>How to Play</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Hero Section */}
          <View style={styles.heroCard}>
            <Text style={styles.heroEmoji}>🎮</Text>
            <Text style={styles.heroTitle}>Welcome to LexiRain!</Text>
            <Text style={styles.heroSubtitle}>
              Learn vocabulary naturally by catching falling words
            </Text>
          </View>

          {/* Instructions */}
          {instructions.map((instruction, index) => (
            <InstructionCard
              key={index}
              number={index + 1}
              emoji={instruction.emoji}
              title={instruction.title}
              description={instruction.description}
              delay={index * 100}
            />
          ))}

          {/* Tips Section */}
          <View style={styles.tipsCard}>
            <Text style={styles.tipsTitle}>💡 Pro Tips</Text>
            <View style={styles.tipItem}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={styles.tipText}>
                Focus on the lowest falling word first
              </Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={styles.tipText}>
                Don't worry about accents - "cafe" works for "café"
              </Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={styles.tipText}>
                Practice daily for best results!
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </CloudBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.background.card,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.small,
  },
  backButtonText: {
    fontSize: 24,
    color: colors.text.primary,
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
  },
  placeholder: {
    width: 44,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  heroCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
    ...shadows.medium,
  },
  heroEmoji: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  heroTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  heroSubtitle: {
    fontSize: typography.sizes.md,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  instructionCard: {
    flexDirection: 'row',
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.small,
  },
  numberBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.rain.droplet,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  numberText: {
    color: colors.text.light,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },
  instructionContent: {
    flex: 1,
  },
  instructionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  instructionEmoji: {
    fontSize: 20,
    marginRight: spacing.xs,
  },
  instructionTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
  },
  instructionDescription: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  tipsCard: {
    backgroundColor: colors.accent.yellow,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginTop: spacing.md,
  },
  tipsTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  tipBullet: {
    fontSize: typography.sizes.md,
    color: colors.text.primary,
    marginRight: spacing.sm,
    fontWeight: typography.weights.bold,
  },
  tipText: {
    flex: 1,
    fontSize: typography.sizes.sm,
    color: colors.text.primary,
    lineHeight: 20,
  },
});
