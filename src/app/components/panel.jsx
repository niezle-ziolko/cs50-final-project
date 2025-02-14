'use client';
import { useEffect, useState, useCallback } from 'react';
import { useAuth } from 'context/auth-context';

import Spinner from './spinner';

export default function ClientPanel({ title }) {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentFile, setCurrentFile] = useState(null);

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
        }

        if (ids.length) {
          responses = await Promise.all(
            ids.map(id =>
              fetch(`/api/data/book?id=${id}`, { headers }).then(res => res.json())
            )
          );
        }
      }

      // Pobieramy file z odpowiedzi API
      const formattedBooks = responses
        .filter(book => book?.picture)
        .map(book => ({
          ...book,
          file: book?.file || null, // Upewniamy się, że file istnieje
        }));

      setBooks(formattedBooks);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
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
                <td className='loading'>
                  <Spinner />
                </td>
              </tr>
            ))
          ) : (
            books.map(book => (
              <tr key={book.id} onClick={() => book.file && setCurrentFile(book.file)}>
                <td>
                  <img src={book.picture} alt={book.title} style={{ cursor: 'pointer' }} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Odtwarzacz MP3 */}
      {currentFile && (
        <audio controls autoPlay key={currentFile} style={{ marginTop: '20px', width: '100%' }}>
          <source src={currentFile} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
}
