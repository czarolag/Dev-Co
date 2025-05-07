import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Projects from '../components/Projects';
import { Box, TextField, Button } from '@mui/material';

export default function Explore() {
  const [itemData, setItemData] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const projectsPerPage = 6;

  useEffect(() => {
    axios.get('/api/projects', { withCredentials: true })
      .then((res) => setItemData(res.data))
      .catch((err) => console.error('Failed to fetch project data:', err));
  }, []);

  const filtered = itemData.filter((project) => {
    const query = search.toLowerCase();
    return (
      project.title.toLowerCase().includes(query) ||
      project.author.toLowerCase().includes(query) ||
      project.tags?.some(tag => tag.toLowerCase().includes(query))
    );
  });

  const visibleProjects = filtered.slice(0, page * projectsPerPage);
  const hasMore = visibleProjects.length < filtered.length;

  return (
    <Box sx={{ mt: 10, px: 2 }}>
      <TextField
        label="Search projects..."
        variant="outlined"
        fullWidth
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1); 
        }}
        sx={{
          mb: 4,
          maxWidth: 600,
          mx: 'auto',
        }}
      />

      <Projects projects={visibleProjects} />

      {hasMore && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button variant="outlined" onClick={() => setPage(prev => prev + 1)}>
            Load More
          </Button>
        </Box>
      )}
    </Box>
  );
}
