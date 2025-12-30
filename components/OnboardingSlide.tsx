import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

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
  iconColor = '#8B5CF6',
}: OnboardingSlideProps) {
  return (
    <View style={styles.slide}>
      <View style={[styles.iconContainer, { backgroundColor: `${iconColor}20` }]}>
        <FontAwesome name={icon} size={64} color={iconColor} />
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
    paddingHorizontal: 40,
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
});
