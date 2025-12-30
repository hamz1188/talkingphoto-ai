import {
  View,
  Text,
  FlatList,
  Pressable,
  Alert,
  StyleSheet,
} from 'react-native';
import { useEffect, useState } from 'react';
import { Image } from 'expo-image';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

import { useGalleryStore } from '@/stores/galleryStore';
import { useResponsive } from '@/hooks/useResponsive';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '@/constants/Theme';
import type { GalleryVideo } from '@/types';

export default function GalleryScreen() {
  const { videos, loadGallery, removeVideo } = useGalleryStore();
  const { cardWidth, cardGap, scale } = useResponsive();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadGallery().finally(() => setIsLoading(false));
  }, []);

  const handleVideoPress = (video: GalleryVideo) => {
    router.push({
      pathname: '/video-player',
      params: { videoUrl: video.videoUrl, script: video.script },
    });
  };

  const handleDeleteVideo = (video: GalleryVideo) => {
    Alert.alert(
      'Delete Video',
      'Are you sure you want to remove this video from your gallery?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => removeVideo(video.id),
        },
      ]
    );
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const renderVideoCard = ({ item }: { item: GalleryVideo }) => (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        { width: cardWidth },
        pressed && styles.cardPressed,
      ]}
      onPress={() => handleVideoPress(item)}
      onLongPress={() => handleDeleteVideo(item)}
    >
      <View style={styles.thumbnailContainer}>
        {item.thumbnailUri ? (
          <Image
            source={{ uri: item.thumbnailUri }}
            style={styles.thumbnail}
            contentFit="cover"
          />
        ) : (
          <View style={styles.placeholderThumbnail}>
            <FontAwesome name="play-circle" size={40} color={Colors.text.muted} />
          </View>
        )}
        <LinearGradient
          colors={['transparent', 'rgba(0, 0, 0, 0.7)']}
          style={styles.thumbnailGradient}
        />
        <View style={styles.playOverlay}>
          <View style={styles.playButton}>
            <FontAwesome name="play" size={16} color={Colors.text.primary} />
          </View>
        </View>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.scriptPreview} numberOfLines={2}>
          {item.script || 'No script'}
        </Text>
        <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>
      </View>
    </Pressable>
  );

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Loading gallery...</Text>
      </View>
    );
  }

  if (videos.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <View style={styles.emptyIconContainer}>
          <FontAwesome name="film" size={48} color={Colors.primary.default} />
        </View>
        <Text style={styles.emptyTitle}>No Videos Yet</Text>
        <Text style={styles.emptySubtitle}>
          Create your first talking photo and it will appear here!
        </Text>
        <Pressable
          style={({ pressed }) => [
            styles.createButton,
            pressed && styles.createButtonPressed,
          ]}
          onPress={() => router.push('/')}
        >
          <LinearGradient
            colors={[Colors.primary.default, Colors.primary.dark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.createButtonGradient}
          >
            <FontAwesome name="plus" size={16} color={Colors.text.primary} />
            <Text style={styles.createButtonText}>Create Video</Text>
          </LinearGradient>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={videos}
        renderItem={renderVideoCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={[styles.row, { gap: cardGap }]}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
      <Text style={styles.hintText}>Long press to delete</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: Colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  loadingText: {
    color: Colors.text.muted,
    fontSize: Typography.size.md,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary.subtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.semibold,
    color: Colors.text.primary,
  },
  emptySubtitle: {
    color: Colors.text.secondary,
    textAlign: 'center',
    marginTop: Spacing.sm,
    maxWidth: 280,
    lineHeight: 22,
  },
  createButton: {
    marginTop: Spacing.xl,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadows.md,
  },
  createButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  createButtonPressed: {
    transform: [{ scale: 0.95 }],
  },
  createButtonText: {
    color: Colors.text.primary,
    fontWeight: Typography.weight.semibold,
    marginLeft: Spacing.sm,
    fontSize: Typography.size.md,
  },
  listContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxxl,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  card: {
    backgroundColor: Colors.surface.default,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  cardPressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.9,
  },
  thumbnailContainer: {
    width: '100%',
    aspectRatio: 1,
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  thumbnailGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
  },
  placeholderThumbnail: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.surface.elevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary.default,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.md,
  },
  cardContent: {
    padding: Spacing.sm + 2,
  },
  scriptPreview: {
    fontSize: Typography.size.sm,
    color: Colors.text.secondary,
    lineHeight: 18,
  },
  dateText: {
    fontSize: Typography.size.xs,
    color: Colors.text.muted,
    marginTop: Spacing.xs,
  },
  hintText: {
    position: 'absolute',
    bottom: Spacing.md,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: Colors.text.muted,
    fontSize: Typography.size.xs,
  },
});
