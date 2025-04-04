import { StyleSheet } from 'react-native';
import { ShadowingLessonScreen } from '@/components/ShadowingLessonScreen';

export default function HomeScreen() {
  const handleRecordingComplete = async (audioUri: string) => {
    const formData = new FormData();
    formData.append('file', {
      uri: audioUri,
      type: 'audio/m4a',
      name: 'recording.m4a'
    } as any);

    try {
      const endpoint = 'http://localhost:3000/api/lesson/shadowing/score';
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload recording');
      }

      // Handle successful response here
      const data = await response.json();
      // You can add state management here for the score if needed
      console.log('data', data);
    } catch (error) {
      console.error('Failed to send recording to server:', error);
      // Handle error appropriately
    }
  };

  return <ShadowingLessonScreen onRecordingComplete={handleRecordingComplete} />;
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
