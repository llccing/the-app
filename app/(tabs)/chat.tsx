import { ThemedText } from '@/components/ThemedText';
import { useEffect, useState } from 'react';
import { Button, StyleSheet, TextInput, View, ScrollView } from 'react-native';

export default function ChatScreen() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<string[]>([]);
  const [model, setModel] = useState('gpt-3.5-turbo');

  const handleSendMessage = () => {
    postMessage();
  };

  const postMessage = async () => {
    const response = await fetch('http://localhost:3000/api/messages', {
      method: 'POST',
      body: JSON.stringify({ message }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const mockResponse = await response.json();
    setMessages([...messages, mockResponse.message]);
    console.log(mockResponse);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.headerText}>Chat</ThemedText>
        <Button title="Clear All" onPress={() => setMessages([])} />
        {/* <Button title="Change Model" onPress={() => setModel('gpt-4o')} /> */}
      </View>

      <ScrollView style={styles.messagesContainer} contentContainerStyle={styles.messagesContent}>
        {messages.map((message, index) => (
          <View key={index} style={styles.messageWrapper}>
            <ThemedText style={styles.messageText}>{message}</ThemedText>
          </View>
        ))}
      </ScrollView>

      <View style={styles.bottomContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Ask me anything"
            value={message}
            onChangeText={setMessage}
            onSubmitEditing={handleSendMessage}
          />
        </View>
        <Button title="Send" onPress={handleSendMessage} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  messageWrapper: {
    marginBottom: 8,
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    maxWidth: '80%',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
  },
  bottomContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  inputContainer: {
    flex: 1,
    marginRight: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#2196f3',
    borderRadius: 20,
    height: 40,
    fontSize: 16,
    padding: 10,
  },
});
