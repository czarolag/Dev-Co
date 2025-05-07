import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Projects from '../components/Projects'; // make sure path is correct
import { Box } from '@mui/material';

export default function Explore() {
  const [itemData, setItemData] = useState([]);

  useEffect(() => {
    axios.get('/api/projects', { withCredentials: true })
      .then((res) => setItemData(res.data))
      .catch((err) => console.error('Failed to fetch project data:', err));
  }, []);

  return (
    <Box sx={{ mt: 4 }}>
      <Projects projects={itemData} />
    </Box>
  );
}
