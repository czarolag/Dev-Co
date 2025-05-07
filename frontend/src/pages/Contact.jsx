import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from 'axios';

export default function Contact() {
    const handleSubmit = async(event) => {
        return null;
    }
    /*
    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        try {
            await axios.post('/api/send-email', {
                name: data.get('name'),
                email: data.get('email'),
                message: data.get('message'),
            });
            alert('Message sent successfully!');
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Failed to send message.');
        }
    };
    */

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                gap: 4,
            }}
        >
            {/* Display SVGs */}
            <Box sx={{ display: 'flex', gap: 2 }}>
                <img src="/devCo-loblolly-icon.svg" alt="Loblolly Icon" width="450" />
            </Box>

            {/* Contact Form */}
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    maxWidth: 400,
                    width: '100%',
                }}
            >
                <TextField name="name" label="Name" fullWidth required />
                <TextField name="email" label="Email" type="email" fullWidth required />
                <TextField name="message" label="Message" fullWidth required />
                <Button type="submit" variant="contained">
                    Send
                </Button>
            </Box>
        </Box>
    );
}