import { StyleSheet, View, Image } from 'react-native';
import { ThemedText } from './ThemedText';
import { MarkdownDisplay } from './MarkdownDisplay';

export type Message = {
  role: 'user' | 'assistant';
  type: 'text' | 'image';
  content: string;
  imageUrl?: string;
  revisedPrompt?: string;
};

type MessageListProps = {
  messages: Message[];
};

export function MessageList({ messages }: MessageListProps) {
  return (
    <View style={styles.messagesContent}>
      {messages.filter(message => message.content.trim()).map((message, index) => (
        <View 
          key={index} 
          style={[
            styles.messageWrapper,
            message.role === 'user' ? styles.userMessage : styles.assistantMessage
          ]}
        >
          <ThemedText style={styles.messageRole}>{message.role}</ThemedText>
          {message.type === 'text' && (
              <MarkdownDisplay content={message.content} />
            )
          }
          {message.type === 'image' && (<View style={styles.imageContainer}>
              <Image source={{ uri: message.imageUrl }} style={styles.messageImage} />
              <ThemedText style={styles.messageText}>{message.revisedPrompt}</ThemedText>
            </View>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  messagesContent: {
    padding: 16,
  },
  messageWrapper: {
    marginBottom: 12,
    padding: 12,
    borderRadius: 8,
    maxWidth: '80%',
  },
  userMessage: {
    backgroundColor: '#E3F2FD',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 2,
  },
  assistantMessage: {
    backgroundColor: '#F5F5F5',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 2,
  },
  messageRole: {
    fontSize: 12,
    marginBottom: 4,
    textTransform: 'capitalize',
    opacity: 0.7,
  },
  messageText: {
    fontSize: 16,
  },
  messageImage: {
    width: 200,
    height: 200,
  },
  imageContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
}); 