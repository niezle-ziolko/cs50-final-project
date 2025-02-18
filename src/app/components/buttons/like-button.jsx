'use client';
import { useAudio } from 'context/audio-context';
import { useAuth } from 'context/auth-context';
import { useState, useEffect } from 'react';

export default function HeartButton() {
  const { currentBookId } = useAudio();
  const { user, setUser } = useAuth();

  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (!user?.liked) {
      setIsLiked(false);
      return;
    }
    const likedBooks = user.liked.split(',');
    setIsLiked(likedBooks.includes(currentBookId));
  }, [currentBookId, user?.liked]);

  const handleLike = async () => {
    if (!currentBookId || !user) return;

    try {
      const method = isLiked ? 'DELETE' : 'POST';
      const response = await fetch('/api/auth/like', {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_CLIENT_AUTH}`
        },
        body: JSON.stringify({
          id: currentBookId,
          username: user.username
        })
      });

      if (!response.ok) {
        console.error(`error: ${response.status} ${response.statusText}`);
        return;
      }

      const data = await response.json();
      if (data.success && data.liked !== undefined) {
        setUser(prevUser => prevUser ? { ...prevUser, liked: data.liked } : null);

        setIsLiked(!isLiked);
        console.log(`Book ${isLiked ? 'unliked' : 'liked'} successfully`);
      } else {
        console.error('error:', data);
      }
    } catch (error) {
      console.error('error:', error);
    }
  };

  return (
    <div className='heart' onClick={handleLike}>
      <i className='fa-regular fa-heart' 
        style={{ transition: 'all .4s', fontWeight: isLiked ? 'bold' : 'normal' }} 
      />
    </div>
  );
};
