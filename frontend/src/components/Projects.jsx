import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Chip,
  Avatar,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

export default function Projects({ projects }) {
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 3,
        justifyContent: 'center',
        px: 2,
      }}
    >
      {projects.map((project) => {
        const username = project.author?.username || 'Unknown';
        const profileLink = `/profile/${username}`;
        const avatar = project.author?.avatar;

        return (
          <Paper
            key={project._id}
            elevation={4}
            sx={{
              width: 300,
              borderRadius: 3,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <img
              src={project.img}
              alt={project.title}
              style={{ width: '100%', height: 180, objectFit: 'cover' }}
              loading="lazy"
            />
            <Box sx={{ p: 2 }}>
              <Typography
                component={RouterLink}
                to={`/projects/${project._id}`}
                variant="h6"
                fontWeight="bold"
                gutterBottom
                sx={{ textDecoration: 'none', color: 'primary.main' }}
              >
                {project.title}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                {avatar && (
                  <Avatar
                    src={avatar}
                    alt={username}
                    sx={{ width: 24, height: 24 }}
                  />
                )}
                <Typography variant="body2">
                  by{' '}
                  <RouterLink
                    to={profileLink}
                    style={{ textDecoration: 'none', color: 'inherit', fontWeight: 500 }}
                  >
                    {username}
                  </RouterLink>
                </Typography>
              </Box>

              <Typography
                variant="body2"
                sx={{
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {project.description}
              </Typography>
            </Box>

            <IconButton
              onClick={() => setSelectedProject(project)}
              sx={{ position: 'absolute', top: 8, right: 8 }}
              aria-label="project details"
            >
              <InfoOutlinedIcon />
            </IconButton>
          </Paper>
        );
      })}

      {/* Modal to show project details */}
      <Dialog
        open={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        maxWidth="sm"
        fullWidth
      >
        {selectedProject && (
          <>
            <DialogTitle>{selectedProject.title}</DialogTitle>
            <DialogContent dividers>
              <Typography gutterBottom variant="body1">
                <strong>Author:</strong>{' '}
                <RouterLink to={`/profile/${selectedProject.author?.username || ''}`}>
                  {selectedProject.author?.username || 'Unknown'}
                </RouterLink>
              </Typography>

              {selectedProject.description && (
                <Typography gutterBottom variant="body2">
                  {selectedProject.description}
                </Typography>
              )}

              {selectedProject.tags?.length > 0 && (
                <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {selectedProject.tags.map((tag, i) => (
                    <Chip key={i} label={tag} size="small" />
                  ))}
                </Box>
              )}

              <Typography sx={{ marginTop: 2 }} variant="caption">
                Collaboration: {selectedProject.collaboration}
              </Typography>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Box>
  );
}