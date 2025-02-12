'use client';
import { useAuth } from 'context/auth-context';

import 'styles/css/components/panel.css';

export default function ClientPanel({ title }) {
  const { user } = useAuth();

  return (
    <div className='panel'>
      <h1>{title}</h1>
      <table>
        <tbody>
          <tr>
            <td>
              <h1>Book title</h1>
            </td>
          </tr>
          <tr>
            <td>
              <h1>Book title</h1>
            </td>
          </tr>
          <tr>
            <td>
              <h1>Book title</h1>
            </td>
          </tr>
          <tr>
            <td>
              <h1>Book title</h1>
            </td>
          </tr>
          <tr>
            <td>
              <h1>Book title</h1>
            </td>
          </tr>
          <tr>
            <td>
              <h1>Book title</h1>
            </td>
          </tr>
          <tr>
            <td>
              <h1>Book title</h1>
            </td>
          </tr>
          <tr>
            <td>
              <h1>Book title</h1>
            </td>
          </tr>
          <tr>
            <td>
              <h1>Book title</h1>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};