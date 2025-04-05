import { StyleSheet } from 'react-native';
import { ShadowingLessonScreen } from '@/components/ShadowingLessonScreen';
import { useState, useEffect } from 'react';

export default function HomeScreen() {
  const [story, setStory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/lesson/story');
        if (!response.ok) {
          throw new Error('Failed to fetch story');
        }
        const data = await response.json();
        setStory(data.story);
      } catch (err) {
        console.error('Failed to fetch story:', err);
        setError('Failed to load the story. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStory();
  }, []);

  const handleRecordingComplete = async (audioUri: string) => {
    const formData = new FormData();
    const audioBlob = await fetch(audioUri).then(res => res.blob());
    formData.append('audio', audioBlob, 'recording.webm');

    try {
      // const endpoint = 'http://localhost:3000/api/lesson/shadowing/score';
      // const endpoint = 'http://localhost:3001/python/api/lesson/shadowing/score';
      const endpoint = 'http://localhost:3001/upload-audio';
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

  return <ShadowingLessonScreen onRecordingComplete={handleRecordingComplete} story={story} isLoading={isLoading} error={error} />;
}
