import AppTheme from './shared-theme/AppTheme';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from "react-hot-toast";
import { UserContextProvider } from './context/userContext';
import axios from "axios";
import CssBaseline from "@mui/material/CssBaseline";
import ColorModeSelect from './shared-theme/ColorModeSelect';
import Login from "./pages/Login"
import SignUp from "./pages/SignUp";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import "./App.css";

// set up axios
axios.defaults.baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";
axios.defaults.withCredentials = true;


function App(props) {
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <ColorModeSelect sx={{ position: 'fixed', bottom: '1rem', right: '1rem' }} />
      <UserContextProvider>
        <Router>
          <header>
            <NavBar />
            <Toaster position='bottom-left' toastOptions={{ duration: 3000 }} />
          </header>
          <main>
            <Routes>
              <Route path='/signup' element={<SignUp />} />
              <Route path='/Login' element={<Login />} />
              <Route path='/' element={<Home />} />
            </Routes>
          </main>
        </Router>
      </UserContextProvider>
    </AppTheme>
  )
};

export default App;
