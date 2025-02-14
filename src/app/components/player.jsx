'use client';
import { useAudio } from 'context/audio-context';

export default function AudioPlayer() {
  const { currentFile } = useAudio();

  if (!currentFile) return null; // Nie wyświetlamy nic, jeśli plik nie został wybrany

  return (
    <div className='audio-player' style={{ marginTop: '20px', width: '100%' }}>
      <audio controls autoPlay key={currentFile}>
        <source src={currentFile} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}