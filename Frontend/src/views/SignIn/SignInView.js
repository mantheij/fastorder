import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LockIcon from '@mui/icons-material/Lock';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import config from '../../config';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function SignInView({ onButtonClick }) {
    const navigate = useNavigate();
    const [showLogin, setShowLogin] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const handleGuestLogin = () => {
        onButtonClick("guest");
        navigate("/table-selection");
    };

    const handleLogin = async () => {
        if (!username || !password) {
            setError("Both fields are required");
            setOpenSnackbar(true);
            return;
        }
        try {
            const response = await axios.post(`${config.apiBaseUrl}/api/auth/signin`,
                { username, password },
                { timeout: 5000 } // Set timeout to 5 seconds
            );
            if (response.status === 200) {
                const role = response.data.roles.includes("ROLE_ADMIN") ? "admin" : "employee";
                onButtonClick(role);
                navigate(role === "admin" ? "/chef" : "/orders");
            }
        } catch (error) {
            if (error.response) {
                setError("Invalid credentials");
            } else if (error.request) {
                setError("No connection to the server");
            } else {
                setError("An unknown error occurred");
            }
            setOpenSnackbar(true);
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    position: 'relative',
                }}
            >
                <IconButton
                    color="primary"
                    aria-label="login as employee/admin"
                    onClick={() => setShowLogin(!showLogin)}
                    sx={{ position: 'absolute', top: 0, right: 0 }}
                >
                    <LockIcon />
                </IconButton>
                <Typography component="h1" variant="h5">
                    Sign In
                </Typography>
                <Box component="form" onSubmit={(e) => e.preventDefault()} sx={{ mt: 1 }}>
                    {showLogin ? (
                        <>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                name="username"
                                autoComplete="username"
                                autoFocus
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <Button
                                type="button"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                onClick={handleLogin}
                            >
                                Login
                            </Button>
                            <Grid container justifyContent="center">
                                <Grid item>
                                    <Link href="#" variant="body2" onClick={() => setShowLogin(false)}>
                                        Login as Guest
                                    </Link>
                                </Grid>
                            </Grid>
                        </>
                    ) : (
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            sx={{ mt: 3, mb: 2 }}
                            onClick={handleGuestLogin}
                        >
                            Login as Guest
                        </Button>
                    )}
                </Box>
            </Box>
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="error">
                    {error}
                </Alert>
            </Snackbar>
        </Container>
    );
}

export default SignInView;
