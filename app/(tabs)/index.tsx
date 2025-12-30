import { View, Text, ScrollView, Pressable, Alert, StyleSheet } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { ImagePickerButton } from '@/components/ImagePickerButton';
import { VoiceSelector } from '@/components/VoiceSelector';
import { ScriptInput } from '@/components/ScriptInput';
import { LoadingOverlay } from '@/components/LoadingOverlay';
import { useCreationStore } from '@/stores/creationStore';
import { useGalleryStore } from '@/stores/galleryStore';
import { useSubscriptionContext } from '@/contexts/SubscriptionContext';
import { generateScript, generateVoice, generateVideo } from '@/services/api';
import { analytics, AnalyticsEvents } from '@/lib/analytics';
import { Colors, Gradients, Spacing, BorderRadius, Typography, Shadows } from '@/constants/Theme';

export default function CreateScreen() {
  const {
    imageUri,
    imageBase64,
    script,
    selectedVoiceId,
    status,
    setImage,
    setScript,
    setVoice,
    setAudioUrl,
    setVideoUrl,
    setStatus,
    setError,
    reset,
  } = useCreationStore();

  const { addVideo } = useGalleryStore();
  const {
    canCreateVideo,
    isPremium,
    remainingFreeVideos,
    showPaywall,
    incrementVideoCount,
  } = useSubscriptionContext();

  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');

  const handleGenerateScript = async () => {
    if (!imageBase64) {
      Alert.alert('Error', 'Please select an image first');
      return;
    }

    setIsGeneratingScript(true);
    try {
      const generatedScript = await generateScript(imageBase64);
      setScript(generatedScript);
      analytics.track(AnalyticsEvents.SCRIPT_GENERATED, {
        scriptLength: generatedScript.length,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to generate script. Please try again.');
      analytics.track(AnalyticsEvents.API_ERROR, {
        action: 'generate_script',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      console.error(error);
    } finally {
      setIsGeneratingScript(false);
    }
  };

  const handleCreateVideo = async () => {
    if (!imageBase64) {
      Alert.alert('Error', 'Please select an image first');
      return;
    }
    if (!script.trim()) {
      Alert.alert('Error', 'Please enter or generate a script');
      return;
    }

    // Check if user can create video (premium or has free videos left)
    if (!canCreateVideo) {
      analytics.track(AnalyticsEvents.FREE_LIMIT_REACHED, {
        videoCount: 2 - remainingFreeVideos,
      });
      analytics.track(AnalyticsEvents.PAYWALL_SHOWN, {
        trigger: 'free_limit_reached',
      });
      showPaywall();
      return;
    }

    analytics.track(AnalyticsEvents.VIDEO_GENERATION_STARTED, {
      scriptLength: script.length,
      voiceId: selectedVoiceId,
      isPremium,
    });

    setProgress(0);
    setProgressMessage('');

    try {
      // Step 1: Generate voice
      setStatus('generating-voice');
      setProgressMessage('Generating voice audio...');
      const audioUrl = await generateVoice(script, selectedVoiceId);
      setAudioUrl(audioUrl);

      // Step 2: Generate video with progress updates
      setStatus('generating-video');
      const imageDataUrl = `data:image/jpeg;base64,${imageBase64}`;

      const videoUrl = await generateVideo(
        imageDataUrl,
        audioUrl,
        (progressValue, message) => {
          setProgress(progressValue);
          setProgressMessage(message);
        }
      );
      setVideoUrl(videoUrl);

      // Save to gallery
      addVideo({
        videoUrl,
        thumbnailUri: imageUri,
        script,
      });

      // Increment video count for free tier tracking
      if (!isPremium) {
        await incrementVideoCount();
      }

      setStatus('complete');
      analytics.track(AnalyticsEvents.VIDEO_GENERATION_COMPLETED, {
        scriptLength: script.length,
        voiceId: selectedVoiceId,
        isPremium,
      });
      router.push('/preview');
    } catch (error) {
      console.error('Error creating video:', error);
      const message =
        error instanceof Error ? error.message : 'Failed to create video';
      setError(message);
      analytics.track(AnalyticsEvents.VIDEO_GENERATION_FAILED, {
        error: message,
        voiceId: selectedVoiceId,
      });
      Alert.alert('Error', message);
      setStatus('idle');
      setProgress(0);
    }
  };

  const getLoadingMessage = () => {
    if (progressMessage) return progressMessage;
    switch (status) {
      case 'generating-voice':
        return 'Generating voice audio...';
      case 'generating-video':
        return 'Creating lip-sync video...';
      default:
        return 'Processing...';
    }
  };

  const isProcessing =
    status === 'generating-voice' || status === 'generating-video';

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.title}>Make Photos Talk</Text>
          <Text style={styles.subtitle}>
            Upload a photo, add a script, and watch the magic happen
          </Text>
        </View>

        {/* Photo Picker */}
        <ImagePickerButton
          imageUri={imageUri}
          onImageSelected={(uri, base64) => setImage(uri, base64)}
        />

        {/* Script Input */}
        <View style={styles.section}>
          <ScriptInput
            script={script}
            onScriptChange={setScript}
            onGenerateScript={handleGenerateScript}
            isGenerating={isGeneratingScript}
            disabled={!imageBase64}
          />
        </View>

        {/* Voice Selector */}
        <View style={styles.section}>
          <VoiceSelector
            selectedVoiceId={selectedVoiceId}
            onVoiceSelect={setVoice}
          />
        </View>

        {/* Free tier indicator */}
        {!isPremium && (
          <View style={styles.freeIndicator}>
            <FontAwesome
              name={remainingFreeVideos > 0 ? 'star-o' : 'lock'}
              size={14}
              color={remainingFreeVideos > 0 ? Colors.premium.default : Colors.error.default}
            />
            <Text
              style={[
                styles.freeIndicatorText,
                remainingFreeVideos === 0 && styles.freeIndicatorTextEmpty,
              ]}
            >
              {remainingFreeVideos > 0
                ? `${remainingFreeVideos} free video${remainingFreeVideos !== 1 ? 's' : ''} remaining`
                : 'Upgrade to create more videos'}
            </Text>
            {remainingFreeVideos === 0 && (
              <Pressable onPress={showPaywall} style={styles.upgradeLink}>
                <Text style={styles.upgradeLinkText}>Upgrade</Text>
              </Pressable>
            )}
          </View>
        )}

        {/* Create Button */}
        <Pressable
          onPress={handleCreateVideo}
          disabled={!imageBase64 || !script.trim() || isProcessing}
          style={({ pressed }) => [
            styles.createButton,
            (!imageBase64 || !script.trim() || isProcessing) && styles.createButtonDisabled,
            pressed && styles.createButtonPressed,
          ]}
        >
          <LinearGradient
            colors={
              !imageBase64 || !script.trim() || isProcessing
                ? [Colors.surface.elevated, Colors.surface.elevated]
                : [Colors.primary.default, Colors.primary.dark]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.createButtonGradient}
          >
            <FontAwesome name="magic" size={20} color="white" />
            <Text style={styles.createButtonText}>Create Magic</Text>
          </LinearGradient>
        </Pressable>

        {/* Reset Button */}
        {(imageUri || script) && (
          <Pressable onPress={reset} style={styles.resetButton}>
            <Text style={styles.resetButtonText}>Start Over</Text>
          </Pressable>
        )}

        {/* Bottom spacing */}
        <View style={{ height: 40 }} />
      </ScrollView>

      <LoadingOverlay
        visible={isProcessing}
        message={getLoadingMessage()}
        progress={status === 'generating-video' ? progress : undefined}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.lg,
    alignItems: 'center',
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: Typography.size.xxxl,
    fontWeight: Typography.weight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: Typography.size.md,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  section: {
    width: '100%',
    alignSelf: 'stretch',
    marginTop: Spacing.lg,
  },
  createButton: {
    width: '100%',
    alignSelf: 'stretch',
    marginTop: Spacing.xl,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadows.glow,
  },
  createButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md + 2,
    paddingHorizontal: Spacing.lg,
  },
  createButtonDisabled: {
    opacity: 0.6,
    shadowOpacity: 0,
  },
  createButtonPressed: {
    transform: [{ scale: 0.98 }],
  },
  createButtonText: {
    color: Colors.text.primary,
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.semibold,
    marginLeft: Spacing.sm,
  },
  resetButton: {
    marginTop: Spacing.md,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  resetButtonText: {
    color: Colors.text.muted,
    fontSize: Typography.size.md,
  },
  freeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.lg,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.premium.subtle,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.premium.glow,
  },
  freeIndicatorText: {
    fontSize: Typography.size.sm,
    color: Colors.premium.light,
    marginLeft: Spacing.xs,
  },
  freeIndicatorTextEmpty: {
    color: Colors.error.light,
  },
  upgradeLink: {
    marginLeft: Spacing.sm,
  },
  upgradeLinkText: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semibold,
    color: Colors.accent.default,
  },
});
