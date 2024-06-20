
import React from 'react';
import { Box, Typography } from '@mui/material';

const ClockBar = ({ currentTime }) => {
    return (
        <Box sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            zIndex: 1000,
        }}>
            <Box sx={{
                background: '#20a9fa',
                height: '60px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="h3" align="center"
                                sx={{ color: 'white', fontWeight: 'bold', textShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)' }}>
                        {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </Typography>
                    <Typography variant="h5" align="center"
                                sx={{ color: 'white', fontWeight: 'bold', textShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)', marginLeft: 2 }}>
                        {currentTime.toLocaleDateString()}
                    </Typography>
                </Box>
            </Box>
            <Box sx={{
                background: '#aadef8',
                height: '5px',
                width: '100%',
            }} />
        </Box>
    );
};

export default ClockBar;
