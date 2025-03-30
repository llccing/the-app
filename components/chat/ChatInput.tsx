import { View, TextInput, Button, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { styles } from './styles';

interface ChatInputProps {
  message: string;
  isLoading: boolean;
  isImageGeneration: boolean;
  onMessageChange: (text: string) => void;
  onSendMessage: () => void;
  onToggleImageGeneration: () => void;
}

export function ChatInput({
  message,
  isLoading,
  isImageGeneration,
  onMessageChange,
  onSendMessage,
  onToggleImageGeneration,
}: ChatInputProps) {
  return (
    <View style={styles.bottomContainer}>
      <View style={styles.inputContainer}>
        <View style={styles.checkboxContainer}>
          <TouchableOpacity
            style={[styles.checkbox, isImageGeneration && styles.checkboxChecked]}
            onPress={onToggleImageGeneration}
          >
            {isImageGeneration && <ThemedText>✓</ThemedText>}
          </TouchableOpacity>
          <ThemedText style={styles.checkboxLabel}>Generate Image</ThemedText>
        </View>
        <TextInput
          style={styles.input}
          placeholder={isImageGeneration ? "Describe the image you want" : "Ask me anything"}
          value={message}
          onChangeText={onMessageChange}
          onSubmitEditing={onSendMessage}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button 
          title={isLoading ? "Sending..." : "Send"} 
          onPress={onSendMessage}
          disabled={isLoading || !message.trim()}
        />
      </View>
    </View>
  );
} 