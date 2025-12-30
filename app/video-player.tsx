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
import { LinearGradient } from 'expo-linear-gradient';

import { useResponsive } from '@/hooks/useResponsive';
import { analytics, AnalyticsEvents } from '@/lib/analytics';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '@/constants/Theme';

export default function VideoPlayerScreen() {
  const { videoUrl, script } = useLocalSearchParams<{
    videoUrl: string;
    script: string;
  }>();
  const { contentWidth } = useResponsive();

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
        <FontAwesome name="exclamation-circle" size={48} color={Colors.text.muted} />
        <Text style={styles.errorText}>Video not found</Text>
        <Pressable
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.closeButton} onPress={() => router.back()}>
          <FontAwesome name="chevron-left" size={18} color={Colors.text.secondary} />
        </Pressable>
        <Text style={styles.headerTitle}>Video</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.videoSection}>
        <View style={[styles.videoContainer, { width: contentWidth }]}>
          <View style={styles.videoGlow} />
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
      </View>

      {script && (
        <View style={styles.scriptSection}>
          <Text style={styles.scriptLabel}>Script</Text>
          <View style={styles.scriptContainer}>
            <Text style={styles.scriptText}>{script}</Text>
          </View>
        </View>
      )}

      <View style={styles.actionsSection}>
        <Pressable
          style={({ pressed }) => [
            styles.shareButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleShare}
        >
          <LinearGradient
            colors={[Colors.accent.default, Colors.accent.dark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.shareButtonGradient}
          >
            <FontAwesome name="share-alt" size={16} color={Colors.text.primary} />
            <Text style={styles.shareButtonText}>Share</Text>
          </LinearGradient>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.downloadButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleDownload}
        >
          <FontAwesome name="download" size={16} color={Colors.success.default} />
          <Text style={styles.downloadButtonText}>Download</Text>
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
  centerContainer: {
    flex: 1,
    backgroundColor: Colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: Colors.text.muted,
    fontSize: Typography.size.md,
    marginTop: Spacing.md,
  },
  backButton: {
    marginTop: Spacing.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.surface.default,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  backButtonText: {
    color: Colors.primary.light,
    fontWeight: Typography.weight.semibold,
  },
  buttonPressed: {
    transform: [{ scale: 0.97 }],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.default,
  },
  closeButton: {
    padding: Spacing.sm,
  },
  headerTitle: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.semibold,
    color: Colors.text.primary,
  },
  headerSpacer: {
    width: 36,
  },
  videoSection: {
    alignItems: 'center',
    padding: Spacing.lg,
  },
  videoContainer: {
    position: 'relative',
  },
  videoGlow: {
    position: 'absolute',
    top: -12,
    left: -12,
    right: -12,
    bottom: -12,
    borderRadius: BorderRadius.xl + 12,
    backgroundColor: Colors.primary.glow,
  },
  videoWrapper: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    backgroundColor: Colors.background.tertiary,
    borderWidth: 2,
    borderColor: Colors.border.default,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  scriptSection: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  scriptLabel: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semibold,
    color: Colors.text.muted,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  scriptContainer: {
    backgroundColor: Colors.surface.default,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  scriptText: {
    fontSize: Typography.size.md,
    color: Colors.text.secondary,
    lineHeight: 22,
  },
  actionsSection: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
    marginTop: 'auto',
    marginBottom: Spacing.xl,
  },
  shareButton: {
    flex: 1,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadows.md,
  },
  shareButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
  },
  shareButtonText: {
    color: Colors.text.primary,
    fontWeight: Typography.weight.semibold,
    marginLeft: Spacing.sm,
    fontSize: Typography.size.md,
  },
  downloadButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surface.default,
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  downloadButtonText: {
    color: Colors.text.secondary,
    fontWeight: Typography.weight.medium,
    marginLeft: Spacing.sm,
    fontSize: Typography.size.md,
  },
});
