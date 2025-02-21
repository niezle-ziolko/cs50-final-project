'use client';
import { useEffect, useState, useCallback } from 'react';
import { useAudio } from 'context/audio-context';
import { useAuth } from 'context/auth-context';

import Loader from '../loader';
import Playing from '../playing';
import LikeButton from '../buttons/like-button';

import 'styles/css/components/panel.css';

export default function ClientPanel({ title }) {
  const { user } = useAuth();
  const { setBookFile, setBookPicture, setBookTitle, setBookId, setBookAuthor, setBookDescription, bookId } = useAudio();

  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

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

      const formattedBooks = responses
        .filter(book => book?.picture)
        .map(book => ({
          ...book,
          file: book?.file || null
        }));

      setBooks(formattedBooks);
      setFilteredBooks(formattedBooks);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  }, [user, title]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredBooks(books);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredBooks(
        books.filter(book =>
          book.title.toLowerCase().includes(query) ||
          book.description.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, books]);

  return (
    <div className='panel'>
      <h1>{title}</h1>
      {title === 'Library' && (
        <input
          type='text'
          placeholder='Search books...'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className='search-input'
        />
      )}
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
            filteredBooks.map(book => (
              <tr key={book.id} onClick={() => {
                if (title === 'Library' && book.file) {
                  setBookFile(book.file);
                  setBookId(book.id);
                  setBookTitle(book.title);
                  setBookPicture(book.picture);
                  setBookAuthor(book.author);
                  setBookDescription(book.description);
                }
              }}>
                <td>
                  <img src={book.picture} alt={book.title} width='205' height='290' />
                  {title === 'Library' || title === 'Liked books' ? (
                    <div className='background-icon'>
                      {title === 'Library' ? (
                        bookId === book.id ? (
                          <Playing />
                        ) : (
                          <i className='fa-solid fa-play' id='icon' />
                        )
                      ) : (
                        <LikeButton externalBookId={book.id} />
                      )}
                    </div>
                  ) : null}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};