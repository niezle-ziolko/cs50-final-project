'use client';
import { useState } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import { useAuth } from 'context/auth-context';

import Loader from 'components/loader';

export default function SignInForm() {
  const router = useRouter();
  const { updateUser } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const formState = new FormData(e.target);
    const turnstileRes = formState.get('cf-turnstile-response');

    if (!turnstileRes || turnstileRes === 'error') {
      setError('Turnstile verification failed.');
      
      return;
    };

    try {
      setLoading(true);

      if (!turnstileRes || turnstileRes === 'error') {
        setError('Turnstile verification failed.');
        setLoading(false);

        return;
      };

      const response = await fetch('/api/auth/challenge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_CHALLENGE_AUTH}`
        },
        body: JSON.stringify({
          token: turnstileRes,
          ...formData
        })
      });

      if (response.ok) {
        setLoading(true);
        const credentials = Buffer.from(`${formData.username}:${formData.password}`).toString('base64');
        
        const res = await fetch('/api/auth/user', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_CLIENT_AUTH}`,
            'Credentials': credentials
          }
        });

        const data = await res.json();
        setLoading(false);

        if (res.ok) {
          updateUser(data);
          router.push('/auth/my-account');
        } else {
          setError(`Error: ${data.error}`);
        };
      };
    } catch (error) {
      setError('An unexpected error occurred.');
      console.error('Login error:', error);
      setLoading(false);
    };
  };

  const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_SITE_KEY;

  return (
    <div>
      <Script src='https://challenges.cloudflare.com/turnstile/v0/api.js' />
      <div className='form login'>
        <form className='form' onSubmit={handleSubmit}>
          <p className='heading'>Sign in</p>
          <input className='input' name='username' placeholder='Username' type='text' value={formData.username} onChange={handleChange} required />
          <input className='input' name='password' placeholder='Password' type='password' value={formData.password} onChange={handleChange} required />
          <div className='cf-turnstile' data-sitekey={TURNSTILE_SITE_KEY} data-callback='javascriptCallback' data-theme='dark' />
          {error && <p className='error-message'>{error}</p>}
          <button className='button' type='submit' disabled={loading}>
            {loading ? <Loader /> : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};