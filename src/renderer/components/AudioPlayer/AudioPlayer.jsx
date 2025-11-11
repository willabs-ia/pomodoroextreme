import { useEffect, useRef } from 'react';

/**
 * AudioPlayer - Componente invisível que escuta eventos de áudio do main process
 * e toca sons usando HTML5 Audio API
 *
 * Este componente deve ser montado uma vez no App.jsx
 */
function AudioPlayer() {
  const audioInstances = useRef(new Map());
  const musicPlayer = useRef(null);

  useEffect(() => {
    // Listen to audio events from main process
    const handlePlaySound = (data) => {
      const { soundId, path, volume } = data;

      // Create or get audio instance
      let audio = audioInstances.current.get(soundId);

      if (!audio) {
        audio = new Audio();
        audioInstances.current.set(soundId, audio);
      }

      // Set source and volume
      audio.src = path;
      audio.volume = volume;

      // Play sound
      audio.play().catch(err => {
        console.warn(`Failed to play sound ${soundId}:`, err);
      });
    };

    const handleStopSound = (data) => {
      const { soundId } = data;
      const audio = audioInstances.current.get(soundId);

      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };

    const handlePlayMusic = (data) => {
      const { source, volume, loop } = data;

      // Stop existing music
      if (musicPlayer.current) {
        musicPlayer.current.pause();
        musicPlayer.current = null;
      }

      // Create new music player
      musicPlayer.current = new Audio(source);
      musicPlayer.current.volume = volume;
      musicPlayer.current.loop = loop;

      // Play music
      musicPlayer.current.play().catch(err => {
        console.warn('Failed to play music:', err);
      });
    };

    const handleStopMusic = () => {
      if (musicPlayer.current) {
        musicPlayer.current.pause();
        musicPlayer.current = null;
      }
    };

    const handlePauseMusic = () => {
      if (musicPlayer.current) {
        musicPlayer.current.pause();
      }
    };

    const handleResumeMusic = () => {
      if (musicPlayer.current) {
        musicPlayer.current.play().catch(err => {
          console.warn('Failed to resume music:', err);
        });
      }
    };

    const handleSetVolume = (data) => {
      const { type, volume } = data;

      if (type === 'music' && musicPlayer.current) {
        musicPlayer.current.volume = volume;
      }
    };

    // Register event listeners
    window.electronAPI?.onAudioPlaySound?.(handlePlaySound);
    window.electronAPI?.onAudioStopSound?.(handleStopSound);
    window.electronAPI?.onAudioPlayMusic?.(handlePlayMusic);
    window.electronAPI?.onAudioStopMusic?.(handleStopMusic);
    window.electronAPI?.onAudioPauseMusic?.(handlePauseMusic);
    window.electronAPI?.onAudioResumeMusic?.(handleResumeMusic);
    window.electronAPI?.onAudioSetVolume?.(handleSetVolume);

    // Cleanup
    return () => {
      // Stop all sounds
      audioInstances.current.forEach(audio => {
        audio.pause();
      });
      audioInstances.current.clear();

      // Stop music
      if (musicPlayer.current) {
        musicPlayer.current.pause();
      }
    };
  }, []);

  // This component renders nothing
  return null;
}

export default AudioPlayer;
