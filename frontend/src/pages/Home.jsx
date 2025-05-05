import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Paper from '@mui/material/Paper';
import Projects from "../components/Projects"


function Home() {
  
  return (
    <>
        <Box sx= {{ marginBottom: 10, paddingTop: 8, paddingBottom: 0 }}>
          <Typography
            variant="h2"
            align="center"
            color="text.primary"
            gutterBottom
          >
            Dev-Co
          </Typography>
          <Typography
            variant="h6"
            align="center"
            color="text.secondary"
          >
           Upload your projects for others to see or explore projects that other people have posted.
          </Typography>
        </Box>
        <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center','& > *': {m: 10,},}}>
          <ButtonGroup size="large" aria-label="Upload/Explore" variant="contained">
            <Button>Upload</Button>
            <Button href='/Explore'>Explore</Button>
          </ButtonGroup>
        </Box>
        <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center','& > *': {m: 1,},}}>
          <Projects/>
        </Box>
    </>
  );
}

export default Home;