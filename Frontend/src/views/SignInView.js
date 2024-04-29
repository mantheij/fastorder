import React, { useState } from 'react';
import { Typography, Box, Button, TextField } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { blue } from '@mui/material/colors';

const SignInView = () => {
    // State variables
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // MUI theme customization
    const theme = createTheme({
        palette: {
            primary: {
                light: blue[300],
                main: blue[500],
                dark: blue[700],
                darker: blue[900],
            },
        },
    });

    // Handle sign in
    const handleSignIn = () => {
        // Implement sign in logic here
        console.log('Username:', username);
        console.log('Password:', password);
    };

    return (
        <div style={{ padding: '20px', minHeight: 'calc(100vh - 56px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="h3" gutterBottom sx={{ color: theme.palette.primary.main, marginBottom: '20px', WebkitTextStroke: '1px black', fontWeight: 'bold' }}>Anmelden</Typography>
            <Box
                component="form"
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
                onSubmit={handleSignIn}
            >
                <TextField
                    id="username"
                    label="Benutzername"
                    variant="outlined"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <TextField
                    id="password"
                    label="Passwort"
                    type="password"
                    variant="outlined"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <Button variant="contained" size="large" type="submit" sx={{ marginTop: '10px', backgroundColor: theme.palette.primary.main }}>Anmelden</Button>
            </Box>
        </div>
    );
};

export default SignInView;
