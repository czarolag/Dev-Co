import { useState, useEffect } from 'react';
import axios from 'axios';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import UploadForm from "../components/UploadForm";

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
      <Box sx={{ marginY: 10, paddingX: 8 }}>
        <Typography variant="h2" align="center" color="text.primary" gutterBottom>
          Dev-Co
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary">
          Upload your projects for others to see or explore projects that other people have posted.
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', '& > *': { m: 10 } }}>
        <ButtonGroup size="large" aria-label="Upload/Explore" variant="contained">
          <Button href='/upload'>Upload</Button>
          <Button href='/explore'>Explore</Button>
        </ButtonGroup>
      </Box>
      <Box sx={{ mt: 5, mb: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
        {loading ? (
          <Typography align="center">Loading projects...</Typography>
        ) : (
          <>
            <IconButton onClick={handlePrev} disabled={index === 0}>
              <ChevronLeftIcon />
            </IconButton>

            <Box
              sx={{
                overflow: 'hidden',
                width: '100%',
                maxWidth: 1200,
              }}
            >
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
                      bgcolor: 'background.paper',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      minHeight: 320,
                    }}
                  >
                    <img
                      src={item.img}
                      alt={item.title}
                      style={{ width: '100%', height: 200, objectFit: 'cover' }}
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