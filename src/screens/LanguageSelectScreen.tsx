import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CloudBackground } from '../components/CloudBackground';
import { colors, typography, spacing, shadows, borderRadius } from '../theme';
import { RootStackParamList } from '../navigation/types';
import { LanguageKey } from '../data/vocabulary';

type LanguageSelectScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'LanguageSelect'>;
};

interface LanguageOption {
  key: LanguageKey;
  name: string;
  nativeName: string;
  flag: string;
  color: string;
  description: string;
}

const languages: LanguageOption[] = [
  {
    key: 'spanish',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    color: '#F44336',
    description: '310 A1 words',
  },
  {
    key: 'french',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    color: '#2196F3',
    description: '310 A1 words',
  },
  {
    key: 'german',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    color: '#FFC107',
    description: '310 A1 words with articles',
  },
];

const LanguageCard: React.FC<{
  language: LanguageOption;
  index: number;
  onPress: () => void;
}> = ({ language, index, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        delay: index * 150,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 400,
        delay: index * 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scaleAnim, translateY, index]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      tension: 100,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 100,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={[
        styles.cardContainer,
        {
          transform: [{ scale: scaleAnim }, { translateY }],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.card}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <View style={[styles.cardAccent, { backgroundColor: language.color }]} />
        <View style={styles.cardContent}>
          <Text style={styles.flag}>{language.flag}</Text>
          <View style={styles.textContainer}>
            <Text style={styles.languageName}>{language.name}</Text>
            <Text style={styles.nativeName}>{language.nativeName}</Text>
            <Text style={styles.description}>{language.description}</Text>
          </View>
          <View style={styles.arrowContainer}>
            <Text style={styles.arrow}>→</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export const LanguageSelectScreen: React.FC<LanguageSelectScreenProps> = ({
  navigation,
}) => {
  const titleOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(titleOpacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [titleOpacity]);

  const handleSelectLanguage = (language: LanguageKey) => {
    navigation.navigate('Game', { language });
  };

  return (
    <CloudBackground variant="day">
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <Animated.View style={[styles.header, { opacity: titleOpacity }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Choose Language</Text>
            <Text style={styles.subtitle}>What do you want to learn?</Text>
          </View>
        </Animated.View>

        {/* Language Cards */}
        <View style={styles.cardsContainer}>
          {languages.map((language, index) => (
            <LanguageCard
              key={language.key}
              language={language}
              index={index}
              onPress={() => handleSelectLanguage(language.key)}
            />
          ))}
        </View>

        {/* Bottom tip */}
        <View style={styles.tipContainer}>
          <View style={styles.tipCard}>
            <Text style={styles.tipEmoji}>💡</Text>
            <Text style={styles.tipText}>
              All vocabularies follow CEFR A1 level - perfect for beginners!
            </Text>
          </View>
        </View>
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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
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
  titleContainer: {
    marginLeft: spacing.md,
  },
  title: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
  },
  subtitle: {
    fontSize: typography.sizes.md,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  cardsContainer: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
  },
  cardContainer: {
    marginBottom: spacing.md,
  },
  card: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.medium,
  },
  cardAccent: {
    height: 4,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
  },
  flag: {
    fontSize: 48,
    marginRight: spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  languageName: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
  },
  nativeName: {
    fontSize: typography.sizes.md,
    color: colors.text.secondary,
    marginTop: 2,
  },
  description: {
    fontSize: typography.sizes.sm,
    color: colors.rain.droplet,
    marginTop: spacing.xs,
    fontWeight: typography.weights.medium,
  },
  arrowContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary.skyLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrow: {
    fontSize: 20,
    color: colors.rain.droplet,
    fontWeight: typography.weights.bold,
  },
  tipContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.cardTranslucent,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  tipEmoji: {
    fontSize: 24,
    marginRight: spacing.sm,
  },
  tipText: {
    flex: 1,
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    lineHeight: 20,
  },
});
