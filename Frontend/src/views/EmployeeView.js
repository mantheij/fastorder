import React, { useState, useEffect } from 'react';
import { Grid, Typography, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import useEmployeeController from '../controller/EmployeeController';
import { createTheme } from '@mui/material/styles';
import { blue } from '@mui/material/colors';

const EmployeeView = () => {
    // State variables
    const [currentTime, setCurrentTime] = useState(new Date());
    const [dialogOpen, setDialogOpen] = useState(false);
    const [actionIndex, setActionIndex] = useState(null);
    const [actionType, setActionType] = useState(null);
    const { boxes, addOrder, deleteBox, toggleInProgress, cancelOrder } = useEmployeeController();

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

    // Update current time every second
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Open dialog for confirmation
    const handleDialogOpen = (index, type) => {
        setActionIndex(index);
        setActionType(type);
        setDialogOpen(true);
    };

    // Close dialog
    const handleDialogClose = () => {
        setDialogOpen(false);
        setActionIndex(null);
        setActionType(null);
    };

    // Execute action based on selected index
    const handleAction = () => {
        if (actionIndex !== null && actionType !== null) {
            if (actionType === 'delete') {
                deleteBox(actionIndex);
            } else if (actionType === 'cancel') {
                cancelOrder(actionIndex);
            }
            setDialogOpen(false);
            setActionIndex(null);
            setActionType(null);
        }
    };

    return (
        <div style={{ paddingBottom: '56px', minHeight: 'calc(100vh - 56px)', overflowY: 'auto' }}>
            {/* Display current time */}
            <Typography variant="h5" align="center" gutterBottom>
                {currentTime.toLocaleTimeString()}
            </Typography>

            {/* Button for testing, will be removed later */}
            <Typography>
                <Button onClick={() => addOrder(5, "-Cola (250ml) x3<br>-Fanta (250ml) x1")}>Add Order</Button>
            </Typography>

            {/* Grid to display orders */}
            <Grid container spacing={2} justifyContent="center">
                {boxes.map((item, index) => (
                    <Grid item key={index}>
                        <Box
                            sx={{
                                bgcolor: item.inProgress ? 'lightgrey' : 'white',
                                color: 'black',
                                textAlign: 'center',
                                padding: '10px',
                                borderRadius: '8px',
                                border: '1px solid black',
                                wordWrap: 'break-word',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                maxWidth: '100%',
                            }}
                        >
                            {/* Display table number */}
                            <Typography variant="h3" gutterBottom sx={{ color: theme.palette.primary.main, WebkitTextStroke: '1px black', padding: '5px', borderRadius: '4px' }}>{item.tableNumber}</Typography>

                            {/* Display timestamp */}
                            <Typography sx={{ fontSize: '0.9rem', marginBottom: '8px' }}>{item.timestamp}</Typography>

                            {/* Display order details */}
                            <Typography dangerouslySetInnerHTML={{ __html: item.text }} />

                            {/* Buttons for managing orders */}
                            <Box sx={{ marginTop: '20px' }}>
                                <Button variant="contained" size="small" onClick={() => handleDialogOpen(index, 'delete')}>Done</Button>
                                <Button variant="contained" size="small" onClick={() => toggleInProgress(index)} sx={{ marginLeft: '8px', marginRight: '8px' }}>
                                    {item.inProgress ? 'In work' : 'In work'}
                                </Button>
                                <Button variant="contained" size="small" onClick={() => handleDialogOpen(index, 'cancel')}>Cancel</Button>
                            </Box>
                        </Box>
                    </Grid>
                ))}
            </Grid>

            {/* Dialog for confirmation */}
            <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <DialogTitle>Confirmation</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {actionType === 'delete' ? 'Are you sure you want to remove this Order?' : 'Are you sure you want to cancel this Order?'}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleAction}>Yes</Button>
                    <Button onClick={handleDialogClose}>No</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default EmployeeView;
