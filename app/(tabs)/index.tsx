import { View, Text, ScrollView, Pressable, Alert, StyleSheet } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

import { ImagePickerButton } from '@/components/ImagePickerButton';
import { VoiceSelector } from '@/components/VoiceSelector';
import { ScriptInput } from '@/components/ScriptInput';
import { LoadingOverlay } from '@/components/LoadingOverlay';
import { useCreationStore } from '@/stores/creationStore';
import { generateScript, generateVoice, generateVideo } from '@/services/api';
import { analytics, AnalyticsEvents } from '@/lib/analytics';

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

  const [isGeneratingScript, setIsGeneratingScript] = useState(false);

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

    analytics.track(AnalyticsEvents.VIDEO_GENERATION_STARTED, {
      scriptLength: script.length,
      voiceId: selectedVoiceId,
    });

    try {
      // Step 1: Generate voice
      setStatus('generating-voice');
      const audioUrl = await generateVoice(script, selectedVoiceId);
      setAudioUrl(audioUrl);

      // Step 2: Generate video
      setStatus('generating-video');
      // For Replicate, we need to upload the image first or use a data URL
      const imageDataUrl = `data:image/jpeg;base64,${imageBase64}`;
      const videoUrl = await generateVideo(imageDataUrl, audioUrl);
      setVideoUrl(videoUrl);

      setStatus('complete');
      analytics.track(AnalyticsEvents.VIDEO_GENERATION_COMPLETED, {
        scriptLength: script.length,
        voiceId: selectedVoiceId,
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
    }
  };

  const getLoadingMessage = () => {
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
      >
        <Text style={styles.title}>Create Talking Photo</Text>
        <Text style={styles.subtitle}>Upload a photo and make it talk!</Text>

        <ImagePickerButton
          imageUri={imageUri}
          onImageSelected={(uri, base64) => setImage(uri, base64)}
        />

        <View style={styles.section}>
          <ScriptInput
            script={script}
            onScriptChange={setScript}
            onGenerateScript={handleGenerateScript}
            isGenerating={isGeneratingScript}
            disabled={!imageBase64}
          />
        </View>

        <View style={styles.section}>
          <VoiceSelector
            selectedVoiceId={selectedVoiceId}
            onVoiceSelect={setVoice}
          />
        </View>

        <Pressable
          onPress={handleCreateVideo}
          disabled={!imageBase64 || !script.trim() || isProcessing}
          style={[
            styles.createButton,
            (!imageBase64 || !script.trim() || isProcessing) && styles.createButtonDisabled,
          ]}
        >
          <FontAwesome name="video-camera" size={20} color="white" />
          <Text style={styles.createButtonText}>Create Video</Text>
        </Pressable>

        {(imageUri || script) && (
          <Pressable onPress={reset} style={styles.resetButton}>
            <Text style={styles.resetButtonText}>Start Over</Text>
          </Pressable>
        )}
      </ScrollView>

      <LoadingOverlay visible={isProcessing} message={getLoadingMessage()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    color: '#6B7280',
    marginBottom: 32,
    textAlign: 'center',
  },
  section: {
    width: '100%',
    marginTop: 24,
  },
  createButton: {
    width: '100%',
    marginTop: 32,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
  },
  createButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  createButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  resetButton: {
    marginTop: 16,
    paddingVertical: 8,
  },
  resetButtonText: {
    color: '#6B7280',
  },
});
