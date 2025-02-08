'use client';
import { useState } from 'react';
import Script from 'next/script';

import 'styles/css/theme/forms.css';


export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    };

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_REGISTER_TOKEN}`
      },
      body: JSON.stringify(formData)
    });

    const data = await res.json();
    if (res.ok) {
      alert('Registration successful!');
    } else {
      alert(`Error: ${data.error}`);
    };
  };

  return (
    <div>
      <Script src='https://challenges.cloudflare.com/turnstile/v0/api.js' />
      <div className="login-form">
        <form className="form" onSubmit={handleSubmit}>
          <p className="heading">Sign up</p>
          <input className="input" name="username" placeholder="Username" type="text" onChange={handleChange} required />
          <input className="input" name="email" placeholder="E-mail" type="email" onChange={handleChange} required />
          <input className="input" name="password" placeholder="Password" type="password" onChange={handleChange} required />
          <input className="input" name="confirmPassword" placeholder="Confirm password" type="password" onChange={handleChange} required />
          <div className='cf-turnstile' data-sitekey='0x4AAAAAAA8CytbRsD_4tmim' data-callback='javascriptCallback' data-theme='dark' />
          <button className="btn" type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};