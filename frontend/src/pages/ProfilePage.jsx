import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../context/userContext";
import axios from "axios";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Grid2 from "@mui/material/Grid2";
import Link from "@mui/material/Link";
import CardContent from "@mui/material/CardContent";
import { styled } from "@mui/material/styles";
import MuiCard from "@mui/material/Card";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  minWidth: "400px",
  maxWidth: "400px",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
}));

const ProfilePage = () => {
  const { user, setUser } = useContext(UserContext);
  const { username } = useParams();

  const [profileUser, setProfileUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [editOpen, setEditOpen] = useState(false);
  const [bio, setBio] = useState("");
  const [file, setFile] = useState(null);

  const isOwnProfile = username === "me" || username === user?.username;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          username === "me" ? "/api/users/profile" : `/api/users/username/${username}`,
          { withCredentials: true }
        );
        setProfileUser(res.data);

        const projectsRes = await axios.get(`/api/users/${res.data._id}/projects`);
        setProjects(projectsRes.data);
      } catch (err) {
        console.error("Error loading profile:", err.message);
      }
    };

    fetchProfile();
  }, [username]);

  const handleEditClick = () => {
    setBio(profileUser?.bio || "");
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
      setProfileUser(res.data.user);
      setEditOpen(false);
      setFile(null);
    } catch (error) {
      console.error("Error updating profile", error);
    }
  };

  if (!profileUser) {
    return (
      <Typography sx={{ mt: 10, textAlign: "center" }}>
        Loading profile...
      </Typography>
    );
  }

  return (
    <Box sx={{ marginTop: 8, display: "flex", alignItems: "flex-start" }}>
      {/* Profile Section */}
      <Box sx={{ marginRight: 8, width: "75%", maxWidth: 400 }}>
        <Avatar
          src={profileUser.avatar || ""}
          alt="User Avatar"
          sx={{
            width: 250,
            height: 250,
            borderRadius: "50%",
            marginBottom: 2,
          }}
        />
        <Typography variant="h3" sx={{ textAlign: "left", marginBottom: 1 }}>
          {profileUser.username}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            marginBottom: 3,
            textAlign: "left",
            wordBreak: "break-word",
          }}
        >
          {profileUser.bio || "No Bio"}
        </Typography>
        {isOwnProfile && (
          <Button
            variant="contained"
            sx={{ width: "100%", marginBottom: 3 }}
            onClick={handleEditClick}
          >
            Edit Profile
          </Button>
        )}
      </Box>

      {/* Projects Section */}
      <Box sx={{ padding: 2, flexGrow: 1, minWidth: {
  xs: '100%',   
  sm: 500,   
  md: 900,     
} }}>
        <Typography variant="h3" sx={{ textAlign: "left", marginBottom: 3 }}>
          Projects
        </Typography>
        {projects.length > 0 ? (
          <Grid2 container spacing={2}>
            {projects.map((project) => (
              <Grid2 display="flex" justifyContent="center" key={project._id}>
                <Card>
                  <CardContent>
                    <Link href={`/projects/${project._id}`}>
                      <Typography variant="subtitle1">{project.title}</Typography>
                    </Link>
                    <Typography variant="body2" sx={{ marginTop: 1 }}>
                      {project.description}
                    </Typography>
                    <Box sx={{ display: "flex", marginTop: 2 }}>
                      <Typography
                        variant="caption"
                        sx={{ color: "text.secondary" }}
                      >
                        Tags: {project.tags?.join(", ") || "N/A"}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid2>
            ))}
          </Grid2>
        ) : (
          <Typography variant="body2" sx={{ mt: 2 }}>
            No projects yet.
          </Typography>
        )}
      </Box>

      {/* Edit Profile Dialog */}
      {isOwnProfile && (
        <Dialog
          open={editOpen}
          onClose={() => setEditOpen(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogContent
            sx={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 1 }}
          >
            <Avatar
              src={file ? URL.createObjectURL(file) : profileUser.avatar || ""}
              alt="Preview Avatar"
              sx={{ width: 100, height: 100, marginX: "auto" }}
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
              label="Bio"
              multiline
              maxRows={4}
              fullWidth
              variant="outlined"
              value={bio}
              onChange={(e) => {
                if (e.target.value.length <= 300) {
                  setBio(e.target.value);
                }
              }}
              sx={{ alignSelf: "stretch" }}
            />
            <FormHelperText sx={{ alignSelf: "flex-end" }}>
              {bio.length}/300
            </FormHelperText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleSaveChanges}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default ProfilePage;
