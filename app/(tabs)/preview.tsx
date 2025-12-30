import { View, Text, Pressable, Platform, StyleSheet, Linking } from 'react-native';
import { useEffect } from 'react';
import { router } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import { FontAwesome } from '@expo/vector-icons';

import { useCreationStore } from '@/stores/creationStore';
import { analytics, AnalyticsEvents } from '@/lib/analytics';

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
        <Text style={styles.title}>Your Talking Photo</Text>
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

      <View style={styles.actionsSection}>
        <Pressable onPress={handleDownload} style={styles.downloadButton}>
          <FontAwesome name="download" size={18} color="white" />
          <Text style={styles.buttonText}>Download Video</Text>
        </Pressable>

        <Pressable onPress={handleCreateAnother} style={styles.createAnotherButton}>
          <Text style={styles.createAnotherText}>Create Another</Text>
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
  loadingContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#6B7280',
  },
  videoSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
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
  actionsSection: {
    padding: 24,
    paddingBottom: 40,
    alignItems: 'center',
  },
  downloadButton: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#22C55E',
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 16,
  },
  createAnotherButton: {
    width: '100%',
    maxWidth: 400,
    marginTop: 16,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  createAnotherText: {
    color: '#374151',
    fontWeight: '600',
    fontSize: 16,
  },
});
