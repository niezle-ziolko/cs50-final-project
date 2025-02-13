'use client';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from 'context/auth-context';

import Spinner from 'components/spinner';
import ImageIcon from 'styles/icons/image';

export default function EditForm() {
  const { updateUser, user } = useAuth();
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(user?.photo || '');
  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState({
    username: user?.username,
    email: '',
    password: '',
    confirmPassword: ''
  });

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        username: user.username
      }));
    };
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (formData.password && formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match!');
      return;
    };

    try {
      setLoading(true);
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value.trim() !== '') payload.append(key, value);
      });
      if (imageFile) payload.append('photo', imageFile);

      const res = await fetch('/api/auth/user', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_CLIENT_AUTH}`
        },
        body: payload
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        updateUser(data);
      } else {
        setErrorMessage(`Error: ${data.error || 'Failed to update user.'}`);
      };
    } catch (error) {
      setErrorMessage('An unexpected error occurred.');
      setLoading(false);
    };
  };

  return (
    <div className='form-element' style={{ alignSelf: 'auto' }}>
      <form className='form' style={{ position: 'absolute' }} onSubmit={handleSubmit}>
        <p className='heading'>Edit your data</p>
        <div className='box'>
          <div className='picture' onClick={handleImageClick} style={{ cursor: 'pointer' }}>
            {preview ? (
              <img src={preview} alt='profile-picture' width='200' height='200' style={{ borderRadius: '100%' }} />
            ) : (
              <img src={user?.photo} alt='profile-picture' width='200' height='200' style={{ borderRadius: '100%' }} />
            )}
            <ImageIcon />
          </div>
          <input type='file' ref={fileInputRef} style={{ display: 'none' }} onChange={handleImageChange} accept='image/*' />
        </div>
        <input className='input' name='email' placeholder={user?.email} type='email' value={formData.email} onChange={handleChange} />
        <input className='input' name='password' placeholder='Password' type='password' onChange={handleChange} />
        <input className='input' name='confirmPassword' placeholder='Confirm password' type='password' onChange={handleChange} />
        <span className='span'>Enter only the data you want to change.</span>
        {errorMessage && <p className='error-message'>{errorMessage}</p>}
        <button className='button' type='submit' disabled={loading}>
          {loading ? <Spinner /> : 'Submit'}
        </button>
      </form>
    </div>
  );
};