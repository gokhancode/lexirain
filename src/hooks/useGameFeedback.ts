import { useCallback, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { useSettings } from '../context/SettingsContext';

type FeedbackType = 'correct' | 'wrong' | 'missed' | 'levelUp';

export const useGameFeedback = () => {
  const { settings } = useSettings();
  const soundsRef = useRef<{
    correct?: Audio.Sound;
    wrong?: Audio.Sound;
    missed?: Audio.Sound;
    levelUp?: Audio.Sound;
  }>({});

  // Initialize audio
  useEffect(() => {
    const loadSounds = async () => {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
        });

        // Create simple beep sounds using different frequencies
        // Since we don't have audio files, we'll use haptics primarily
        // and simple system sounds if available
      } catch (error) {
        console.log('Audio setup error:', error);
      }
    };

    loadSounds();

    return () => {
      // Cleanup sounds
      Object.values(soundsRef.current).forEach(sound => {
        sound?.unloadAsync().catch(console.log);
      });
    };
  }, []);

  const playHaptic = useCallback(async (type: FeedbackType) => {
    if (!settings.hapticEnabled) return;

    try {
      switch (type) {
        case 'correct':
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          break;
        case 'wrong':
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          break;
        case 'missed':
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          break;
        case 'levelUp':
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          // Double haptic for level up
          setTimeout(() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          }, 150);
          break;
      }
    } catch (error) {
      // Haptics may not be available on all devices
      console.log('Haptic error:', error);
    }
  }, [settings.hapticEnabled]);

  const playSound = useCallback(async (type: FeedbackType) => {
    if (!settings.soundEnabled) return;

    try {
      // Use simple frequency-based sounds
      const frequencies: Record<FeedbackType, number> = {
        correct: 880,    // A5 - higher, happy
        wrong: 220,      // A3 - lower, sad
        missed: 330,     // E4 - mid, warning
        levelUp: 1760,   // A6 - very high, celebration
      };

      const durations: Record<FeedbackType, number> = {
        correct: 150,
        wrong: 200,
        missed: 300,
        levelUp: 400,
      };

      // Create a simple tone using the Audio API
      const { sound } = await Audio.Sound.createAsync(
        { uri: `data:audio/wav;base64,${generateTone(frequencies[type], durations[type])}` },
        { shouldPlay: true, volume: 0.5 }
      );

      // Unload after playing
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch (error) {
      console.log('Sound error:', error);
    }
  }, [settings.soundEnabled]);

  const triggerFeedback = useCallback((type: FeedbackType) => {
    playHaptic(type);
    playSound(type);
  }, [playHaptic, playSound]);

  return {
    triggerFeedback,
    playHaptic,
    playSound,
  };
};

// Generate a simple WAV tone as base64
function generateTone(frequency: number, durationMs: number): string {
  const sampleRate = 44100;
  const numSamples = Math.floor((sampleRate * durationMs) / 1000);
  const amplitude = 0.3;

  // WAV header
  const header = new ArrayBuffer(44);
  const view = new DataView(header);

  // RIFF chunk
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + numSamples * 2, true);
  writeString(view, 8, 'WAVE');

  // fmt chunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // chunk size
  view.setUint16(20, 1, true); // PCM format
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true); // byte rate
  view.setUint16(32, 2, true); // block align
  view.setUint16(34, 16, true); // bits per sample

  // data chunk
  writeString(view, 36, 'data');
  view.setUint32(40, numSamples * 2, true);

  // Generate samples
  const samples = new ArrayBuffer(numSamples * 2);
  const samplesView = new DataView(samples);

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    // Apply envelope for smooth start/end
    const envelope = Math.min(1, Math.min(i / 500, (numSamples - i) / 500));
    const sample = Math.sin(2 * Math.PI * frequency * t) * amplitude * envelope;
    samplesView.setInt16(i * 2, Math.floor(sample * 32767), true);
  }

  // Combine header and samples
  const combined = new Uint8Array(header.byteLength + samples.byteLength);
  combined.set(new Uint8Array(header), 0);
  combined.set(new Uint8Array(samples), header.byteLength);

  // Convert to base64
  return uint8ArrayToBase64(combined);
}

function writeString(view: DataView, offset: number, str: string) {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}

function uint8ArrayToBase64(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
