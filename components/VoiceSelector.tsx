import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { AVAILABLE_VOICES } from '@/stores/creationStore';

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
      <Text style={styles.label}>Select Voice</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {AVAILABLE_VOICES.map((voice) => {
          const isSelected = voice.id === selectedVoiceId;
          return (
            <Pressable
              key={voice.id}
              onPress={() => onVoiceSelect(voice.id)}
              style={[
                styles.voiceButton,
                isSelected && styles.voiceButtonSelected,
              ]}
            >
              <FontAwesome
                name={voice.name.includes('Female') ? 'female' : 'male'}
                size={16}
                color={isSelected ? 'white' : '#6B7280'}
              />
              <Text
                style={[
                  styles.voiceName,
                  isSelected && styles.voiceNameSelected,
                ]}
              >
                {voice.name}
              </Text>
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
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#111827',
  },
  voiceButton: {
    marginRight: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  voiceButtonSelected: {
    backgroundColor: '#3B82F6',
  },
  voiceName: {
    marginLeft: 8,
    fontWeight: '500',
    color: '#374151',
  },
  voiceNameSelected: {
    color: 'white',
  },
});
