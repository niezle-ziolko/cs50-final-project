'use client';
import { useState } from 'react';
import Script from 'next/script';

import { useSession } from 'context/user-context';

import 'styles/css/theme/forms.css';


export default function Login() {
  const { saveSession } = useSession();
  const [errorMessage, setErrorMessage] = useState('');
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
    setErrorMessage('');

    const formState = new FormData(e.target);
    const turnstileRes = formState.get('cf-turnstile-response');

    if (!turnstileRes || turnstileRes === 'error') {
      setErrorMessage('Turnstile verification failed.');
      
      return;
    };

    try {
      setLoading(true);

      if (!turnstileRes || turnstileRes === 'error') {
        setErrorMessage('Turnstile verification failed.');
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
          const setCookieHeader = res.headers.get('Set-Cookie');

          if (setCookieHeader) {
            saveSession(setCookieHeader);
          };
        } else {
          setErrorMessage(`Error: ${data.error}`);
        };
      };
    } catch (error) {
      setErrorMessage('An unexpected error occurred.');
      console.error('Login error:', error);
      setLoading(false);
    };
  };

  const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_SITE_KEY;

  return (
    <div>
      <Script src='https://challenges.cloudflare.com/turnstile/v0/api.js' />
      <div className='login-form'>
        <form className='form' onSubmit={handleSubmit}>
          <p className='heading'>Sign in</p>
          <input className='input' name='username' placeholder='Username' type='text' value={formData.username} onChange={handleChange} required />
          <input className='input' name='password' placeholder='Password' type='password' value={formData.password} onChange={handleChange} required />
          <div className='cf-turnstile' data-sitekey={TURNSTILE_SITE_KEY} data-callback='javascriptCallback' data-theme='dark' />
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <button className="btn" type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};