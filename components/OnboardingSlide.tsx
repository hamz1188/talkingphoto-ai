import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

import { useResponsive } from '@/hooks/useResponsive';
import { Colors, Spacing, Typography } from '@/constants/Theme';

interface OnboardingSlideProps {
  icon: keyof typeof FontAwesome.glyphMap;
  title: string;
  description: string;
  iconColor?: string;
}

export default function OnboardingSlide({
  icon,
  title,
  description,
  iconColor = Colors.primary.default,
}: OnboardingSlideProps) {
  const { screenWidth, glowSizeLarge, glowSizeMedium, contentWidth, scale } = useResponsive();

  // Create a subtle glow color from the icon color
  const glowColor = `${iconColor}30`;
  const subtleColor = `${iconColor}15`;

  // Dynamic sizes
  const iconContainerSize = scale(130);
  const iconSize = scale(56);

  return (
    <View style={[styles.slide, { width: screenWidth }]}>
      {/* Background glow */}
      <View style={[styles.glowOuter, {
        backgroundColor: subtleColor,
        width: glowSizeLarge,
        height: glowSizeLarge,
        borderRadius: glowSizeLarge / 2,
      }]} />
      <View style={[styles.glowInner, {
        backgroundColor: glowColor,
        width: glowSizeMedium,
        height: glowSizeMedium,
        borderRadius: glowSizeMedium / 2,
      }]} />

      <View style={[styles.iconContainer, {
        borderColor: iconColor,
        width: iconContainerSize,
        height: iconContainerSize,
        borderRadius: iconContainerSize / 2,
      }]}>
        <FontAwesome name={icon} size={iconSize} color={iconColor} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={[styles.description, { maxWidth: contentWidth }]}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxl,
    position: 'relative',
  },
  glowOuter: {
    position: 'absolute',
    top: '20%',
  },
  glowInner: {
    position: 'absolute',
    top: '25%',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
    backgroundColor: Colors.surface.default,
    borderWidth: 2,
  },
  title: {
    fontSize: Typography.size.xxl,
    fontWeight: Typography.weight.bold,
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  description: {
    fontSize: Typography.size.md,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});
