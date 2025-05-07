import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  Avatar,
  Paper,
  TextField,
  MenuItem,
  Divider,
} from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import { UserContext } from "../context/userContext";
import { toast } from "react-hot-toast";

export default function ProjectDetails() {
  const { projectId } = useParams();
  const { user } = useContext(UserContext);

  const [project, setProject] = useState(null);
  const [hasRequested, setHasRequested] = useState(false);
  const [isCollaborator, setIsCollaborator] = useState(false);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    url: "",
    collaboration: "open",
  });

  const isAuthor = user?._id === project?.author?._id;

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axios.get(`/api/projects/${projectId}`, {
          withCredentials: true,
        });
        setProject(res.data);

        const userId = user?._id;

        if (res.data.pendingRequests?.includes(userId)) {
          setHasRequested(true);
        }

        if (res.data.collaborators?.some((c) => c._id === userId)) {
          setIsCollaborator(true);
        }

        if (userId === res.data.author._id) {
          setEditForm({
            title: res.data.title,
            description: res.data.description,
            url: res.data.url || "",
            collaboration: res.data.collaboration || "open",
          });

          const reqRes = await axios.get(
            `/api/projects/${projectId}/requests`,
            { withCredentials: true }
          );
          setPendingRequests(reqRes.data.pendingRequests);
        }

        setLoading(false);
      } catch (err) {
        console.error("Failed to load project:", err);
        toast.error("Could not load project details.");
      }
    };

    if (user) fetchProject();
  }, [projectId, user]);

  const handleRequest = async () => {
    try {
      await axios.post(
        `/api/projects/${projectId}/request`,
        {},
        { withCredentials: true }
      );
      toast.success("Collaboration request sent!");
      setHasRequested(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send request");
    }
  };

  const respondToRequest = async (targetUserId, accept) => {
    try {
      await axios.post(
        `/api/projects/${projectId}/respond`,
        { targetUserId, accept },
        { withCredentials: true }
      );

      setPendingRequests((prev) =>
        prev.filter((user) => user._id !== targetUserId)
      );

      toast.success(accept ? "Request accepted!" : "Request rejected");
    } catch (err) {
      toast.error("Failed to respond to request");
    }
  };

  const handleUpdate = async () => {
    try {
      const res = await axios.put(
        `/api/projects/update/${projectId}`,
        editForm,
        { withCredentials: true }
      );
      setProject(res.data);
      toast.success("Project updated!");
      setEditMode(false);
    } catch (err) {
      toast.error("Update failed.");
    }
  };

  if (loading || !project) {
    return (
      <Typography sx={{ mt: 10, textAlign: "center" }}>
        Loading project...
      </Typography>
    );
  }

  return (
    <Box sx={{ px: 4, py: 6 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        {project.title}
      </Typography>

      <Grid2 container spacing={4}>
        {/* Left: Project Info */}
        <Grid2>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            {project.img && (
              <Box
                component="img"
                src={project.img}
                alt="Project Visual"
                sx={{
                  width: "100%",
                  height: 200,
                  objectFit: "cover",
                  borderRadius: 2,
                  mb: 2,
                }}
              />
            )}

            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <Avatar src={project.author.avatar} />
              <Typography variant="subtitle1">
                By <strong>{project.author.username}</strong>
              </Typography>
            </Box>

            <Typography variant="body1" sx={{ mb: 2 }}>
              {project.description}
            </Typography>

            {project.url && (isAuthor || isCollaborator) && (
              <Typography variant="body2" sx={{ mb: 2 }}>
                <strong>Project URL:</strong>{" "}
                <a
                  href={
                    project.url.startsWith("http")
                      ? project.url
                      : `https://${project.url}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#1976d2" }}
                >
                  {project.url}
                </a>
              </Typography>
            )}

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 2 }}
            >
              Collaboration: {project.collaboration}
            </Typography>

            {!isAuthor && !isCollaborator && (
              <Button
                variant="contained"
                disabled={hasRequested || project.collaboration === "closed"}
                onClick={handleRequest}
                fullWidth
                sx={{
                  backgroundColor:
                    project.collaboration === "closed"
                      ? "grey.400"
                      : undefined,
                  color:
                    project.collaboration === "closed"
                      ? "text.disabled"
                      : undefined,
                  cursor:
                    project.collaboration === "closed"
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                {project.collaboration === "closed"
                  ? "Collaboration Closed"
                  : hasRequested
                  ? "Request Sent"
                  : "Request to Collaborate"}
              </Button>
            )}

            {isCollaborator && (
              <Typography sx={{ mt: 2 }} color="success.main">
                You are a collaborator on this project.
              </Typography>
            )}

            {isAuthor && (
              <Button
                variant="outlined"
                sx={{ mt: 2 }}
                onClick={() => setEditMode((prev) => !prev)}
                fullWidth
              >
                {editMode ? "Cancel Edit" : "Edit Project"}
              </Button>
            )}

            {editMode && (
              <Box
                sx={{
                  mt: 3,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <TextField
                  label="Title"
                  fullWidth
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm({ ...editForm, title: e.target.value })
                  }
                />
                <TextField
                  label="Description"
                  fullWidth
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                />
                <TextField
                  label="Project URL"
                  fullWidth
                  value={editForm.url}
                  onChange={(e) =>
                    setEditForm({ ...editForm, url: e.target.value })
                  }
                />
                <TextField
                  label="Collaboration"
                  select
                  fullWidth
                  value={editForm.collaboration}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      collaboration: e.target.value,
                    })
                  }
                >
                  <MenuItem value="open">Open</MenuItem>
                  <MenuItem value="closed">Closed</MenuItem>
                </TextField>
                <Button variant="contained" onClick={handleUpdate}>
                  Save Changes
                </Button>
              </Box>
            )}
          </Paper>
        </Grid2>

        {/* Right: Collaboration Requests (Author Only) */}
        {isAuthor && (
          <Grid2>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" gutterBottom>
                Pending Collaboration Requests
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {pendingRequests.length === 0 ? (
                <Typography>No pending requests.</Typography>
              ) : (
                pendingRequests.map((reqUser) => (
                  <Box
                    key={reqUser._id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 2,
                    }}
                  >
                    <Avatar src={reqUser.avatar} />
                    <Typography sx={{ flexGrow: 1 }}>
                      {reqUser.username}
                    </Typography>
                    <Button
                      size="small"
                      variant="outlined"
                      color="success"
                      onClick={() => respondToRequest(reqUser._id, true)}
                    >
                      Accept
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      onClick={() => respondToRequest(reqUser._id, false)}
                    >
                      Reject
                    </Button>
                  </Box>
                ))
              )}
            </Paper>
          </Grid2>
        )}
      </Grid2>
    </Box>
  );
}