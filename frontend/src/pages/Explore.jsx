import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import ListSubheader from '@mui/material/ListSubheader';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import { Box } from '@mui/material'

export default function Explore() {
  return (
    <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
      <ImageListItem key="Subheader" cols={2}></ImageListItem>
      <ImageList sx={{ width: 800, height: 600 }} cols={3} rowHeight={200}>
      {itemData.map((item) => (
        <ImageListItem key={item.img}>
          <img
            srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
            src={`${item.img}?w=248&fit=crop&auto=format`}
            alt={item.title}
            loading="lazy"
            style={{ height: '200px', objectFit: 'cover' }}
          />
          <ImageListItemBar
            title={item.title}
            subtitle={item.author}
            actionIcon={
              <IconButton
                sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                aria-label={`info about ${item.title}`}
              >
                <InfoIcon />
              </IconButton>
            }
          />
        </ImageListItem>
      ))}
    </ImageList>
    </Box>
  );
}

const itemData = [
  {
    img: 'https://marketplace.canva.com/EAFwckKNjDE/2/0/1600w/canva-black-white-grayscale-portfolio-presentation-vzScEqAI__M.jpg',
    title: 'Portfolio',
    author: '@coder1',
  },
  {
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSSpjETeEZpF4OFQax6zfNV8FZIDB4GnbPJg&s',
    title: 'To-do List',
    author: '@coder2',
  },
  {
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQn-AuH6lPBYdF6WhKHV8K1uKf2MSddW1hoAA&s',
    title: 'Chat ai',
    author: '@coder3',
  },
  {
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJd6tIrqyz0C3Quc9ohvlqK6DhvTXO2gJKQA&s',
    title: 'Tic-Tac-Toe',
    author: '@coder4',
  },
  {
    img: 'https://images.squarespace-cdn.com/content/v1/63b2fdbe4376de5bfdc6771f/1734555685631-WEMYRS2UKX7LJATX5746/snake_game_digitalartsblog2.png',
    title: 'Snake',
    author: '@coder5',
  },
  {
    img: 'https://meta-q.cdn.bubble.io/f1728217081503x991160207508808000/Screenshot%202024-10-06%20at%208.17.48%E2%80%AFAM.png',
    title: 'Calculator',
    author: '@coder6',
  },
  {
    img: 'https://play-lh.googleusercontent.com/DSKDcSklyWlPfiayJmYO_VEy4FrX8_3QqMwft15LkckAtc2udGqH8YyeBdCGYMFDVA',
    title: 'Countdown Timer',
    author: '@coder7',
  },
  {
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThxKA7HvO10GTQBbTTroY57QxgaI-W6kfyUw&s',
    title: 'Weather app',
    author: '@coder8',
  },
  {
    img: 'https://images.chesscomfiles.com/uploads/v1/images_users/tiny_mce/alexandermatos/phpv8c15W.png',
    title: 'Chess',
    author: '@coder9',
  },
  {
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRM4lShuGq_x_T7RydCJH5xrf7BkXxlDFlnw&s',
    title: 'Library management',
    author: '@coder10',
  },
];