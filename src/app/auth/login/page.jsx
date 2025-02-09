'use client';
import { useState } from 'react';
import Script from 'next/script';

import 'styles/css/theme/forms.css';


export default function Login() {
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

        const credentials = encodeURIComponent(`${formData.username}:${formData.password}`);
        
        const res = await fetch(`/api/auth/user?credentials=${credentials}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_LOGIN_TOKEN}`
          }
        });

        const data = await res.json();
        setLoading(false);

        if (res.ok) {
          alert('Login successful!');
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
          <input className='input' placeholder='Username' type='text' onChange={handleChange} required />
          <input className='input' placeholder='Password' type='password' onChange={handleChange} required /> 
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