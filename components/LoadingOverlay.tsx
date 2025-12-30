import { View, Text, Modal, StyleSheet, Animated } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';

import { useResponsive } from '@/hooks/useResponsive';
import { Colors, Spacing, BorderRadius, Typography } from '@/constants/Theme';

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
  progress?: number; // 0-100
}

const FUN_MESSAGES = [
  'Teaching your photo to talk...',
  'Adding some personality...',
  'Syncing the lips...',
  'Making magic happen...',
  'Almost ready to wow you...',
  'Sprinkling AI dust...',
  'Training those vocal cords...',
  'Fine-tuning the expression...',
];

export function LoadingOverlay({
  visible,
  message = 'Processing...',
  progress,
}: LoadingOverlayProps) {
  const { contentWidth, iconContainerSize, glowSizeSmall, scale } = useResponsive();
  const showProgress = progress !== undefined && progress > 0;
  const spinAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const [funMessageIndex, setFunMessageIndex] = useState(0);

  // Dynamic sizes
  const cardMinWidth = Math.min(contentWidth, 320);
  const iconGlowSize = scale(100);
  const iconSize = scale(32);

  useEffect(() => {
    if (visible) {
      // Spin animation for the icon
      Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        })
      ).start();

      // Pulse animation for the glow
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Rotate fun messages
      const messageInterval = setInterval(() => {
        setFunMessageIndex((prev) => (prev + 1) % FUN_MESSAGES.length);
      }, 3000);

      return () => {
        clearInterval(messageInterval);
        spinAnim.stopAnimation();
        pulseAnim.stopAnimation();
      };
    }
  }, [visible]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const displayMessage = showProgress ? message : FUN_MESSAGES[funMessageIndex];

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.card, { minWidth: cardMinWidth }]}>
          {/* Animated glow behind icon */}
          <Animated.View
            style={[
              styles.iconGlow,
              {
                width: iconGlowSize,
                height: iconGlowSize,
                borderRadius: iconGlowSize / 2,
                transform: [{ scale: pulseAnim }],
              },
            ]}
          />

          {/* Spinning magic icon */}
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <View style={[styles.iconContainer, {
              width: iconContainerSize,
              height: iconContainerSize,
              borderRadius: iconContainerSize / 2,
            }]}>
              <FontAwesome name="magic" size={iconSize} color={Colors.primary.default} />
            </View>
          </Animated.View>

          <Text style={styles.message}>{displayMessage}</Text>

          {showProgress && (
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <LinearGradient
                  colors={[Colors.primary.default, Colors.accent.default]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.progressFill, { width: `${progress}%` }]}
                />
              </View>
              <Text style={styles.progressText}>{Math.round(progress)}%</Text>
            </View>
          )}

          <Text style={styles.hint}>
            {showProgress && progress < 30
              ? 'Warming up the AI...'
              : showProgress && progress < 60
              ? 'Creating the magic...'
              : showProgress && progress < 90
              ? 'Almost there...'
              : showProgress
              ? 'Finishing touches...'
              : 'This usually takes 1-2 minutes'}
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlay.heavy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: Colors.surface.elevated,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    marginHorizontal: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  iconGlow: {
    position: 'absolute',
    top: Spacing.xl,
    backgroundColor: Colors.primary.glow,
  },
  iconContainer: {
    backgroundColor: Colors.primary.subtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  message: {
    color: Colors.text.primary,
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.semibold,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  progressContainer: {
    width: '100%',
    marginTop: Spacing.lg,
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: Colors.surface.default,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: BorderRadius.full,
  },
  progressText: {
    color: Colors.primary.light,
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.bold,
    marginTop: Spacing.sm,
  },
  hint: {
    color: Colors.text.muted,
    fontSize: Typography.size.sm,
    marginTop: Spacing.md,
    textAlign: 'center',
  },
});
