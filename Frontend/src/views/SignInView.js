import React, { useState } from 'react';
import { Typography, Box, Button, TextField, Snackbar } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { blue } from '@mui/material/colors';

const SignInView = () => {
    // State variables
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);

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
    const handleSignIn = (e) => {
        e.preventDefault();
        if (username === '' || password === '') {
            setOpenSnackbar(true);
            return;
        }
        // Implement sign in logic here
        console.log('Username:', username);
        console.log('Password:', password);
    };

    // Close Snackbar
    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <div style={{ padding: '20px', minHeight: 'calc(100vh - 56px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="h3" gutterBottom sx={{ color: theme.palette.primary.main, marginBottom: '20px', WebkitTextStroke: '1px black', fontWeight: 'bold' }}>Sign In</Typography>
            <Box
                component="form"
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '25ch' },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                noValidate
                autoComplete="off"
                onSubmit={handleSignIn}
            >
                <TextField
                    id="username"
                    label="Username"
                    variant="outlined"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <TextField
                    id="password"
                    label="Password"
                    type="password"
                    variant="outlined"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <Button variant="contained" size="large" type="submit" sx={{ marginTop: '10px', backgroundColor: theme.palette.primary.main }}>Sign In</Button>
            </Box>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                message="Please fill in all fields."
            />
        </div>
    );
};

export default SignInView;
