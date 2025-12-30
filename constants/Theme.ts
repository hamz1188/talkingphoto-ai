/**
 * TalkingPhoto AI - Dark Theme System
 *
 * A premium, magical dark theme designed for an AI app that brings photos to life.
 * Uses deep purples, electric accents, and glass-morphism effects.
 */

// Core color palette
export const Colors = {
  // Backgrounds
  background: {
    primary: '#0f0f1a',
    secondary: '#1a1a2e',
    tertiary: '#16213e',
  },

  // Surfaces (glass-morphism)
  surface: {
    default: 'rgba(255, 255, 255, 0.05)',
    elevated: 'rgba(255, 255, 255, 0.08)',
    hover: 'rgba(255, 255, 255, 0.12)',
    pressed: 'rgba(255, 255, 255, 0.15)',
  },

  // Primary - Electric Purple
  primary: {
    default: '#a855f7',
    light: '#c084fc',
    dark: '#9333ea',
    glow: 'rgba(168, 85, 247, 0.3)',
    subtle: 'rgba(168, 85, 247, 0.1)',
  },

  // Accent - Cyan
  accent: {
    default: '#00d4ff',
    light: '#67e8f9',
    dark: '#0891b2',
    glow: 'rgba(0, 212, 255, 0.3)',
    subtle: 'rgba(0, 212, 255, 0.1)',
  },

  // Premium - Gold
  premium: {
    default: '#fbbf24',
    light: '#fcd34d',
    dark: '#f59e0b',
    glow: 'rgba(251, 191, 36, 0.3)',
    subtle: 'rgba(251, 191, 36, 0.1)',
  },

  // Semantic
  success: {
    default: '#22c55e',
    light: '#4ade80',
    dark: '#16a34a',
    subtle: 'rgba(34, 197, 94, 0.1)',
  },

  warning: {
    default: '#fbbf24',
    light: '#fcd34d',
    dark: '#f59e0b',
    subtle: 'rgba(251, 191, 36, 0.1)',
  },

  error: {
    default: '#ef4444',
    light: '#f87171',
    dark: '#dc2626',
    subtle: 'rgba(239, 68, 68, 0.1)',
  },

  // Text
  text: {
    primary: '#ffffff',
    secondary: '#9ca3af',
    muted: '#6b7280',
    inverse: '#0f0f1a',
  },

  // Borders
  border: {
    default: 'rgba(255, 255, 255, 0.1)',
    light: 'rgba(255, 255, 255, 0.05)',
    focus: 'rgba(168, 85, 247, 0.5)',
  },

  // Overlays
  overlay: {
    light: 'rgba(0, 0, 0, 0.3)',
    medium: 'rgba(0, 0, 0, 0.5)',
    heavy: 'rgba(0, 0, 0, 0.7)',
  },
} as const;

// Gradients
export const Gradients = {
  // Main background gradient
  background: ['#0f0f1a', '#1a1a2e'],
  backgroundDiagonal: ['#0f0f1a', '#1a1a2e', '#16213e'],

  // Button gradients
  primaryButton: ['#a855f7', '#9333ea'],
  accentButton: ['#00d4ff', '#0891b2'],
  premiumButton: ['#fbbf24', '#f59e0b'],

  // Card gradients
  cardShimmer: ['rgba(255,255,255,0)', 'rgba(255,255,255,0.05)', 'rgba(255,255,255,0)'],

  // Glow effects
  purpleGlow: ['rgba(168, 85, 247, 0.4)', 'rgba(168, 85, 247, 0)'],
  cyanGlow: ['rgba(0, 212, 255, 0.4)', 'rgba(0, 212, 255, 0)'],
} as const;

// Spacing (8px grid)
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

// Border Radius
export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
} as const;

// Typography
export const Typography = {
  // Font sizes
  size: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    display: 40,
  },

  // Font weights
  weight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },

  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

// Shadows (using glows for dark theme)
export const Shadows = {
  sm: {
    shadowColor: Colors.primary.default,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: Colors.primary.default,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: Colors.primary.default,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  glow: {
    shadowColor: Colors.primary.default,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  cyanGlow: {
    shadowColor: Colors.accent.default,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
} as const;

// Animation durations
export const Animation = {
  fast: 150,
  normal: 300,
  slow: 500,
  verySlow: 800,
} as const;

// Common styles
export const CommonStyles = {
  // Screen container with gradient background
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },

  // Glass card
  glassCard: {
    backgroundColor: Colors.surface.default,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border.default,
  },

  // Primary button
  primaryButton: {
    backgroundColor: Colors.primary.default,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },

  // Secondary button (outlined)
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.primary.default,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },

  // Input field
  input: {
    backgroundColor: Colors.surface.default,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border.default,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    color: Colors.text.primary,
    fontSize: Typography.size.md,
  },

  // Text styles
  textHeading: {
    fontSize: Typography.size.xxl,
    fontWeight: Typography.weight.bold,
    color: Colors.text.primary,
  },

  textSubheading: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.semibold,
    color: Colors.text.primary,
  },

  textBody: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.regular,
    color: Colors.text.secondary,
  },

  textCaption: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.regular,
    color: Colors.text.muted,
  },
} as const;

// Tab bar theme
export const TabBarTheme = {
  backgroundColor: Colors.background.primary,
  borderTopColor: Colors.border.default,
  activeTintColor: Colors.primary.default,
  inactiveTintColor: Colors.text.muted,
} as const;

// Navigation header theme
export const HeaderTheme = {
  backgroundColor: Colors.background.primary,
  tintColor: Colors.text.primary,
  titleColor: Colors.text.primary,
  borderBottomColor: Colors.border.default,
} as const;

// Export everything as a single theme object for convenience
const Theme = {
  Colors,
  Gradients,
  Spacing,
  BorderRadius,
  Typography,
  Shadows,
  Animation,
  CommonStyles,
  TabBarTheme,
  HeaderTheme,
};

export default Theme;
