import React, { useState, useContext } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  MenuItem,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { UserContext } from '../context/UserContext';

export default function UploadForm() {
  const { user } = useContext(UserContext);

  const [form, setForm] = useState({
    title: '',
    img: '',
    description: '',
    tags: '',
    url: '',
    collaboration: 'open',
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [useFileUpload, setUseFileUpload] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;

    if (!uploadedFile.type.startsWith("image/")) {
      alert("Please upload a valid image file.");
      return;
    }

    setFile(uploadedFile);
    setPreview(URL.createObjectURL(uploadedFile));
    setForm((prev) => ({ ...prev, img: '' })); // Clear URL
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let finalImageUrl = form.img;

    if (useFileUpload && file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await axios.post('/api/upload', formData, {
          withCredentials: true,
        });
        finalImageUrl = res.data.url;
      } catch (err) {
        console.error('Image upload failed:', err);
        alert('Image upload failed');
        return;
      }
    }

    const tagsArray = form.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);

    try {
      await axios.post(
        '/api/projects',
        {
          ...form,
          img: finalImageUrl,
          tags: tagsArray,
          author: user.username,
        },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      alert('Project uploaded!');
      setForm({
        title: '',
        img: '',
        description: '',
        tags: '',
        url: '',
        collaboration: 'open',
      });
      setFile(null);
      setPreview('');
      setUseFileUpload(false);
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Upload failed');
    }
  };

  return (
    <Paper elevation={4} sx={{ maxWidth: 700, mx: 'auto', p: 4, borderRadius: 3 }}>
      <Typography variant="h5" gutterBottom>
        Submit a New Project
      </Typography>

      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <TextField
          label="Title"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          fullWidth
        />

        <FormControlLabel
          control={
            <Switch
              checked={useFileUpload}
              onChange={() => {
                setUseFileUpload((prev) => !prev);
                setFile(null);
                setForm((prev) => ({ ...prev, img: '' }));
                setPreview('');
              }}
              color="primary"
            />
          }
          label={useFileUpload ? "Use File Upload" : "Use Image URL"}
        />

        {!useFileUpload ? (
          <TextField
            label="Image URL"
            name="img"
            value={form.img}
            onChange={(e) => {
              const value = e.target.value;
              setFile(null);
              handleChange(e);

              // Basic image extension check
              const isValidImageURL = /\.(jpeg|jpg|gif|png|webp|svg)$/i.test(value);
              setPreview(isValidImageURL ? value : '');
            }}
            fullWidth
            helperText="Paste a valid image URL"
          />
        ) : (
          <>
            <Button variant="outlined" component="label">
              Upload Image File
              <input type="file" hidden accept="image/*" onChange={handleFileChange} />
            </Button>
            {file && (
              <Typography variant="body2" color="text.secondary">
                {file.name}
              </Typography>
            )}
          </>
        )}

        {preview && (
          <Box sx={{ textAlign: 'center' }}>
            <img
              src={preview}
              alt="Preview"
              style={{ maxHeight: 200, maxWidth: '100%', marginTop: 10, borderRadius: 8 }}
              onError={(e) => e.target.style.display = 'none'}
            />
          </Box>
        )}

        <TextField
          label="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
          required
          fullWidth
        />

        <TextField
          label="Tags (comma-separated)"
          name="tags"
          value={form.tags}
          onChange={handleChange}
          fullWidth
        />

        <TextField
          label="Project URL (GitHub, demo, etc.)"
          name="url"
          value={form.url}
          onChange={handleChange}
          fullWidth
        />

        <TextField
          label="Collaboration Status"
          name="collaboration"
          value={form.collaboration}
          onChange={handleChange}
          select
          fullWidth
        >
          <MenuItem value="open">Open to Collaboration</MenuItem>
          <MenuItem value="closed">Closed</MenuItem>
        </TextField>

        <Button type="submit" variant="contained" size="large" disabled={!user?.username}>
          Submit
        </Button>
      </Box>
    </Paper>
  );
}