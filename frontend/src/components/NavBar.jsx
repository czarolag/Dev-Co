import { useState, useContext } from "react";
import { UserContext } from "../context/userContext";
import { useSignOut } from "./useSignOut";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import MenuIcon from "@mui/icons-material/Menu";
import Avatar from '@mui/material/Avatar';

// Icons: https://mui.com/material-ui/material-icons/?srsltid=AfmBOopscKMr7OOpKhG7p-_XJkQi4WN3bO0-XQZxrrwpyZe6wH9AH63f
import AccountCircle from "@mui/icons-material/AccountCircle";
import TagFacesIcon from "@mui/icons-material/TagFaces"
import AddchartIcon from '@mui/icons-material/Addchart';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';
import StartIcon from '@mui/icons-material/Start';
import InfoIcon from '@mui/icons-material/Info';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import CloseIcon from '@mui/icons-material/Close';
import LoginIcon from '@mui/icons-material/Login';
import SensorOccupiedIcon from '@mui/icons-material/SensorOccupied';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';


function NavBar() {
    // Track if left or right sidebar is open
    const [leftOpen, setLeftOpen] = useState(false);
    const [rightOpen, setRightOpen] = useState(false);
    const { user } = useContext(UserContext); // get user from context
    const signOut = useSignOut();

    return (
        <>
            <AppBar>
                <Toolbar>
                    {/* Left Sidebar Trigger */}
                    <IconButton edge="start" onClick={() => setLeftOpen(true)}>
                        <MenuIcon />
                    </IconButton>

                    <Typography variant="h6" sx={{ flexGrow: 1 }} />
        
                    {/* Right Sidebar Trigger */}
                    <Avatar edge="end" onClick={() => setRightOpen(true)} sx={{ '&:hover': { cursor: 'pointer' }, outline: "solid" }}>
                        <AccountCircle />
                    </Avatar>
                </Toolbar>
            </AppBar>


            {/* Left Sidebar */}
            <Drawer
                anchor="left"
                open={leftOpen}
                onClose={() => setLeftOpen(false)}
                slotProps={{
                    paper: {
                        sx: {
                            width: 250,
                            borderTopRightRadius: 16,
                            borderBottomRightRadius: 16,
                        },
                    },
                }}
            >
                <Box sx={{ p: 2 }}>
                    <List>
                        <ListItemButton href="/" onClick={() => setLeftOpen(false)}>
                            <HomeIcon sx={{ marginRight: 2 }} />
                            <ListItemText primary="Home" />
                        </ListItemButton>

                        {/* If the user is signed in, display */}
                        {user && (
                            <>
                                <ListItemButton href="/getting-started" onClick={() => setLeftOpen(false)}>
                                    <StartIcon sx={{ marginRight: 2 }} />
                                    <ListItemText primary="Getting Started" />
                                </ListItemButton>
                            </>
                        )}

                        <ListItemButton href="/about" onClick={() => setLeftOpen(false)}>
                            <InfoIcon sx={{ marginRight: 2 }} />
                            <ListItemText primary="About" />
                        </ListItemButton>
                        <ListItemButton href="/contact" onClick={() => setLeftOpen(false)}>
                            <ContactMailIcon sx={{ marginRight: 2 }} />
                            <ListItemText primary="Contact" />
                        </ListItemButton>
                    </List>
                </Box>
            </Drawer>


            {/* Right Sidebar */}
            <Drawer
                anchor="right"
                open={rightOpen}
                onClose={() => setRightOpen(false)}
                slotProps={{
                    paper: {
                        sx: {
                            width: 250,
                            borderTopLeftRadius: 16,
                            borderBottomLeftRadius: 16,
                        },
                    },
                }}
            >
                <Box sx={{ p: 2 }}>
                    <List>
                        <ListItem>
                            <Avatar sx={{ marginRight: 2 }} />
                            <ListItemText>{user ? user.username : "Guest"}</ListItemText>
                            <CloseIcon sx={{ marginRight: 2, '&:hover': { cursor: 'pointer' } }} button onClick={() => setRightOpen(false)} />
                        </ListItem>
                        <Divider />

                        {!user && (
                            <>
                              <ListItemButton href="/login" onClick={() => setLeftOpen(false)}>
                                    <LoginIcon sx={{ marginRight: 2 }} />
                                    <ListItemText primary="Login" />
                                </ListItemButton>
                                <ListItemButton href="/signup" onClick={() => setLeftOpen(false)}>
                                    <SensorOccupiedIcon sx={{ marginRight: 2 }} />
                                    <ListItemText primary="Sign Up" />
                                </ListItemButton>

                            </>
                        )}

                        {user && (
                            <>
                                <ListItemButton href="/profile/me" onClick={() => setLeftOpen(false)}>
                                    <AccountCircle sx={{ marginRight: 2 }} />
                                    <ListItemText primary="Your Profile" />
                                </ListItemButton>
                                <Divider />
                                <ListItemButton href="/upload" onClick={() => setLeftOpen(false)}>
                                    <CloudUploadIcon sx={{ marginRight: 2 }} />
                                    <ListItemText primary="Upload" />
                                </ListItemButton>
                                <ListItemButton href="/explore" onClick={() => setLeftOpen(false)}>
                                    <TravelExploreIcon sx={{ marginRight: 2 }} />
                                    <ListItemText primary="Explore" />
                                </ListItemButton>
                                <Divider />
                                <ListItemButton onClick={() => {
                                    setLeftOpen(false);
                                    signOut();
                                }}>
                                    <LogoutIcon sx={{ marginRight: 2 }} />
                                    <ListItemText primary="Sign out" />
                                </ListItemButton>
                            </>
                        )}

                    </List>
                </Box>
            </Drawer>
        </>
    );
}

export default NavBar;