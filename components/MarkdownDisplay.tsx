import { View, StyleSheet } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { ThemedText } from './ThemedText';

interface MarkdownDisplayProps {
  content: string;
}

export const MarkdownDisplay = ({ content }: MarkdownDisplayProps) => {
  return (
    <View style={styles.markdownContainer}>
      <Markdown
        style={{
          body: styles.markdownText,
          heading1: styles.markdownH1,
          heading2: styles.markdownH2,
          code_block: styles.codeBlock,
          code_inline: styles.codeText,
        }}
      >
        {content}
      </Markdown>
    </View>
  );
};

const styles = StyleSheet.create({
  markdownContainer: {
    flex: 1,
    padding: 8,
  },
  markdownText: {
    fontSize: 16,
    lineHeight: 24,
  },
  markdownH1: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 12,
  },
  markdownH2: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  codeBlock: {
    backgroundColor: '#f5f5f5',
    padding: 8,
    borderRadius: 4,
    marginVertical: 4,
  },
  codeText: {
    fontFamily: 'monospace',
    fontSize: 14,
  },
}); 