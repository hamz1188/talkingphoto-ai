import { View, Text, Pressable, Platform, StyleSheet, Linking, Share } from 'react-native';
import { useEffect } from 'react';
import { router } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { useCreationStore } from '@/stores/creationStore';
import { analytics, AnalyticsEvents } from '@/lib/analytics';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '@/constants/Theme';

export default function PreviewScreen() {
  const { videoUrl, reset } = useCreationStore();

  const player = useVideoPlayer(videoUrl || '', (player) => {
    player.loop = true;
    if (videoUrl) {
      player.play();
    }
  });

  useEffect(() => {
    if (!videoUrl) {
      router.replace('/');
    }
  }, [videoUrl]);

  const handleShare = async () => {
    if (!videoUrl) return;

    analytics.track(AnalyticsEvents.VIDEO_SHARED, {
      platform: Platform.OS,
    });

    try {
      await Share.share({
        message: 'Check out my talking photo! Made with TalkingPhoto AI',
        url: videoUrl,
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const handleDownload = async () => {
    if (!videoUrl) return;

    analytics.track(AnalyticsEvents.VIDEO_DOWNLOADED, {
      platform: Platform.OS,
    });

    if (Platform.OS === 'web') {
      // On web, open video in new tab or trigger download
      const link = document.createElement('a');
      link.href = videoUrl;
      link.download = `talking_photo_${Date.now()}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // On native, use Linking to open the URL
      Linking.openURL(videoUrl);
    }
  };

  const handleCreateAnother = () => {
    analytics.track(AnalyticsEvents.CREATE_ANOTHER_TAPPED);
    reset();
    router.replace('/');
  };

  if (!videoUrl) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.videoSection}>
        <View style={styles.successBadge}>
          <FontAwesome name="check-circle" size={16} color={Colors.success.default} />
          <Text style={styles.successText}>Video Ready!</Text>
        </View>
        <Text style={styles.title}>Your Talking Photo</Text>
        <View style={styles.videoContainer}>
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

      <View style={styles.actionsSection}>
        {/* Primary action - Share */}
        <Pressable
          onPress={handleShare}
          style={({ pressed }) => [
            styles.shareButton,
            pressed && styles.buttonPressed,
          ]}
        >
          <LinearGradient
            colors={[Colors.accent.default, Colors.accent.dark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.shareButtonGradient}
          >
            <FontAwesome name="share-alt" size={18} color={Colors.text.primary} />
            <Text style={styles.shareButtonText}>Share Video</Text>
          </LinearGradient>
        </Pressable>

        {/* Secondary actions row */}
        <View style={styles.secondaryActions}>
          <Pressable
            onPress={handleDownload}
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <FontAwesome name="download" size={16} color={Colors.success.default} />
            <Text style={styles.secondaryButtonText}>Download</Text>
          </Pressable>

          <Pressable
            onPress={handleCreateAnother}
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <FontAwesome name="plus" size={16} color={Colors.primary.default} />
            <Text style={styles.secondaryButtonText}>Create New</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: Colors.text.muted,
    fontSize: Typography.size.md,
  },
  videoSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  successBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.success.subtle,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.sm,
  },
  successText: {
    color: Colors.success.light,
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.medium,
    marginLeft: Spacing.xs,
  },
  title: {
    fontSize: Typography.size.xxl,
    fontWeight: Typography.weight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.lg,
  },
  videoContainer: {
    position: 'relative',
    width: '100%',
    maxWidth: 350,
  },
  videoGlow: {
    position: 'absolute',
    top: -15,
    left: -15,
    right: -15,
    bottom: -15,
    borderRadius: BorderRadius.xl + 15,
    backgroundColor: Colors.accent.glow,
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
  actionsSection: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
    alignItems: 'center',
  },
  shareButton: {
    width: '100%',
    maxWidth: 350,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadows.glow,
  },
  shareButtonGradient: {
    paddingVertical: Spacing.md + 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareButtonText: {
    color: Colors.text.primary,
    fontWeight: Typography.weight.semibold,
    marginLeft: Spacing.sm,
    fontSize: Typography.size.lg,
  },
  buttonPressed: {
    transform: [{ scale: 0.97 }],
  },
  secondaryActions: {
    flexDirection: 'row',
    marginTop: Spacing.md,
    gap: Spacing.md,
    width: '100%',
    maxWidth: 350,
  },
  secondaryButton: {
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
  secondaryButtonText: {
    color: Colors.text.secondary,
    fontWeight: Typography.weight.medium,
    marginLeft: Spacing.sm,
    fontSize: Typography.size.md,
  },
});
