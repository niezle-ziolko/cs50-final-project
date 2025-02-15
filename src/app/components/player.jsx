'use client';
import { useAudio } from 'context/audio-context';

export default function AudioPlayer() {
  const { file, picture } = useAudio();

  return (
    <div className='audio-player' style={{ marginTop: '20px', width: '100%', textAlign: 'center' }}>
      {picture && (
        <img
          src={picture}
          alt="Cover"
          style={{ maxWidth: '100%', height: 'auto', borderRadius: '10px', marginBottom: '10px' }}
        />
      )}
      <audio controls autoPlay key={file} style={{ width: '100%' }}>
        <source src={file} type="audio/mpeg" />
          Your browser does not support the audio element.
      </audio>
    </div>
  );
}
