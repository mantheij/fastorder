import React from 'react';
import { Button, Box, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
/**
 * The Settings component provides a button to navigate to the Product Settings page.
 */
const Settings = () => {
    /**
     * useNavigate hook from react-router-dom to programmatically navigate to different routes.
     */
    const navigate = useNavigate();

    /**
     * Handles the navigation to the Product Settings page.
     */
    const handleNavigateToProductSettings = () => {
        navigate('/settings/product');
    };
    const handleNavigateToEmployee = () => {
        navigate('/settings/employee');
    };

    return (
        <Box sx={{ padding: 4, bgcolor: '#f0f4f8', minHeight: '90vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Paper sx={{ padding: 4, width: '100%', maxWidth: 600, textAlign: 'center', mt: 2 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Settings
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNavigateToProductSettings}
                    sx={{ mt: 2, width: '100%', height: '50px', fontSize: '1.2rem' }}
                >
                    Product Settings
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNavigateToEmployee}
                    sx={{ mt: 2, width: '100%', height: '50px', fontSize: '1.2rem' }}
                >
                    Employee Settings
                </Button>
            </Paper>
        </Box>
    );
}

export default Settings;