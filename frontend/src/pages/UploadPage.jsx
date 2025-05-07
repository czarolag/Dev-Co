import UploadForm from '../components/UploadForm';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function UploadPage() {
  return (
    <Box sx={{ mt: 10, px: 2 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Upload Your Project
      </Typography>
      <UploadForm />
    </Box>
  );
}