import React from 'react';
import { Button } from '@mui/material';
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

    return (
        <div>
            <h1>Settings</h1>
            <Button variant="contained" onClick={handleNavigateToProductSettings}>
                Product Settings
            </Button>
        </div>
    );
}

export default Settings;