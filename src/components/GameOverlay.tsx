import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal } from 'react-native';
import { GameState } from '../types';
import { LanguageKey } from '../data/vocabulary';

interface StartScreenProps {
  visible: boolean;
  selectedLanguage: LanguageKey;
  onSelectLanguage: (lang: LanguageKey) => void;
  onStart: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  visible,
  selectedLanguage,
  onSelectLanguage,
  onStart,
}) => {
  const languages: { key: LanguageKey; label: string; flag: string }[] = [
    { key: 'spanish', label: 'Spanish', flag: '🇪🇸' },
    { key: 'french', label: 'French', flag: '🇫🇷' },
    { key: 'german', label: 'German', flag: '🇩🇪' },
  ];

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>🌧️ LexiRain</Text>
          <Text style={styles.subtitle}>Vocabulary Rainfall</Text>

          <Text style={styles.description}>
            Words fall from the sky! Type their translation before they hit the ground.
          </Text>

          <Text style={styles.sectionTitle}>Choose Language:</Text>
          <View style={styles.languageContainer}>
            {languages.map((lang) => (
              <TouchableOpacity
                key={lang.key}
                style={[
                  styles.languageButton,
                  selectedLanguage === lang.key && styles.languageButtonSelected,
                ]}
                onPress={() => onSelectLanguage(lang.key)}
              >
                <Text style={styles.languageFlag}>{lang.flag}</Text>
                <Text
                  style={[
                    styles.languageLabel,
                    selectedLanguage === lang.key && styles.languageLabelSelected,
                  ]}
                >
                  {lang.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.startButton} onPress={onStart}>
            <Text style={styles.startButtonText}>Start Game</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

interface PauseScreenProps {
  visible: boolean;
  onResume: () => void;
  onRestart: () => void;
}

export const PauseScreen: React.FC<PauseScreenProps> = ({
  visible,
  onResume,
  onRestart,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>⏸️ Paused</Text>

          <TouchableOpacity style={styles.resumeButton} onPress={onResume}>
            <Text style={styles.buttonText}>Resume</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.restartButton} onPress={onRestart}>
            <Text style={styles.buttonText}>Restart</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

interface GameOverScreenProps {
  visible: boolean;
  gameState: GameState;
  onRestart: () => void;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({
  visible,
  gameState,
  onRestart,
}) => {
  const { score, level, wordsCompleted } = gameState;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.gameOverTitle}>Game Over</Text>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{score}</Text>
              <Text style={styles.statLabel}>Score</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{level}</Text>
              <Text style={styles.statLabel}>Level</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{wordsCompleted}</Text>
              <Text style={styles.statLabel}>Words</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.startButton} onPress={onRestart}>
            <Text style={styles.startButtonText}>Play Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    backgroundColor: '#1a1a2e',
    borderRadius: 20,
    padding: 30,
    width: '100%',
    maxWidth: 350,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4A90D9',
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#4A90D9',
    marginBottom: 20,
  },
  description: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 12,
  },
  languageContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 30,
  },
  languageButton: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#333',
    backgroundColor: '#0d0d1a',
    minWidth: 80,
  },
  languageButtonSelected: {
    borderColor: '#4A90D9',
    backgroundColor: 'rgba(74, 144, 217, 0.2)',
  },
  languageFlag: {
    fontSize: 28,
    marginBottom: 4,
  },
  languageLabel: {
    color: '#888',
    fontSize: 12,
    fontWeight: '500',
  },
  languageLabelSelected: {
    color: '#fff',
  },
  startButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 30,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  resumeButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 50,
    paddingVertical: 14,
    borderRadius: 30,
    marginBottom: 16,
    minWidth: 200,
  },
  restartButton: {
    backgroundColor: '#FF5722',
    paddingHorizontal: 50,
    paddingVertical: 14,
    borderRadius: 30,
    minWidth: 200,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  gameOverTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#F44336',
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 30,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFD700',
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
});
