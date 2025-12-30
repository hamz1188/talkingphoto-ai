import { View, Text, Pressable, Image, Platform, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome } from '@expo/vector-icons';

interface ImagePickerButtonProps {
  imageUri: string | null;
  onImageSelected: (uri: string, base64: string) => void;
}

export function ImagePickerButton({
  imageUri,
  onImageSelected,
}: ImagePickerButtonProps) {
  const pickImage = async () => {
    try {
      // On web, permissions are handled by the browser
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
        base64: true, // Request base64 directly
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        // Use the base64 from the result if available
        if (asset.base64) {
          onImageSelected(asset.uri, asset.base64);
        } else {
          // Fallback: just use URI (base64 should be available on most platforms)
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
        <Image
          source={{ uri: imageUri }}
          style={styles.image}
          resizeMode="cover"
        />
        <Text style={styles.changeText}>Tap to change photo</Text>
      </Pressable>
    );
  }

  return (
    <Pressable onPress={pickImage} style={styles.placeholder}>
      <FontAwesome name="camera" size={48} color="#9CA3AF" />
      <Text style={styles.addText}>Add Photo</Text>
      <Text style={styles.hintText}>Tap to select a photo</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  image: {
    width: 256,
    height: 256,
    borderRadius: 16,
  },
  changeText: {
    color: '#6B7280',
    marginTop: 8,
    fontSize: 14,
  },
  placeholder: {
    width: 256,
    height: 256,
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
    cursor: 'pointer',
  },
  addText: {
    color: '#6B7280',
    marginTop: 16,
    fontSize: 18,
    fontWeight: '500',
  },
  hintText: {
    color: '#9CA3AF',
    marginTop: 4,
    fontSize: 14,
  },
});
