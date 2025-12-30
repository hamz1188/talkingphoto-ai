import { View, Text, Pressable, Image, Platform, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { useResponsive } from '@/hooks/useResponsive';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '@/constants/Theme';

interface ImagePickerButtonProps {
  imageUri: string | null;
  onImageSelected: (uri: string, base64: string) => void;
}

export function ImagePickerButton({
  imageUri,
  onImageSelected,
}: ImagePickerButtonProps) {
  const { imageSize, iconContainerSize, scale } = useResponsive();
  const iconSize = scale(32);

  const pickImage = async () => {
    try {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          console.error('Permission not granted');
          return;
        }
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        if (asset.base64) {
          onImageSelected(asset.uri, asset.base64);
        } else {
          console.warn('Base64 not available, using URI only');
          onImageSelected(asset.uri, '');
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  if (imageUri) {
    return (
      <Pressable onPress={pickImage} style={styles.container}>
        <View style={[styles.imageContainer, { width: imageSize, height: imageSize }]}>
          <Image
            source={{ uri: imageUri }}
            style={[styles.image, { width: imageSize, height: imageSize }]}
            resizeMode="cover"
          />
          {/* Glow effect behind image */}
          <View style={styles.imageGlow} />
        </View>
        <View style={styles.changeButton}>
          <FontAwesome name="camera" size={14} color={Colors.text.primary} />
          <Text style={styles.changeText}>Change photo</Text>
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable onPress={pickImage} style={({ pressed }) => [
      styles.placeholder,
      { width: imageSize, height: imageSize },
      pressed && styles.placeholderPressed,
    ]}>
      <View style={styles.placeholderInner}>
        <View style={[styles.iconContainer, {
          width: iconContainerSize,
          height: iconContainerSize,
          borderRadius: iconContainerSize / 2,
        }]}>
          <FontAwesome name="camera" size={iconSize} color={Colors.primary.default} />
        </View>
        <Text style={styles.addText}>Add Photo</Text>
        <Text style={styles.hintText}>Tap to select from gallery</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  imageContainer: {
    position: 'relative',
    borderRadius: BorderRadius.xl,
    ...Shadows.lg,
  },
  image: {
    borderRadius: BorderRadius.xl,
    borderWidth: 2,
    borderColor: Colors.border.default,
  },
  imageGlow: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    borderRadius: BorderRadius.xl + 10,
    backgroundColor: Colors.primary.glow,
    zIndex: -1,
  },
  changeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.surface.default,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  changeText: {
    color: Colors.text.secondary,
    marginLeft: Spacing.xs,
    fontSize: Typography.size.sm,
  },
  placeholder: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
  },
  placeholderPressed: {
    transform: [{ scale: 0.98 }],
  },
  placeholderInner: {
    flex: 1,
    backgroundColor: Colors.surface.default,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: Colors.border.default,
  },
  iconContainer: {
    backgroundColor: Colors.primary.subtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  addText: {
    color: Colors.text.primary,
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.semibold,
  },
  hintText: {
    color: Colors.text.muted,
    marginTop: Spacing.xs,
    fontSize: Typography.size.sm,
  },
});
