'use client';
import { useState } from 'react';
import { useAuth } from 'context/auth-context';

import Spinner from 'components/spinner';

export default function EditForm() {
  const { updateUser, user } = useAuth();
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match!');
      return;
    }

    try {
      setLoading(true);

      const res = await fetch('/api/auth/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_CLIENT_AUTH}`
        },
        body: JSON.stringify({ ...formData })
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        updateUser(data);
      } else {
        setErrorMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setErrorMessage('An unexpected error occurred.');
      setLoading(false);
    };
  };

  return (
    <div className='login-form'>
      <form className='form' onSubmit={handleSubmit}>
        <p className='heading'>Edit your data</p>
        <div className='box'>
          {user?.photo ? (
            <img className='profile-picture' src={user.photo} alt='profile-picture' />
          ) : (
            <div className='profile-picture'>
              <Spinner />
            </div>
          )}
        </div>
        <input className='input' name='email' placeholder='E-mail' type='email' onChange={handleChange} required />
        <input className='input' name='password' placeholder='Password' type='password' onChange={handleChange} required />
        <input className='input' name='confirmPassword' placeholder='Confirm password' type='password' onChange={handleChange} required />
        {errorMessage && <p className='error-message'>{errorMessage}</p>}
        <button className='btn' type='submit' disabled={loading}>
          {loading ? <Spinner /> : 'Submit'}
        </button>
      </form>
    </div>
  );
};