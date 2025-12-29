import React, { useRef, useEffect } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { colors, typography, spacing, shadows, borderRadius } from '../theme';
import { useSettings } from '../context/SettingsContext';
import { useGameFeedback } from '../hooks/useGameFeedback';

interface GameInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  feedback: { type: 'correct' | 'wrong' | 'missed' | null; word?: string };
  disabled?: boolean;
}

export const GameInput: React.FC<GameInputProps> = ({
  value,
  onChangeText,
  onSubmit,
  feedback,
  disabled = false,
}) => {
  const inputRef = useRef<TextInput>(null);
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const feedbackOpacity = useRef(new Animated.Value(0)).current;
  const lastFeedbackType = useRef<string | null>(null);

  const { settings } = useSettings();
  const { triggerFeedback } = useGameFeedback();

  useEffect(() => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  }, [disabled]);

  useEffect(() => {
    // Only trigger feedback if the type changed (avoid double triggers)
    if (feedback.type && feedback.type !== lastFeedbackType.current) {
      lastFeedbackType.current = feedback.type;

      // Trigger sound and haptics
      triggerFeedback(feedback.type);

      if (feedback.type === 'wrong') {
        // Shake animation for wrong answer
        Animated.sequence([
          Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
        ]).start();
      }

      feedbackOpacity.setValue(1);
      Animated.timing(feedbackOpacity, {
        toValue: 0,
        duration: feedback.type === 'missed' ? 2500 : 1500,
        delay: feedback.type === 'missed' ? 1000 : 500,
        useNativeDriver: true,
      }).start();
    } else if (!feedback.type) {
      lastFeedbackType.current = null;
    }
  }, [feedback.type, shakeAnim, feedbackOpacity, triggerFeedback]);

  const getInputStyle = () => {
    switch (feedback.type) {
      case 'correct':
        return { borderColor: colors.success, backgroundColor: 'rgba(129, 199, 132, 0.1)' };
      case 'wrong':
        return { borderColor: colors.error, backgroundColor: 'rgba(229, 115, 115, 0.1)' };
      case 'missed':
        return { borderColor: colors.warning, backgroundColor: 'rgba(255, 183, 77, 0.1)' };
      default:
        return { borderColor: colors.rain.droplet, backgroundColor: colors.background.card };
    }
  };

  const getFeedbackConfig = () => {
    switch (feedback.type) {
      case 'correct':
        return {
          icon: '✓',
          text: 'Correct!',
          color: colors.success,
          bgColor: 'rgba(129, 199, 132, 0.15)',
        };
      case 'wrong':
        return {
          icon: '✗',
          text: 'Try again!',
          color: colors.error,
          bgColor: 'rgba(229, 115, 115, 0.15)',
        };
      case 'missed':
        // Show the translation as a hint if hints are enabled
        const hintText = settings.showHints && feedback.word
          ? `Answer: ${feedback.word}`
          : 'Missed!';
        return {
          icon: '💧',
          text: hintText,
          color: colors.warning,
          bgColor: 'rgba(255, 183, 77, 0.15)',
        };
      default:
        return null;
    }
  };

  const feedbackConfig = getFeedbackConfig();
  const inputStyle = getInputStyle();

  return (
    <View style={styles.container}>
      {/* Feedback Badge */}
      {feedbackConfig && (
        <Animated.View
          style={[
            styles.feedbackBadge,
            {
              backgroundColor: feedbackConfig.bgColor,
              opacity: feedbackOpacity,
            },
          ]}
        >
          <Text style={[styles.feedbackIcon, { color: feedbackConfig.color }]}>
            {feedbackConfig.icon}
          </Text>
          <Text style={[styles.feedbackText, { color: feedbackConfig.color }]}>
            {feedbackConfig.text}
          </Text>
        </Animated.View>
      )}

      {/* Input Row */}
      <Animated.View
        style={[
          styles.inputRow,
          { transform: [{ translateX: shakeAnim }] },
        ]}
      >
        <View style={[styles.inputWrapper, inputStyle]}>
          <TextInput
            ref={inputRef}
            style={styles.input}
            value={value}
            onChangeText={onChangeText}
            onSubmitEditing={onSubmit}
            placeholder="Type the translation..."
            placeholderTextColor={colors.text.muted}
            autoCapitalize="none"
            autoCorrect={false}
            editable={!disabled}
            returnKeyType="done"
            autoFocus={true}
            blurOnSubmit={false}
          />
        </View>

        <TouchableOpacity
          style={[
            styles.submitButton,
            disabled && styles.submitButtonDisabled,
          ]}
          onPress={() => {
            onSubmit();
            // Refocus input after button press
            inputRef.current?.focus();
          }}
          disabled={disabled}
          activeOpacity={0.8}
        >
          <Text style={styles.submitButtonText}>→</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    backgroundColor: colors.background.cardTranslucent,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
  },
  feedbackBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
  },
  feedbackIcon: {
    fontSize: 18,
    fontWeight: typography.weights.bold,
    marginRight: spacing.xs,
  },
  feedbackText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputWrapper: {
    flex: 1,
    height: 56,
    borderRadius: borderRadius.full,
    borderWidth: 2,
    justifyContent: 'center',
    ...shadows.small,
  },
  input: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    fontSize: typography.sizes.lg,
    color: colors.text.primary,
    fontWeight: typography.weights.medium,
  },
  submitButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.rain.droplet,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
    ...shadows.medium,
  },
  submitButtonDisabled: {
    backgroundColor: colors.text.muted,
  },
  submitButtonText: {
    color: colors.text.light,
    fontSize: 28,
    fontWeight: typography.weights.bold,
  },
});
