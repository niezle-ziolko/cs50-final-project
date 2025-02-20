'use client';
import { useAudio } from 'context/audio-context';

import 'styles/css/components/panel.css';

export default function BookPanel() {
  const { bookTitle, bookAuthor, bookDescription } = useAudio();

  return (
    <div className='panel book'>
      <h1>{bookTitle}</h1>
      <hr />
      <h2>Author: {bookAuthor}</h2>
      <p>{bookDescription}</p>
    </div>
  );
};