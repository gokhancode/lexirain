/**
 * LexiRain Theme System
 * A cute, modern cloud & rain aesthetic with soft pastels
 */

export const colors = {
  // Primary palette - Sky & Clouds
  primary: {
    sky: '#87CEEB',        // Light sky blue
    skyLight: '#B5E3F5',   // Lighter sky
    skyDark: '#5BA3C6',    // Deeper sky
    cloud: '#FFFFFF',      // Pure white clouds
    cloudSoft: '#F0F8FF',  // Soft cloud tint
  },

  // Accent colors - Pastels
  accent: {
    pink: '#FFB6C1',       // Light pink
    lavender: '#E6E6FA',   // Soft lavender
    mint: '#98FB98',       // Pale mint
    peach: '#FFDAB9',      // Peach puff
    coral: '#F08080',      // Light coral
    yellow: '#FFF59D',     // Soft yellow
  },

  // Raindrop colors
  rain: {
    droplet: '#4FC3F7',    // Bright water blue
    dropletLight: '#81D4FA',
    dropletDark: '#29B6F6',
    splash: '#B3E5FC',
  },

  // UI States
  success: '#81C784',      // Soft green
  error: '#E57373',        // Soft red
  warning: '#FFB74D',      // Soft orange

  // Text
  text: {
    primary: '#2C3E50',    // Dark blue-gray
    secondary: '#7F8C8D',  // Medium gray
    light: '#FFFFFF',
    muted: '#BDC3C7',
  },

  // Backgrounds
  background: {
    gradient: {
      sky: ['#87CEEB', '#B5E3F5', '#E0F4FF'],
      sunset: ['#FFB6C1', '#FFDAB9', '#87CEEB'],
      night: ['#2C3E50', '#34495E', '#5D6D7E'],
    },
    card: 'rgba(255, 255, 255, 0.95)',
    cardTranslucent: 'rgba(255, 255, 255, 0.85)',
    overlay: 'rgba(44, 62, 80, 0.6)',
  },
};

export const typography = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
    xxxl: 48,
    display: 64,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    heavy: '800' as const,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  full: 9999,
};

export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  glow: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  }),
};

export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
};

export type Theme = typeof theme;
