'use client';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from 'context/auth-context';

import Loader from 'components/loader';
import ImageIcon from 'styles/icons/image';
import AudioIcon from 'styles/icons/audio';

export default function EditForm() {
  const { user } = useAuth();
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(user?.photo || '');
  const [audioFile, setAudioFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState({
    author: user?.username,
    title: '',
    description: '',
    link: '',
    picture: ''
  });

  const fileInputRef = useRef(null);
  const audioInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        author: user.username
      }));
    }
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
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleAudioClick = () => {
    audioInputRef.current.click();
  };

  const handleAudioChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAudioFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      setLoading(true);
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value.trim() !== '') payload.append(key, value);
      });
      if (imageFile) payload.append('picture', imageFile);
      if (audioFile) payload.append('audio', audioFile);

      const res = await fetch('/api/data/book', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_BOOK_AUTH}`
        },
        body: payload
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        // updateUser(data); // Zakładam, że ta funkcja aktualizuje dane użytkownika
      } else {
        setErrorMessage(`Error: ${data.error || 'Failed to update user.'}`);
      }
    } catch (error) {
      setErrorMessage('An unexpected error occurred.');
      setLoading(false);
    }
  };

  return (
    <div className='form-element' style={{ alignSelf: 'auto' }}>
      <form className='form' onSubmit={handleSubmit}>
        <p className='heading'>Create your book</p>
        <div className='box'>
          <div className='picture' onClick={handleImageClick} style={{ cursor: 'pointer' }}>
            {imagePreview ? (
              <img src={imagePreview} alt='book-cover' width='200' height='200' style={{ borderRadius: '10%' }} />
            ) : (
              <span>Click to upload book cover</span>
            )}
            <ImageIcon />
          </div>
          <input type='file' ref={fileInputRef} style={{ display: 'none' }} onChange={handleImageChange} accept='image/*' />
        </div>
        <input className='input' name='title' placeholder='Title' type='text' value={formData.title} onChange={handleChange} />
        <input className='input' name='description' placeholder='Description' type='text' value={formData.description} onChange={handleChange} />
        <div className='box'>
          <div className='audio' onClick={handleAudioClick} style={{ cursor: 'pointer' }}>
            <span>Click to upload audio file</span>
            <AudioIcon />
          </div>
        </div>
        {errorMessage && <p className='error-message'>{errorMessage}</p>}
        <button className='button' type='submit' disabled={loading}>
          {loading ? <Loader /> : 'Submit'}
        </button>
      </form>
    </div>
  );
};