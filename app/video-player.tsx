import {
  View,
  Text,
  Pressable,
  Platform,
  Linking,
  StyleSheet,
  Share,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import { FontAwesome } from '@expo/vector-icons';

import { analytics, AnalyticsEvents } from '@/lib/analytics';

export default function VideoPlayerScreen() {
  const { videoUrl, script } = useLocalSearchParams<{
    videoUrl: string;
    script: string;
  }>();

  const player = useVideoPlayer(videoUrl || '', (player) => {
    player.loop = true;
    if (videoUrl) {
      player.play();
    }
  });

  const handleDownload = async () => {
    if (!videoUrl) return;

    analytics.track(AnalyticsEvents.VIDEO_DOWNLOADED, {
      platform: Platform.OS,
      source: 'gallery',
    });

    if (Platform.OS === 'web') {
      const link = document.createElement('a');
      link.href = videoUrl;
      link.download = `talking_photo_${Date.now()}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      Linking.openURL(videoUrl);
    }
  };

  const handleShare = async () => {
    if (!videoUrl) return;

    analytics.track(AnalyticsEvents.VIDEO_SHARED, {
      platform: Platform.OS,
    });

    try {
      await Share.share({
        message: `Check out my talking photo! Made with TalkingPhoto AI\n\n${videoUrl}`,
        url: videoUrl,
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  if (!videoUrl) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Video not found</Text>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.closeButton} onPress={() => router.back()}>
          <FontAwesome name="chevron-left" size={20} color="#374151" />
        </Pressable>
        <Text style={styles.headerTitle}>Video</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.videoSection}>
        <View style={styles.videoWrapper}>
          <VideoView
            style={styles.video}
            player={player}
            allowsFullscreen
            allowsPictureInPicture
            nativeControls
          />
        </View>
      </View>

      {script && (
        <View style={styles.scriptSection}>
          <Text style={styles.scriptLabel}>Script</Text>
          <Text style={styles.scriptText}>{script}</Text>
        </View>
      )}

      <View style={styles.actionsSection}>
        <Pressable style={styles.actionButton} onPress={handleShare}>
          <FontAwesome name="share" size={18} color="#3B82F6" />
          <Text style={styles.actionButtonText}>Share</Text>
        </Pressable>

        <Pressable
          style={[styles.actionButton, styles.downloadButton]}
          onPress={handleDownload}
        >
          <FontAwesome name="download" size={18} color="white" />
          <Text style={styles.downloadButtonText}>Download</Text>
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
  centerContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: '#6B7280',
    fontSize: 16,
  },
  backButton: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  backButtonText: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  headerSpacer: {
    width: 36,
  },
  videoSection: {
    alignItems: 'center',
    padding: 24,
  },
  videoWrapper: {
    width: '100%',
    maxWidth: 400,
    aspectRatio: 1,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#000000',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  scriptSection: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  scriptLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  scriptText: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
  },
  actionsSection: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 12,
    marginTop: 'auto',
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  actionButtonText: {
    color: '#3B82F6',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 15,
  },
  downloadButton: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  downloadButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 15,
  },
});
