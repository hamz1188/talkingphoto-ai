import { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Dimensions,
  ViewToken,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import OnboardingSlide from '@/components/OnboardingSlide';
import { storage, StorageKeys } from '@/lib/storage';
import { analytics, AnalyticsEvents } from '@/lib/analytics';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '@/constants/Theme';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    icon: 'camera' as const,
    title: 'Make Any Photo Talk',
    description:
      'Upload any photo and watch it come to life with realistic lip-sync animation.',
    iconColor: Colors.primary.default,
  },
  {
    id: '2',
    icon: 'magic' as const,
    title: 'AI Writes the Script',
    description:
      'Our AI analyzes your photo and creates a funny, personalized script in seconds.',
    iconColor: Colors.accent.default,
  },
  {
    id: '3',
    icon: 'microphone' as const,
    title: 'Choose Your Voice',
    description:
      'Pick from multiple realistic voices to bring your talking photo to life.',
    iconColor: Colors.success.default,
  },
  {
    id: '4',
    icon: 'share-alt' as const,
    title: 'Share with Friends',
    description:
      'Download and share your creation on TikTok, Instagram, or anywhere you like!',
    iconColor: Colors.premium.default,
  },
];

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setCurrentIndex(viewableItems[0].index);
        analytics.track(AnalyticsEvents.ONBOARDING_SLIDE_VIEWED, {
          slideIndex: viewableItems[0].index,
          slideTitle: slides[viewableItems[0].index]?.title,
        });
      }
    }
  ).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      completeOnboarding();
    }
  };

  const handleSkip = async () => {
    analytics.track(AnalyticsEvents.ONBOARDING_SKIPPED, {
      skippedAtSlide: currentIndex,
    });
    await completeOnboarding();
  };

  const completeOnboarding = async () => {
    await storage.set(StorageKeys.ONBOARDING_COMPLETED, true);
    analytics.track(AnalyticsEvents.ONBOARDING_COMPLETED);
    router.replace('/');
  };

  const isLastSlide = currentIndex === slides.length - 1;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Skip button */}
      <View style={styles.header}>
        {!isLastSlide && (
          <Pressable onPress={handleSkip} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>
        )}
      </View>

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={({ item }) => (
          <OnboardingSlide
            icon={item.icon}
            title={item.title}
            description={item.description}
            iconColor={item.iconColor}
          />
        )}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        bounces={false}
        style={styles.flatList}
      />

      {/* Pagination dots */}
      <View style={styles.pagination}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === currentIndex && styles.activeDot,
            ]}
          />
        ))}
      </View>

      {/* Bottom button */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
        <Pressable
          onPress={handleNext}
          style={({ pressed }) => [
            styles.nextButton,
            pressed && styles.nextButtonPressed,
          ]}
        >
          <LinearGradient
            colors={isLastSlide
              ? [Colors.accent.default, Colors.accent.dark]
              : [Colors.primary.default, Colors.primary.dark]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.nextButtonGradient}
          >
            <Text style={styles.nextButtonText}>
              {isLastSlide ? 'Get Started' : 'Next'}
            </Text>
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  flatList: {
    flex: 1,
  },
  header: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: Spacing.lg,
    zIndex: 10,
  },
  skipButton: {
    padding: Spacing.sm,
  },
  skipText: {
    fontSize: Typography.size.md,
    color: Colors.text.muted,
    fontWeight: Typography.weight.medium,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: Spacing.lg,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.surface.elevated,
    marginHorizontal: Spacing.xs,
  },
  activeDot: {
    backgroundColor: Colors.primary.default,
    width: 24,
  },
  footer: {
    paddingHorizontal: Spacing.lg,
    zIndex: 10,
  },
  nextButton: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadows.glow,
  },
  nextButtonGradient: {
    paddingVertical: Spacing.md + 2,
    alignItems: 'center',
  },
  nextButtonPressed: {
    transform: [{ scale: 0.98 }],
  },
  nextButtonText: {
    color: Colors.text.primary,
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.semibold,
  },
});
