import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

import { AVAILABLE_VOICES } from '@/stores/creationStore';
import { Colors, Spacing, BorderRadius, Typography } from '@/constants/Theme';

interface VoiceSelectorProps {
  selectedVoiceId: string;
  onVoiceSelect: (voiceId: string) => void;
}

export function VoiceSelector({
  selectedVoiceId,
  onVoiceSelect,
}: VoiceSelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Voice</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {AVAILABLE_VOICES.map((voice) => {
          const isSelected = voice.id === selectedVoiceId;
          const isFemale = voice.name.toLowerCase().includes('female');

          return (
            <Pressable
              key={voice.id}
              onPress={() => onVoiceSelect(voice.id)}
              style={({ pressed }) => [
                styles.voiceChip,
                isSelected && styles.voiceChipSelected,
                pressed && styles.voiceChipPressed,
              ]}
            >
              <View style={[
                styles.iconContainer,
                isSelected && styles.iconContainerSelected,
              ]}>
                <FontAwesome
                  name={isFemale ? 'venus' : 'mars'}
                  size={14}
                  color={isSelected ? Colors.primary.default : Colors.text.muted}
                />
              </View>
              <View style={styles.voiceInfo}>
                <Text
                  style={[
                    styles.voiceName,
                    isSelected && styles.voiceNameSelected,
                  ]}
                  numberOfLines={1}
                >
                  {voice.name}
                </Text>
                <Text style={styles.voiceType}>
                  {isFemale ? 'Female' : 'Male'}
                </Text>
              </View>
              {isSelected && (
                <View style={styles.checkmark}>
                  <FontAwesome name="check" size={10} color={Colors.text.primary} />
                </View>
              )}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.semibold,
    marginBottom: Spacing.md,
    color: Colors.text.primary,
  },
  scrollContent: {
    paddingRight: Spacing.md,
  },
  voiceChip: {
    marginRight: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    borderRadius: BorderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface.default,
    borderWidth: 1,
    borderColor: Colors.border.default,
    minWidth: 120,
  },
  voiceChipSelected: {
    backgroundColor: Colors.primary.subtle,
    borderColor: Colors.primary.default,
  },
  voiceChipPressed: {
    transform: [{ scale: 0.97 }],
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surface.elevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  iconContainerSelected: {
    backgroundColor: Colors.primary.glow,
  },
  voiceInfo: {
    flex: 1,
  },
  voiceName: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.medium,
    color: Colors.text.primary,
  },
  voiceNameSelected: {
    color: Colors.primary.light,
  },
  voiceType: {
    fontSize: Typography.size.xs,
    color: Colors.text.muted,
    marginTop: 2,
  },
  checkmark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary.default,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.xs,
  },
});
