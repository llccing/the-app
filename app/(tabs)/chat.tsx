import { ThemedText } from '@/components/ThemedText';
import { useEffect, useState } from 'react';
import { Button, StyleSheet, TextInput, View, ScrollView, Modal, TouchableOpacity } from 'react-native';
import { chatModels, imageModels } from './ai-models';

export default function ChatScreen() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<string[]>([]);
  const [model, setModel] = useState('');
  const [isModelModalVisible, setIsModelModalVisible] = useState(false);

  const models = [
    ...chatModels,
  ];

  const handleSendMessage = () => {
    postMessage();
  };

  const postMessage = async () => {
    if (!model) {
      setModel('gpt-4o-mini');
    }
    const response = await fetch('http://localhost:3000/api/messages', {
      method: 'POST',
      body: JSON.stringify({ message, model }),
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
        <View style={styles.headerButtons}>
          <Button title="Clear All" onPress={() => setMessages([])} />
          <Button title="Change Model" onPress={() => setIsModelModalVisible(true)} />
        </View>
      </View>

      <ScrollView style={styles.messagesContainer} contentContainerStyle={styles.messagesContent}>
        {messages.map((message, index) => (
          <View key={index} style={styles.messageWrapper}>
            <ThemedText style={styles.messageText}>{message}</ThemedText>
          </View>
        ))}
      </ScrollView>

      <Modal
        visible={isModelModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModelModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ThemedText style={styles.modalTitle}>Select Model</ThemedText>
            <View style={styles.modelList}>
              {models.map((item) => (
                <TouchableOpacity
                  key={item.id}
                style={[
                  styles.modelItem,
                  model === item.id && styles.selectedModel
                ]}
                onPress={() => {
                  setModel(item.id);
                  setIsModelModalVisible(false);
                }}
              >
                <ThemedText style={styles.modelText}>{item.name}</ThemedText>
                </TouchableOpacity>
              ))}
            </View>
            <Button title="Close" onPress={() => setIsModelModalVisible(false)} />
          </View>
        </View>
      </Modal>

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
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '90%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modelList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  modelItem: {
    padding: 8,
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
  },
  selectedModel: {
    backgroundColor: '#2196f3',
  },
  modelText: {
    fontSize: 16,
    textAlign: 'center',
  },
});
