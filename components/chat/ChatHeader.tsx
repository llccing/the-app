import { View, Button } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { styles } from './styles';

interface ChatHeaderProps {
  model: string;
  onClear: () => void;
  onChangeModel: () => void;
}

export function ChatHeader({ model, onClear, onChangeModel }: ChatHeaderProps) {
  return (
    <View style={styles.header}>
      <ThemedText style={styles.headerText}>
        Chat - {model}
      </ThemedText>
      <View style={styles.headerButtons}>
        <Button title="Clear All" onPress={onClear} />
        <Button title="Change Model" onPress={onChangeModel} />
      </View>
    </View>
  );
} 