'use client';
import { useState } from 'react';
import { useAuth } from 'context/auth-context';

import AIIcon from 'styles/icons/ai';
import Loader from 'components/loader';

import 'styles/css/components/forms.css';

export default function CreateForm() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    audio: [],
    textFiles: [],
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageName, setImageName] = useState('No file chosen');
  const [fileNames, setFileNames] = useState([]);
  const [isTextMode, setIsTextMode] = useState(false);

  const handleChange = (e) => {
    const { name, type, files, value } = e.target;
    if (type === 'file') {
      if (name === 'image') {
        setImageName(files[0]?.name || 'No file chosen');
        setFormData((prev) => ({ ...prev, image: files[0] || null }));
      } else if (name === 'fileUpload') {
        const newFiles = Array.from(files);
        setFileNames(newFiles.map((file) => file.name));
        setFormData((prev) => ({
          ...prev,
          [isTextMode ? 'textFiles' : 'audio']: newFiles,
        }));
      };
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!user?.username) {
      setError('You must have a username to submit this form.');
      return;
    };

    setLoading(true);

    const data = new FormData();
    data.append('username', user.username);
    data.append('title', formData.title);
    data.append('description', formData.description);
    formData.audio.forEach((file) => data.append('audio', file));
    formData.textFiles.forEach((file) => data.append('textFiles', file));
    if (formData.image) data.append('image', formData.image);

    try {
      const response = await fetch('/api/data/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_BOOK_AUTH}`
        },
        body: data
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      };

      console.log('Form submitted successfully');
    } catch (error) {
      setError(`Error: ${error}`);
    } finally {
      setLoading(false);
    };
  };

  return (
    <div className='form create-book'>
      <form className='form' style={{ position: 'absolute' }} onSubmit={handleSubmit}>
        <p className='heading'>Create your book</p>
        <div className='box'>
          <label className='file-upload'>
            <input 
              type='file' 
              name='fileUpload' 
              accept={isTextMode ? 'text/plain' : 'audio/mp3'} 
              multiple 
              onChange={handleChange} 
            />
            <span>Select {isTextMode ? 'Text Files (.txt)' : 'Audio Files (.mp3)'}</span>
          </label>
          <p className='file-name'>{fileNames.length > 0 ? fileNames.join(', ') : 'No files chosen'}</p>
        </div>
        <div className='box'>
          <label className='file-upload'>
            <input type='file' name='image' accept='image/*' onChange={handleChange} />
            <span>Select Cover Image</span>
          </label>
          <p className='file-name'>{imageName}</p>
        </div>
        <input className='input' name='title' placeholder='Title' type='text' value={formData.title} onChange={handleChange} />
        <textarea name='description' placeholder='Description' value={formData.description} onChange={handleChange} />
        {error && <p className='error-message'>{error}</p>}
        <button className='button' type='submit' disabled={loading}>
          {loading ? <Loader /> : 'Submit'}
        </button>
        <AIIcon onClick={() => setIsTextMode((prev) => !prev)} />
      </form>
    </div>
  );
};