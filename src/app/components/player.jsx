'use client';
import { useState, useRef, useEffect } from 'react';
import { useAudio } from 'context/audio-context';
import { Play, Pause, Volume2 } from 'lucide-react';

import 'styles/css/components/player.css';

export default function AudioPlayer() {
  const { file, picture } = useAudio();
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef(null);

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Aktualizacja progresu podczas odtwarzania
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => setProgress((audio.currentTime / audio.duration) * 100);
    const setAudioDuration = () => setDuration(audio.duration);

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', setAudioDuration);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', setAudioDuration);
    };
  }, []);

  // Funkcja do zmiany czasu odtwarzania
  const handleSeek = (e) => {
    if (!audioRef.current) return;
    const newTime = (e.target.value / 100) * audioRef.current.duration;
    audioRef.current.currentTime = newTime;
    setProgress(e.target.value);
  };

  // Funkcja do zmiany głośności
  const handleVolumeChange = (e) => {
    if (!audioRef.current) return;
    const newVolume = e.target.value / 100;
    audioRef.current.volume = newVolume;
    setVolume(newVolume);
  };

  return (
    <div className="audio-player-container">
      {picture && <img src={picture} alt="Cover" className="audio-cover" />}

      <>
        <audio ref={audioRef} src={file} />

        {/* Kontrolki odtwarzacza */}
        <div className="controls">
          <button onClick={togglePlayPause} className="play-btn">
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>

          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleSeek}
            className="progress-bar"
          />

          <span className="time">{Math.floor(duration / 60)}:{Math.floor(duration % 60)}</span>

          <div className="volume-control">
            <Volume2 size={20} />
            <input
              type="range"
              min="0"
              max="100"
              value={volume * 100}
              onChange={handleVolumeChange}
              className="volume-slider"
            />
          </div>
        </div>
      </>
    </div>
  );
}
