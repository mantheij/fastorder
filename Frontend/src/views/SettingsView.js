import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
    const navigate = useNavigate();

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