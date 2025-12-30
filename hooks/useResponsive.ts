import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Spacing } from '@/constants/Theme';

/**
 * Responsive breakpoints
 * - small: iPhone SE, iPhone 8 (375px)
 * - medium: iPhone 14, 15 (390-393px)
 * - large: iPhone 14 Plus, Pro Max (428-430px)
 * - xlarge: iPad (768px+)
 */
const BREAKPOINTS = {
  small: 375,
  medium: 390,
  large: 428,
  xlarge: 768,
} as const;

/**
 * Maximum content width to prevent content from being too wide on larger screens
 */
const MAX_CONTENT_WIDTH = 500;

/**
 * Horizontal padding for screen content
 */
const HORIZONTAL_PADDING = Spacing.lg;

interface ResponsiveValues {
  // Screen dimensions
  screenWidth: number;
  screenHeight: number;

  // Safe areas
  safeTop: number;
  safeBottom: number;
  safeLeft: number;
  safeRight: number;

  // Content dimensions (accounts for padding)
  contentWidth: number;
  contentPadding: number;

  // Common component sizes
  imageSize: number;        // For photo picker, video preview
  cardWidth: number;        // For gallery cards (2 columns)
  cardGap: number;          // Gap between cards
  buttonHeight: number;     // Standard button height
  iconContainerSize: number; // For icon circles

  // Glow/effect sizes
  glowSizeLarge: number;
  glowSizeMedium: number;
  glowSizeSmall: number;

  // Text scaling
  fontScale: number;

  // Breakpoint helpers
  isSmallScreen: boolean;
  isMediumScreen: boolean;
  isLargeScreen: boolean;
  isTablet: boolean;

  // Utility functions
  wp: (percentage: number) => number;  // Width percentage
  hp: (percentage: number) => number;  // Height percentage
  scale: (size: number) => number;     // Scale based on screen width
}

/**
 * Hook for responsive design values
 *
 * Usage:
 * ```tsx
 * const { contentWidth, imageSize, scale } = useResponsive();
 *
 * <View style={{ width: contentWidth }}>
 *   <Image style={{ width: imageSize, height: imageSize }} />
 * </View>
 * ```
 */
export function useResponsive(): ResponsiveValues {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  // Determine screen size category
  const isSmallScreen = screenWidth < BREAKPOINTS.medium;
  const isMediumScreen = screenWidth >= BREAKPOINTS.medium && screenWidth < BREAKPOINTS.large;
  const isLargeScreen = screenWidth >= BREAKPOINTS.large && screenWidth < BREAKPOINTS.xlarge;
  const isTablet = screenWidth >= BREAKPOINTS.xlarge;

  // Base scale factor (relative to iPhone 14 width of 390)
  const baseScale = screenWidth / 390;

  // Content width with padding, capped at max width
  const rawContentWidth = screenWidth - (HORIZONTAL_PADDING * 2);
  const contentWidth = Math.min(rawContentWidth, MAX_CONTENT_WIDTH);

  // Adjust padding if we're capping content width
  const contentPadding = Math.max(HORIZONTAL_PADDING, (screenWidth - contentWidth) / 2);

  // Image/video size (square, fills content width)
  const imageSize = contentWidth;

  // Gallery card calculations (2 columns with gap)
  const cardGap = Spacing.md;
  const cardWidth = (contentWidth - cardGap) / 2;

  // Button height scales slightly with screen size
  const buttonHeight = Math.round(48 * Math.min(baseScale, 1.2));

  // Icon container sizes
  const iconContainerSize = Math.round(72 * Math.min(baseScale, 1.1));

  // Glow effect sizes
  const glowSizeLarge = Math.round(contentWidth * 0.8);
  const glowSizeMedium = Math.round(contentWidth * 0.5);
  const glowSizeSmall = Math.round(100 * baseScale);

  // Font scale (subtle, between 0.9 and 1.1)
  const fontScale = Math.max(0.9, Math.min(1.1, baseScale));

  // Utility functions
  const wp = (percentage: number): number => {
    return Math.round((screenWidth * percentage) / 100);
  };

  const hp = (percentage: number): number => {
    return Math.round((screenHeight * percentage) / 100);
  };

  const scale = (size: number): number => {
    return Math.round(size * baseScale);
  };

  return {
    // Screen dimensions
    screenWidth,
    screenHeight,

    // Safe areas
    safeTop: insets.top,
    safeBottom: insets.bottom,
    safeLeft: insets.left,
    safeRight: insets.right,

    // Content dimensions
    contentWidth,
    contentPadding,

    // Component sizes
    imageSize,
    cardWidth,
    cardGap,
    buttonHeight,
    iconContainerSize,

    // Glow sizes
    glowSizeLarge,
    glowSizeMedium,
    glowSizeSmall,

    // Text scaling
    fontScale,

    // Breakpoint helpers
    isSmallScreen,
    isMediumScreen,
    isLargeScreen,
    isTablet,

    // Utility functions
    wp,
    hp,
    scale,
  };
}

/**
 * Get static responsive values (for use outside of components)
 * Note: These won't update on screen rotation. Prefer useResponsive hook.
 */
export function getResponsiveValues(screenWidth: number) {
  const baseScale = screenWidth / 390;
  const contentWidth = Math.min(screenWidth - (HORIZONTAL_PADDING * 2), MAX_CONTENT_WIDTH);

  return {
    contentWidth,
    imageSize: contentWidth,
    cardWidth: (contentWidth - Spacing.md) / 2,
    scale: (size: number) => Math.round(size * baseScale),
  };
}

export { BREAKPOINTS, MAX_CONTENT_WIDTH, HORIZONTAL_PADDING };
