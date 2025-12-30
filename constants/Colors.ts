/**
 * Legacy Colors export for compatibility with existing components.
 * New code should import from Theme.ts directly.
 */

import { Colors as ThemeColors, TabBarTheme } from './Theme';

const tintColorLight = ThemeColors.primary.default;
const tintColorDark = ThemeColors.primary.default;

export default {
  light: {
    text: ThemeColors.text.primary,
    background: ThemeColors.background.primary,
    tint: tintColorLight,
    tabIconDefault: ThemeColors.text.muted,
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: ThemeColors.text.primary,
    background: ThemeColors.background.primary,
    tint: tintColorDark,
    tabIconDefault: ThemeColors.text.muted,
    tabIconSelected: tintColorDark,
  },
};
