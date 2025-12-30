import { View, Text, TextInput, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { Colors, Spacing, BorderRadius, Typography } from '@/constants/Theme';

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
          style={({ pressed }) => [
            styles.generateButton,
            (disabled || isGenerating) && styles.generateButtonDisabled,
            pressed && styles.generateButtonPressed,
          ]}
        >
          <LinearGradient
            colors={
              disabled || isGenerating
                ? [Colors.surface.default, Colors.surface.default]
                : [Colors.accent.default, Colors.accent.dark]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.generateButtonGradient}
          >
            {isGenerating ? (
              <ActivityIndicator size="small" color={Colors.text.primary} />
            ) : (
              <FontAwesome name="magic" size={14} color={Colors.text.primary} />
            )}
            <Text style={styles.generateButtonText}>
              {isGenerating ? 'Writing...' : 'AI Write'}
            </Text>
          </LinearGradient>
        </Pressable>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          value={script}
          onChangeText={onScriptChange}
          placeholder="What should your photo say?"
          placeholderTextColor={Colors.text.muted}
          multiline
          numberOfLines={4}
          style={styles.textInput}
          textAlignVertical="top"
          maxLength={500}
        />
        {!script && !isGenerating && (
          <View style={styles.hintContainer}>
            <FontAwesome name="lightbulb-o" size={14} color={Colors.text.muted} />
            <Text style={styles.hintText}>
              Tip: Use AI Write to generate a script based on your photo
            </Text>
          </View>
        )}
      </View>

      <Text style={styles.charCount}>
        {script.length}
        <Text style={styles.charCountMax}>/500</Text>
      </Text>
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
    marginBottom: Spacing.sm,
  },
  label: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.semibold,
    color: Colors.text.primary,
  },
  generateButton: {
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  generateButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  generateButtonDisabled: {
    opacity: 0.5,
  },
  generateButtonPressed: {
    transform: [{ scale: 0.95 }],
  },
  generateButtonText: {
    color: Colors.text.primary,
    fontSize: Typography.size.sm,
    marginLeft: Spacing.sm,
    fontWeight: Typography.weight.medium,
  },
  inputContainer: {
    backgroundColor: Colors.surface.default,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border.default,
    overflow: 'hidden',
  },
  textInput: {
    width: '100%',
    padding: Spacing.md,
    color: Colors.text.primary,
    fontSize: Typography.size.md,
    minHeight: 120,
  },
  hintContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    gap: Spacing.xs,
  },
  hintText: {
    color: Colors.text.muted,
    fontSize: Typography.size.xs,
    flex: 1,
  },
  charCount: {
    color: Colors.text.secondary,
    fontSize: Typography.size.xs,
    marginTop: Spacing.xs,
    textAlign: 'right',
  },
  charCountMax: {
    color: Colors.text.muted,
  },
});
