import FixedHeaderScrollView from '@/components/FixedHeaderScrollView';
import { Message, MessageList } from '@/components/MessageList';
import { ModelSelectionModal } from '@/components/ModelSelectionModal';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { ChatInput } from '@/components/chat/ChatInput';
import { chatModels, imageModels } from '@/components/chat/modelConfig';
import { useState } from 'react';

export default function ChatScreen() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [model, setModel] = useState('gpt-4o-mini');
  const [isModelModalVisible, setIsModelModalVisible] = useState(false);
  const [isImageGeneration, setIsImageGeneration] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const models = isImageGeneration ? imageModels : chatModels;

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;
    setIsLoading(true);
    try {
      if (!model) {
        setModel(isImageGeneration ? 'dall-e-2' : 'gpt-4o-mini');
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
      const responseData = await response.json();

      const userMessage: Message = { role: 'user', content: message, type: 'text' };
      setMessages([...messages, userMessage]);

      let assistantMessage: Message;
      if (isImageGeneration) {
        assistantMessage = { role: 'assistant', content: responseData.image, type: 'image', imageUrl: responseData.image, revisedPrompt: responseData.revised_prompt };
      } else {
        assistantMessage = { role: 'assistant', content: responseData.message, type: 'text' };
      }
      setMessages(messages => [...messages, assistantMessage]);
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleImageGeneration = () => {
    setIsImageGeneration(!isImageGeneration);
    setModel('');
  };

  return (
    <FixedHeaderScrollView
      header={
        <ChatHeader
          model={model}
          onClear={() => setMessages([])}
          onChangeModel={() => setIsModelModalVisible(true)}
        />
      }
      footer={
        <ChatInput
          message={message}
          isLoading={isLoading}
          isImageGeneration={isImageGeneration}
          onMessageChange={setMessage}
          onSendMessage={handleSendMessage}
          onToggleImageGeneration={handleToggleImageGeneration}
        />
      }
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
