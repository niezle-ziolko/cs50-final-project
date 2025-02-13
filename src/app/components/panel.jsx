'use client';
import { useAuth } from 'context/auth-context';
import { useEffect, useState } from 'react';

export default function ClientPanel({ title }) {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);

  useEffect(() => {
    if (!user?.created) return;
    
    const ids = user.created.split(',').map(id => id.trim());
    const fetchBooks = async () => {
      try {
        const responses = await Promise.all(
          ids.map(id => 
            fetch(`/api/data/book?id=${id}`, {
              headers: {
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_BOOK_AUTH}`
              }
            }).then(res => res.json())
          )
        );
        setBooks(responses.filter(book => book && book.picture));
      } catch (error) {
        console.error('Error fetching books:', error);
      };
    };
    
    fetchBooks();
  }, [user?.created]);

  return (
    <div className='panel'>
      <h1>{title}</h1>
      <table>
        <tbody>
          {books.map((book, index) => (
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