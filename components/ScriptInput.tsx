import { View, Text, TextInput, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface ScriptInputProps {
  script: string;
  onScriptChange: (script: string) => void;
  onGenerateScript: () => void;
  isGenerating: boolean;
  disabled?: boolean;
}

export function ScriptInput({
  script,
  onScriptChange,
  onGenerateScript,
  isGenerating,
  disabled,
}: ScriptInputProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>Script</Text>
        <Pressable
          onPress={onGenerateScript}
          disabled={disabled || isGenerating}
          style={[
            styles.generateButton,
            (disabled || isGenerating) && styles.generateButtonDisabled,
          ]}
        >
          {isGenerating ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <FontAwesome name="magic" size={14} color="white" />
          )}
          <Text style={styles.generateButtonText}>
            {isGenerating ? 'Generating...' : 'AI Generate'}
          </Text>
        </Pressable>
      </View>
      <TextInput
        value={script}
        onChangeText={onScriptChange}
        placeholder="Type what you want the photo to say..."
        placeholderTextColor="#9CA3AF"
        multiline
        numberOfLines={4}
        style={styles.textInput}
        textAlignVertical="top"
      />
      <Text style={styles.charCount}>{script.length}/500 characters</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#3B82F6',
  },
  generateButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  generateButtonText: {
    color: 'white',
    fontSize: 14,
    marginLeft: 8,
    fontWeight: '500',
  },
  textInput: {
    width: '100%',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    color: '#111827',
    fontSize: 16,
    minHeight: 100,
  },
  charCount: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'right',
  },
});
