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
} from '@mui/material';
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
      {projects.map((project) => (
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
          />
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              {project.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              by {project.author}
            </Typography>
            <Typography variant="body2" sx={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
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
      ))}

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
                <strong>Author:</strong> {selectedProject.author}
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
