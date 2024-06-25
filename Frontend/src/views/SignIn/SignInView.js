import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
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
        <div style={{
            padding: 0,
            margin: 0,
            width: '100vw',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: "linear-gradient(to top, #0383E2, #5DADF0)",
            position: 'relative'
        }}>
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '92%',
                backgroundImage: "url('/background2.png')",
                backgroundRepeat: 'repeat',
                opacity: 0.06,
                zIndex: 1
            }}></div>
            <div style={{
                position: 'relative',
                zIndex: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%'
            }}>
                <Container component="main" maxWidth="xs">
                    <Box
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            position: 'relative',
                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                            padding: 4,
                            borderRadius: 2,
                            boxShadow: 3,
                        }}
                    >
                        <img src="/logo.png" alt="Logo" style={{ width: 100, marginBottom: 20 }} />
                        <h1 style={{ color: "rgba(10,9,8,0.89)" }}>Sign In</h1>
                        <IconButton
                            color="primary"
                            aria-label="login as employee/admin"
                            onClick={() => setShowLogin(!showLogin)}
                            sx={{ position: 'absolute', top: 16, right: 16 }}
                        >
                            <LockIcon />
                        </IconButton>
                        <Box component="form" onSubmit={(e) => e.preventDefault()} sx={{ mt: 1, width: '100%' }}>
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
            </div>
        </div>
    );
}

export default SignInView;
