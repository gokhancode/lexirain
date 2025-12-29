import React, { useRef, useEffect } from 'react';
import { StyleSheet, TextInput, View, Text, TouchableOpacity } from 'react-native';

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

  useEffect(() => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  }, [disabled]);

  const getBorderColor = () => {
    switch (feedback.type) {
      case 'correct':
        return '#4CAF50';
      case 'wrong':
        return '#F44336';
      case 'missed':
        return '#FF9800';
      default:
        return '#4A90D9';
    }
  };

  const getFeedbackMessage = () => {
    switch (feedback.type) {
      case 'correct':
        return '✓ Correct!';
      case 'wrong':
        return '✗ Try again!';
      case 'missed':
        return `Missed: ${feedback.word}`;
      default:
        return 'Type the translation...';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <TextInput
          ref={inputRef}
          style={[styles.input, { borderColor: getBorderColor() }]}
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmit}
          placeholder="Type translation here..."
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!disabled}
          returnKeyType="done"
        />
        <TouchableOpacity
          style={[styles.submitButton, disabled && styles.submitButtonDisabled]}
          onPress={onSubmit}
          disabled={disabled}
        >
          <Text style={styles.submitButtonText}>→</Text>
        </TouchableOpacity>
      </View>
      <Text style={[styles.feedback, { color: getBorderColor() }]}>
        {getFeedbackMessage()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  input: {
    flex: 1,
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 18,
    color: '#fff',
    borderWidth: 2,
  },
  submitButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4A90D9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#666',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
  },
  feedback: {
    textAlign: 'center',
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
  },
});
