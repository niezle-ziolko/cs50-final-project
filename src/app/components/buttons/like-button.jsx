'use client';
import { useAudio } from 'context/audio-context';
import { useAuth } from 'context/auth-context';
import { useState, useEffect } from 'react';

export default function HeartButton({ externalBookId }) {
  const { bookId: internalBookId } = useAudio();
  const { user, updateUser } = useAuth();

  const bookId = externalBookId || internalBookId;
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (!user?.liked || !bookId) {
      setIsLiked(false);
      return;
    };

    const likedBooks = user.liked.split(', ');
    setIsLiked(likedBooks.includes(bookId));
  }, [bookId, user?.liked]);

  const handleLike = async () => {
    if (!bookId || !user) return;

    try {
      const method = isLiked ? 'DELETE' : 'POST';
      const response = await fetch('/api/auth/like', {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_CLIENT_AUTH}`
        },
        body: JSON.stringify({
          id: bookId,
          username: user.username
        })
      });

      if (!response.ok) {
        console.error(`error: ${response.status} ${response.statusText}`);
        return;
      };

      const data = await response.json();
      updateUser(data);
      setIsLiked(!isLiked);
      console.log(`Book ${isLiked ? 'unliked' : 'liked'} successfully`);
    } catch (error) {
      console.error('error:', error);
    };
  };

  return (
    <div className='heart' onClick={handleLike}>
      <i className='fa-regular fa-heart' style={{ transition: 'all .4s', fontWeight: isLiked ? 'bold' : 'normal' }} />
    </div>
  );
};