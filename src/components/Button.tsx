import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { colors, typography, borderRadius, shadows, spacing } from '../theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  icon?: React.ReactNode;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  icon,
  disabled = false,
  fullWidth = false,
  style,
  textStyle,
}) => {
  const getBackgroundColor = () => {
    if (disabled) return colors.text.muted;
    switch (variant) {
      case 'primary':
        return colors.rain.droplet;
      case 'secondary':
        return colors.accent.pink;
      case 'outline':
      case 'ghost':
        return 'transparent';
      default:
        return colors.rain.droplet;
    }
  };

  const getTextColor = () => {
    if (disabled) return colors.text.light;
    switch (variant) {
      case 'primary':
      case 'secondary':
        return colors.text.light;
      case 'outline':
        return colors.rain.droplet;
      case 'ghost':
        return colors.text.primary;
      default:
        return colors.text.light;
    }
  };

  const getSizeStyles = (): { container: ViewStyle; text: TextStyle } => {
    switch (size) {
      case 'small':
        return {
          container: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md },
          text: { fontSize: typography.sizes.sm },
        };
      case 'large':
        return {
          container: { paddingVertical: spacing.lg, paddingHorizontal: spacing.xl },
          text: { fontSize: typography.sizes.lg },
        };
      default:
        return {
          container: { paddingVertical: spacing.md, paddingHorizontal: spacing.lg },
          text: { fontSize: typography.sizes.md },
        };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      style={[
        styles.container,
        sizeStyles.container,
        {
          backgroundColor: getBackgroundColor(),
          borderWidth: variant === 'outline' ? 2 : 0,
          borderColor: variant === 'outline' ? colors.rain.droplet : 'transparent',
        },
        fullWidth && styles.fullWidth,
        variant === 'primary' && !disabled && shadows.medium,
        style,
      ]}
    >
      <View style={styles.content}>
        {icon && <View style={styles.icon}>{icon}</View>}
        <Text
          style={[
            styles.text,
            sizeStyles.text,
            { color: getTextColor() },
            textStyle,
          ]}
        >
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: spacing.sm,
  },
  text: {
    fontWeight: typography.weights.bold,
    textAlign: 'center',
  },
});
