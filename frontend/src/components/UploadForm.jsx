import React, { useState } from 'react';
import axios from 'axios';

export default function UploadForm() {
  const [form, setForm] = useState({ img: '', title: '', author: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('/api/projects', form, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true, 
      });

      alert('Project uploaded!');
      setForm({ img: '', title: '', author: '' });
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Upload failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
      <input name="title" value={form.title} onChange={handleChange} placeholder="Title" required /><br />
      <input name="author" value={form.author} onChange={handleChange} placeholder="Author" required /><br />
      <input name="img" value={form.img} onChange={handleChange} placeholder="Image URL" required /><br />
      <button type="submit">Submit</button>
    </form>
  );
}
