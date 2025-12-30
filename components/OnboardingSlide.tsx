import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

import { Colors, Spacing, Typography } from '@/constants/Theme';

const { width } = Dimensions.get('window');

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
  // Create a subtle glow color from the icon color
  const glowColor = `${iconColor}30`;
  const subtleColor = `${iconColor}15`;

  return (
    <View style={styles.slide}>
      {/* Background glow */}
      <View style={[styles.glowOuter, { backgroundColor: subtleColor }]} />
      <View style={[styles.glowInner, { backgroundColor: glowColor }]} />

      <View style={[styles.iconContainer, { borderColor: iconColor }]}>
        <FontAwesome name={icon} size={56} color={iconColor} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  slide: {
    width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxl,
    position: 'relative',
  },
  glowOuter: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    top: '20%',
  },
  glowInner: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    top: '25%',
  },
  iconContainer: {
    width: 130,
    height: 130,
    borderRadius: 65,
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
    maxWidth: 300,
  },
});
