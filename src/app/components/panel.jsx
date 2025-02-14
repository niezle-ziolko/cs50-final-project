'use client';
import { useAuth } from 'context/auth-context';
import { useEffect, useState } from 'react';

import Spinner from './spinner';

export default function ClientPanel({ title }) {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        let ids = [];

        if (title === 'My book' && user?.created) {
          ids = user.created.split(',').map(id => id.trim());
        } else if (title === 'Liked books' && user?.liked) {
          ids = user.liked.split(',').map(id => id.trim());
        }

        let responses;

        if (title === 'Library') {
          // W przypadku "Library" pobieramy wszystkie książki
          const response = await fetch('/api/data/book', {
            headers: { 'Authorization': `Bearer ${process.env.NEXT_PUBLIC_BOOK_AUTH}` }
          });
          responses = await response.json();
        } else {
          // W przeciwnym razie pobieramy książki na podstawie ids
          responses = await Promise.all(
            ids.map(id => 
              fetch(`/api/data/book?id=${id}`, {
                headers: { 'Authorization': `Bearer ${process.env.NEXT_PUBLIC_BOOK_AUTH}` }
              }).then(res => res.json())
            )
          );
        }

        // Filtrujemy odpowiedzi, aby uzyskać tylko książki z obrazkiem
        setBooks(responses.filter(book => book && book.picture));
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [user, title]); // Dodajemy title do zależności

  return (
    <div className='panel'>
      <h1>{title}</h1>
      <table>
        <tbody>
          {loading ? Array.from({ length: 8 }).map((_, index) => (
            <tr key={index}>
              <td className='loading'>
                <Spinner />
              </td>
            </tr>
          )) : books.map((book, index) => (
            <tr key={index}>
              <td>
                <img src={book.picture} alt={book.title} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};