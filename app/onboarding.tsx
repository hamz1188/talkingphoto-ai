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

import OnboardingSlide from '@/components/OnboardingSlide';
import { storage, StorageKeys } from '@/lib/storage';
import { analytics, AnalyticsEvents } from '@/lib/analytics';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    icon: 'camera' as const,
    title: 'Make Any Photo Talk',
    description:
      'Upload any photo and watch it come to life with realistic lip-sync animation.',
    iconColor: '#8B5CF6',
  },
  {
    id: '2',
    icon: 'magic' as const,
    title: 'AI Writes the Script',
    description:
      'Our AI analyzes your photo and creates a funny, personalized script in seconds.',
    iconColor: '#EC4899',
  },
  {
    id: '3',
    icon: 'microphone' as const,
    title: 'Choose Your Voice',
    description:
      'Pick from multiple realistic voices to bring your talking photo to life.',
    iconColor: '#10B981',
  },
  {
    id: '4',
    icon: 'share-alt' as const,
    title: 'Share with Friends',
    description:
      'Download and share your creation on TikTok, Instagram, or anywhere you like!',
    iconColor: '#F59E0B',
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
        <Pressable onPress={handleNext} style={styles.nextButton}>
          <Text style={styles.nextButtonText}>
            {isLastSlide ? 'Get Started' : 'Next'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  flatList: {
    flex: 1,
  },
  header: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  skipButton: {
    padding: 10,
    cursor: 'pointer' as any,
  },
  skipText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#8B5CF6',
    width: 24,
  },
  footer: {
    paddingHorizontal: 20,
    zIndex: 10,
  },
  nextButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    cursor: 'pointer' as any,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
