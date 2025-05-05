import { useState, useContext } from "react";
import { UserContext } from "../context/userContext";
import axios from 'axios';

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Grid2 from "@mui/material/Grid2";
import Link from "@mui/material/Link";
import CardContent from "@mui/material/CardContent";
import { styled } from "@mui/material/styles";
import MuiCard from '@mui/material/Card';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import TextField from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";


const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  minWidth: '400px',
  maxWidth: '400px',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
}));


const ProfilePage = () => {
  const { user, setUser } = useContext(UserContext);
  const [editOpen, setEditOpen] = useState(false);
  const [bio, setBio] = useState('');
  const [file, setFile] = useState(null);

  const handleEditClick = () => {
    setBio(user?.bio || '');
    setEditOpen(true);
  };

  const handleSaveChanges = async () => {
    try {
      const formData = new FormData();
      formData.append("bio", bio);
      if (file) {
        formData.append("avatar", file);
      }
  
      const res = await axios.put("/api/users/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
  
      setUser(res.data.user); 
      setEditOpen(false);
      setFile(null); 
    } catch (error) {
      console.error("Error updating profile", error);
    }
  };

  return (
    <Box sx={{ marginTop: 8, display: 'flex' }}>
      {/* Profile Section*/}
      <Box sx={{ marginRight: 8, width: '75%' }}>
        <Avatar
          src={user?.avatar || ''}
          alt='User Avatar'
          sx={{ width: 250, height: 250, borderRadius: '50%', marginBottom: 2 }}
        />
        <Typography variant='h3' sx={{ textAlign: 'left', marginBottom: 1 }}>{user ? user.username : "Error"}</Typography>
        <Typography variant='body2' sx={{ marginBottom: 3, textAlign: 'left', wordBreak: 'break-word' }}>
          {user?.bio || 'No Bio'}
        </Typography>
        <Button variant="contained" sx={{ width: '100%', margin: 'auto', marginBottom: 3 }} onClick={handleEditClick}>
          Edit Profile
        </Button>
      </Box>

      {/* Projects Section */}
      <Box sx={{ padding: 2, }}>
        <Typography variant='h3' sx={{ textAlign: 'left', marginBottom: 3 }}>Projects</Typography>
        <Grid2 container spacing={2}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Grid2 display='flex' justifyContent='center' key={item}>
              <Card>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Link href='#'>
                    <Typography variant='subtitle1'>Project Title {item}</Typography>
                  </Link>
                  <Typography variant='body2' sx={{ marginTop: 1 }}>
                    Project description: This is a description of the project.
                  </Typography>
                  <Box sx={{ display: 'flex', marginTop: 2 }}>
                    <Typography variant='caption' sx={{ marginRight: 2, color: 'text.secondary' }}>Language: </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid2>
          ))}
        </Grid2>
      </Box>

      {/* Edit Profile Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 1 }}>
          <Avatar
            src={file ? URL.createObjectURL(file) : user?.avatar || ''}
            alt="Preview Avatar"
            sx={{ width: 100, height: 100, marginX: 'auto' }}
          />
          <Button variant="outlined" component="label">
            Upload New Profile Picture
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </Button>
          <TextField
            id="bio"
            label="Bio"
            multiline
            maxRows={4}
            fullWidth
            variant="outlined"
            value={bio}
            onChange={(e) => {
              const newValue = e.target.value;
              if (newValue.length <= 300) {
                setBio(newValue);
              }
            }}
            slotProps={{
              textarea: {
                maxLength: 300,
              },
            }}
            sx={{ alignSelf: 'stretch' }}
          />
          <FormHelperText sx={{ alignSelf: 'flex-end' }}>{bio.length}/300</FormHelperText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveChanges}>Save</Button>
        </DialogActions>
      </Dialog>


    </Box>
  );
};

export default ProfilePage;