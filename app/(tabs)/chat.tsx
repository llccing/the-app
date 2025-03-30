import { ThemedText } from '@/components/ThemedText';
import { useEffect, useState } from 'react';
import { Button, StyleSheet, TextInput, View, ScrollView, TouchableOpacity } from 'react-native';
import { ModelSelectionModal } from '@/components/ModelSelectionModal';
import FixedHeaderScrollView from '@/components/FixedHeaderScrollView';
import { MessageList, Message } from '@/components/MessageList';

const chatModels = [
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini' },
  { id: 'o1-mini', name: 'o1-mini' },
  { id: 'o1', name: 'o1' },
  { id: 'o3-mini', name: 'o3-mini' },
  { id: 'gpt-4o', name: 'GPT-4o' },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
  { id: 'deepseek-chat', name: 'deepseek-chat' },
  { id: 'deepseek-coder', name: 'deepseek-coder' },
  { id: 'gemini-pro', name: 'gemini-pro' },
  
  // those three claude apis are not works. for oneapi.ai
  // { id: 'claude-3-5-sonnet-latest', name: 'Claude 3.5 Sonnet' },
  // { id: 'claude-3-5-sonnet-latest-openai', name: 'Claude 3.5 Sonnet' },
  // { id: 'claude-3-7-sonnet-20250219', name: 'Claude 3.7 Sonnet' },
];


const imageModels = [
  { id: 'dall-e-3', name: 'Dall-E 3' },
  { id: 'volcv-v2.1-智能绘图生成', name: 'VolCV-v2.1-智能绘图生成' },
  { id: 'gpt-4-image', name: 'GPT-4 Image' },
  { id: 'gpt-4o-image', name: 'GPT-4o Image' },
]

export default function ChatScreen() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [model, setModel] = useState('gpt-4o-mini');
  const [isModelModalVisible, setIsModelModalVisible] = useState(false);
  const [isImageGeneration, setIsImageGeneration] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const models = isImageGeneration ? imageModels : chatModels;

  const handleSendMessage = () => {
    if (!message.trim() || isLoading) return;
    postMessage();
  };

  const postMessage = async () => {
    setIsLoading(true);
    try {
      if (!model) {
        setModel(isImageGeneration ? 'dall-e-3' : 'gpt-4o-mini');
      }

      const endpoint = isImageGeneration ?
        'http://localhost:3000/api/images' :
        'http://localhost:3000/api/messages';
      
      const body = { message, model };

      const response = await fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const mockResponse = await response.json();

      const userMessage: Message = { role: 'user', content: message };
      setMessages([...messages, userMessage]);

      const assistantMessage: Message = { role: 'assistant', content: mockResponse.message };
      setMessages(messages => [...messages, assistantMessage]);
      setMessage('');
      console.log(mockResponse);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const Header = (
    <View style={styles.header}>
      <ThemedText style={styles.headerText}>
        Chat - {model}
      </ThemedText>
      <View style={styles.headerButtons}>
        <Button title="Clear All" onPress={() => setMessages([])} />
        <Button title="Change Model" onPress={() => setIsModelModalVisible(true)} />
      </View>
    </View>
  );

  const Footer = (
    <View style={styles.bottomContainer}>
      <View style={styles.inputContainer}>
        <View style={styles.checkboxContainer}>
          <TouchableOpacity
            style={[styles.checkbox, isImageGeneration && styles.checkboxChecked]}
            onPress={() => {
              setIsImageGeneration(!isImageGeneration);
              setModel('');
            }}
          >
            {isImageGeneration && <ThemedText>✓</ThemedText>}
          </TouchableOpacity>
          <ThemedText style={styles.checkboxLabel}>Generate Image</ThemedText>
        </View>
        <TextInput
          style={styles.input}
          placeholder={isImageGeneration ? "Describe the image you want" : "Ask me anything"}
          value={message}
          onChangeText={setMessage}
          onSubmitEditing={handleSendMessage}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button 
          title={isLoading ? "Sending..." : "Send"} 
          onPress={handleSendMessage}
          disabled={isLoading || !message.trim()}
        />
      </View>
    </View>
  );

  return (
    <FixedHeaderScrollView
      header={Header}
      footer={Footer}
      headerHeight={100}
      footerHeight={120}
    >
      <MessageList messages={messages} />

      <ModelSelectionModal
        isVisible={isModelModalVisible}
        onClose={() => setIsModelModalVisible(false)}
        models={models}
        selectedModel={model}
        onSelectModel={setModel}
      />
    </FixedHeaderScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    flex: 1,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#2196f3',
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#2196f3',
  },
  checkboxLabel: {
    fontSize: 14,
  },
  buttonContainer: {
    justifyContent: 'flex-end',
    paddingBottom: 2,
  },
});
