import {
  View,
  Text,
  FlatList,
  Pressable,
  Alert,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useEffect, useState } from 'react';
import { Image } from 'expo-image';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';

import { useGalleryStore } from '@/stores/galleryStore';
import type { GalleryVideo } from '@/types';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48 - 12) / 2; // 2 columns with padding and gap

export default function GalleryScreen() {
  const { videos, loadGallery, removeVideo } = useGalleryStore();
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
      style={styles.card}
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
            <FontAwesome name="play-circle" size={40} color="#9CA3AF" />
          </View>
        )}
        <View style={styles.playOverlay}>
          <FontAwesome name="play" size={20} color="white" />
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
        <FontAwesome name="film" size={64} color="#D1D5DB" />
        <Text style={styles.emptyTitle}>No Videos Yet</Text>
        <Text style={styles.emptySubtitle}>
          Create your first talking photo and it will appear here!
        </Text>
        <Pressable style={styles.createButton} onPress={() => router.push('/')}>
          <FontAwesome name="plus" size={16} color="white" />
          <Text style={styles.createButtonText}>Create Video</Text>
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
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  centerContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loadingText: {
    color: '#6B7280',
    fontSize: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
  },
  emptySubtitle: {
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
    maxWidth: 280,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 24,
  },
  createButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 8,
  },
  listContent: {
    padding: 16,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
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
  placeholderThumbnail: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    padding: 10,
  },
  scriptPreview: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 18,
  },
  dateText: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 6,
  },
});
