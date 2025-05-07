import { useState, useEffect } from 'react';
import axios from 'axios';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

function Home() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    axios.get('/api/projects', { withCredentials: true })
      .then(res => setProjects(res.data))
      .catch(err => console.error('Failed to fetch projects:', err))
      .finally(() => setLoading(false));
  }, []);

  const visibleCount = 3;
  const cardWidth = 500;
  const cardGap = 16;
  const maxIndex = Math.max(0, projects.length - visibleCount);

  const handlePrev = () => setIndex(prev => Math.max(prev - 1, 0));
  const handleNext = () => setIndex(prev => Math.min(prev + 1, maxIndex));

  return (
    <>
      <Box sx={{ mt: 10, px: 4, textAlign: 'center' }}>
        <Typography variant="h2" fontWeight="bold" gutterBottom>
          Dev-Co
        </Typography>
        <Typography variant="h6" color="text.secondary" maxWidth={700} mx="auto">
          Share your creations with the world or explore what others are building.
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: 4,
          flexWrap: 'wrap',
          mt: 8,
        }}
      >
        <Button
          href="/upload"
          variant="contained"
          color="primary"
          size="large"
          sx={{
            px: 6,
            py: 2,
            borderRadius: 3,
            fontSize: '1.1rem',
            fontWeight: 600,
            boxShadow: 3,
          }}
        >
          Upload Project
        </Button>

        <Button
          href="/explore"
          variant="outlined"
          size="large"
          sx={{
            px: 6,
            py: 2,
            borderRadius: 3,
            fontSize: '1.1rem',
            fontWeight: 600,
            boxShadow: 1,
            borderWidth: 2,
          }}
        >
          Explore Projects
        </Button>
      </Box>

      <Box
        sx={{
          mt: 10,
          mb: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          px: 2,
        }}
      >
        {loading ? (
          <Typography>Loading projects...</Typography>
        ) : (
          <>
            <IconButton onClick={handlePrev} disabled={index === 0}>
              <ChevronLeftIcon />
            </IconButton>

            <Box sx={{ overflow: 'hidden', width: '100%', maxWidth: 1200 }}>
              <Box
                sx={{
                  display: 'flex',
                  gap: `${cardGap}px`,
                  transform: `translateX(-${index * (cardWidth + cardGap)}px)`,
                  transition: 'transform 0.5s ease',
                }}
              >
                {projects.map((item) => (
                  <Paper
                    key={item._id}
                    elevation={4}
                    sx={{
                      width: cardWidth,
                      flexShrink: 0,
                      borderRadius: 3,
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      bgcolor: 'background.paper',
                    }}
                  >
                    <img
                      src={item.img}
                      alt={item.title}
                      style={{
                        width: '100%',
                        height: 200,
                        objectFit: 'cover',
                      }}
                      loading="lazy"
                    />
                    <Box sx={{ p: 2, pb: 3 }}>
                      <Typography variant="h6" fontWeight="bold">
                        {item.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.author}
                      </Typography>
                    </Box>
                  </Paper>
                ))}
              </Box>
            </Box>

            <IconButton onClick={handleNext} disabled={index >= maxIndex}>
              <ChevronRightIcon />
            </IconButton>
          </>
        )}
      </Box>
    </>
  );
}

export default Home;