import React, { useState, useRef } from 'react';
import { Platform, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Audio } from 'expo-av';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import ParallaxScrollView from '@/components/ParallaxScrollView';

interface ShadowingLessonScreenProps {
  onRecordingComplete: (audioUri: string) => Promise<void>;
  story: string | null;
  isLoading: boolean;
  error: string | null;
}

export function ShadowingLessonScreen({ onRecordingComplete, story, isLoading, error }: ShadowingLessonScreenProps) {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  async function startRecording() {
    try {
      // Clear any previous errors
      setPermissionError(null);
      
      // Request permissions
      const permissionResponse = await Audio.requestPermissionsAsync();
      if (!permissionResponse.granted) {
        setPermissionError("Microphone permission not granted. Please enable microphone access.");
        return;
      }
      
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('start recording', Audio.Recording)
      // Start recording
      const { recording } = await Audio.Recording.createAsync({
        ...Audio.RecordingOptionsPresets.HIGH_QUALITY,
        android: {
          ...Audio.RecordingOptionsPresets.HIGH_QUALITY.android,
        },
        ios: {
          ...Audio.RecordingOptionsPresets.HIGH_QUALITY.ios,
        }
      });
      setRecording(recording);
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording', err);
      setPermissionError("Could not access microphone. Please make sure your device has a working microphone.");
    }
  }

  async function stopRecording() {
    if (!recording) return;

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);
      setIsRecording(false);
      
      if (uri) {
        await onRecordingComplete(uri);
        // Create sound object for playback
        const { sound } = await Audio.Sound.createAsync({ uri });
        setSound(sound);
      }
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  }

  async function playSound() {
    try {
      if (sound) {
        if (isPlaying) {
          await sound.pauseAsync();
        } else {
          // Reset sound position before playing
          await sound.setPositionAsync(0);
          const status = await sound.playAsync();
          // Handle sound completion
          sound.setOnPlaybackStatusUpdate((status) => {
            if (status.isLoaded && status.didJustFinish) {
              setIsPlaying(false);
            }
          });
        }
        setIsPlaying(!isPlaying);
      }
    } catch (err) {
      console.error('Failed to play sound', err);
    }
  }

  // Cleanup sound when component unmounts
  React.useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}>
      <ThemedView style={styles.container}>
        <ThemedText type="title">English Shadowing</ThemedText>
        
        <ThemedView style={styles.lessonContainer}>
          <ThemedText type="subtitle">Today's Story</ThemedText>
          
          {isLoading ? (
            <ActivityIndicator size="large" color="#A1CEDC" />
          ) : error ? (
            <ThemedView style={styles.errorContainer}>
              <ThemedText style={styles.errorText}>{error}</ThemedText>
            </ThemedView>
          ) : story ? (
            <ThemedView style={styles.storyContainer}>
              <ThemedText>{story}</ThemedText>
            </ThemedView>
          ) : null}
          
          {/* Error message */}
          {permissionError && (
            <ThemedView style={styles.errorContainer}>
              <ThemedText style={styles.errorText}>{permissionError}</ThemedText>
            </ThemedView>
          )}
          
          {/* Recording button */}
          <TouchableOpacity
            style={styles.recordButton}
            onPress={isRecording ? stopRecording : startRecording}>
            <ThemedText>
              {isRecording ? 'Stop Recording' : 'Start Recording'}
            </ThemedText>
          </TouchableOpacity>

          {/* Playback button */}
          {sound && (
            <TouchableOpacity
              style={styles.playButton}
              onPress={playSound}>
              <ThemedText>
                {isPlaying ? 'Pause' : 'Play Recording'}
              </ThemedText>
            </TouchableOpacity>
          )}
        </ThemedView>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  lessonContainer: {
    gap: 12,
  },
  storyContainer: {
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginTop: 8,
  },
  recordButton: {
    padding: 16,
    backgroundColor: '#A1CEDC',
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  playButton: {
    padding: 16,
    backgroundColor: '#8FB9AA',
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  errorContainer: {
    padding: 12,
    backgroundColor: '#FFE0E0',
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 8,
  },
  errorText: {
    color: '#D32F2F',
    textAlign: 'center',
  },
}); 