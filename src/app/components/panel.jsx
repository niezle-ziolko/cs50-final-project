'use client';
import { useEffect, useState, useCallback } from 'react';
import { useAuth } from 'context/auth-context';
import { useAudio } from 'context/audio-context';

import Loader from './loader';
import Playing from './playing';

export default function ClientPanel({ title }) {
  const { user } = useAuth();
  const { setCurrentFile, setCurrentPicture } = useAudio();

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBookId, setSelectedBookId] = useState(null);

  const fetchBooks = useCallback(async () => {
    if (!user) return;

    setLoading(true);

    try {
      let responses = [];
      const headers = { 'Authorization': `Bearer ${process.env.NEXT_PUBLIC_BOOK_AUTH}` };

      if (title === 'Library') {
        const response = await fetch('/api/data/book', { headers });
        responses = await response.json();
      } else {
        let ids = [];
        if (title === 'My books' && user?.created) {
          ids = user.created.split(',').map(id => id.trim());
        } else if (title === 'Liked books' && user?.liked) {
          ids = user.liked.split(',').map(id => id.trim());
        };

        if (ids.length) {
          responses = await Promise.all(
            ids.map(id =>
              fetch(`/api/data/book?id=${id}`, { headers }).then(res => res.json())
            )
          );
        };
      };

      const formattedBooks = responses
        .filter(book => book?.picture)
        .map(book => ({
          ...book,
          file: book?.file || null
        }));

      setBooks(formattedBooks);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    };
  }, [user, title]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  return (
    <div className='panel'>
      <h1>{title}</h1>
      <table>
        <tbody>
          {loading ? (
            Array.from({ length: 8 }).map((_, index) => (
              <tr key={index}>
                <td>
                  <Loader />
                </td>
              </tr>
            ))
          ) : (
            books.map(book => (
              <tr key={book.id}>
                <td>
                  {title === 'Library' ? (
                    <>
                      <img src={book.picture} alt={book.title} width='205' height='290' onClick={() => {
                        if (book.file) {
                          setCurrentFile(book.file);
                          setCurrentPicture(book.picture);
                          setSelectedBookId(book.id);
                        };
                      }}/>
                      <div className='background-icon'>
                        {selectedBookId === book.id ? (
                          <Playing />
                        ) : (
                          <i className='fa-solid fa-play' id='icon' />
                        )}
                      </div>
                    </>
                  ) : (
                    <img src={book.picture} alt={book.title} width='205' height='290' />
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};