import React, { useState, useEffect } from 'react';
import { Grid, Typography, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, CircularProgress } from '@mui/material';
import useEmployeeController from '../controller/EmployeeController';
import { createTheme } from '@mui/material/styles';
import { blue, green, red } from '@mui/material/colors';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
// import io from 'socket.io-client';  // For real-time updates

/**
 * Displays the current time in a fixed header bar.
 * @param {Object} props - React props
 * @param {Date} props.currentTime - The current time to display
 */
const ClockBar = ({ currentTime }) => {
    return (
        <Box sx={{ background: "linear-gradient(to top, #0383E2, #5DADF0)", height: '56px', width: '100%', position: 'fixed', top: 0, left: 0, zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Typography variant="h5" align="center" sx={{ color: 'white', textShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)' }}>
                {currentTime.toLocaleTimeString()}
            </Typography>
        </Box>
    );
};

/**
 * The EmployeeView component manages the display and interactions for employee orders.
 */
const EmployeeView = () => {
    /**
     * State to manage the current time for the clock bar.
     */
    const [currentTime, setCurrentTime] = useState(new Date());

    /**
     * State to manage the visibility of the confirmation dialog.
     */
    const [dialogOpen, setDialogOpen] = useState(false);

    /**
     * State to manage the index of the order being acted upon.
     */
    const [actionIndex, setActionIndex] = useState(null);

    /**
     * State to manage the type of action being confirmed ('delete' or 'cancel').
     */
    const [actionType, setActionType] = useState(null);

    /**
     * State to manage the visibility of the progress spinner.
     */
    const [progressVisible, setProgressVisible] = useState(false);

    /**
     * State to manage the list of order boxes.
     */
    const { boxes, addOrder, deleteBox, toggleInProgress, cancelOrder, setBoxes } = useEmployeeController();

    /**
     * State to manage the audio for notifications.
     */
    const [audio] = useState(new Audio('/audio/iphone_14_notification.mp3')); // Pfad relativ zum public-Verzeichnis

    /**
     * State to track if the user has interacted with the page.
     */
    const [userInteracted, setUserInteracted] = useState(false);

    /**
     * Effect to handle user interaction.
     */
    useEffect(() => {
        const handleUserInteraction = () => {
            setUserInteracted(true);
            window.removeEventListener('click', handleUserInteraction);
        };

        window.addEventListener('click', handleUserInteraction);

        return () => {
            window.removeEventListener('click', handleUserInteraction);
        };
    }, []);

    /**
     * Preload the audio file to reduce delay.
     */
    useEffect(() => {
        audio.load();
    }, [audio]);

    /**
     * Effect to update the current time every second.
     */
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    /**
     * Effect to fetch orders from the server every 20 seconds.
     * Includes notification logic to alert the user of new orders.
     */
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                // Check and request notification permission
                if (Notification.permission !== 'granted') {
                    Notification.requestPermission();
                }

                const response = await axios.get('http://localhost:8080/api/orders/open');
                const orders = response.data.map(order => ({
                    tableNumber: order.tableId,
                    orderTime: order.datetime,
                    text: order.orderDetails.map(detail => `-${detail.productName} (x${detail.quantity})`).join('<br/>')
                }));

                if (orders.length > boxes.length) { // Check if there are new orders
                    if (userInteracted) {
                        audio.play();
                    }
                    if (Notification.permission === 'granted') {
                        new Notification('New Order', { body: 'You have new orders' });
                    } else if (Notification.permission !== 'denied') {
                        Notification.requestPermission().then(permission => {
                            if (permission === 'granted') {
                                new Notification('New Order', { body: 'You have new orders' });
                                audio.play(); // Ensure the sound is played after the permission is granted
                            }
                        });
                    }
                }

                setBoxes(orders);
            } catch (error) {
                if (axios.isCancel(error)) {
                    console.log('Request canceled:', error.message);
                } else {
                    console.error('Error loading orders:', error);
                }
            }
        };

        fetchOrders();
        const interval = setInterval(fetchOrders, 20000);  // Refresh orders every 20 seconds

        return () => clearInterval(interval);
    }, [setBoxes, boxes, audio, userInteracted]);

    /**
     * Effect to handle real-time updates using WebSocket (currently commented out).
     */
    /*
    useEffect(() => {
        const socket = io('http://localhost:8080');  // Connect to the server via WebSocket
        socket.on('newOrder', (order) => {
            // Add the new order to the boxes state
            setBoxes(prevBoxes => [...prevBoxes, {
                tableNumber: order.tableId,
                orderTime: order.datetime,
                text: order.orderDetails.map(detail => `-${detail.productName} (x${detail.quantity})`).join('<br/>')
            }]);
            // Show push notification with sound
            if (userInteracted) {
                audio.play();
            }
            if (Notification.permission === 'granted') {
                new Notification('New Order', { body: `New order from table ${order.tableId}` });
            }
        });

        // Request notification permission on component mount
        if (Notification.permission !== 'granted') {
            Notification.requestPermission();
        }

        return () => {
            socket.disconnect();
        };
    }, [audio, setBoxes, userInteracted]);
    */

    /**
     * Opens the confirmation dialog.
     * @param {number} index - The index of the order being acted upon
     * @param {string} type - The type of action ('delete' or 'cancel')
     */
    const handleDialogOpen = (index, type) => {
        setActionIndex(index);
        setActionType(type);
        setDialogOpen(true);
    };

    /**
     * Closes the confirmation dialog.
     */
    const handleDialogClose = () => {
        setDialogOpen(false);
        setActionIndex(null);
        setActionType(null);
    };

    /**
     * Handles the action confirmed in the dialog (delete or cancel).
     */
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

    /**
     * Toggles the visibility of the progress spinner.
     */
    const toggleProgressVisibility = () => {
        setProgressVisible(!progressVisible);
    };

    const theme = createTheme({
        palette: {
            primary: {
                light: blue[300],
                main: blue[500],
                dark: blue[700],
                darker: blue[900],
            },
            green: {
                light: green[300],
                main: green[500],
            },
            red: {
                light: red[300],
                main: red[500],
            },
            grey: {
                dark: '#333333',
                hover: '#666666',
            },
        },
    });

    return (
        <div style={{ paddingBottom: '56px', minHeight: 'calc(100vh - 56px)', overflowY: 'auto' }}>
            <ClockBar currentTime={currentTime} />

            <Box style={{ marginTop: '56px' }}>
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
                                    marginTop: '5px',
                                    wordWrap: 'break-word',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    maxWidth: '100%',
                                    boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.16)'
                                }}>

                                <Typography variant="h3" gutterBottom sx={{ color: theme.palette.primary.main, padding: '5px', borderRadius: '4px', textShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)' }}>
                                    {item.tableNumber}</Typography>

                                <Typography sx={{ fontSize: '0.9rem', marginBottom: '8px', textShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)' }}>{item.orderTime}</Typography>

                                <Typography dangerouslySetInnerHTML={{ __html: item.text }} sx={{ textShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)' }} />

                                <Box sx={{ marginTop: '20px' }}>
                                    <Button variant="contained" size="small" onClick={() => handleDialogOpen(index, 'delete')} sx={{ color: theme.palette.green.main, bgcolor: item.inProgress ? 'lightgrey' : 'white', border: `2px solid ${theme.palette.green.main}`, '&:hover': { bgcolor: theme.palette.green.light } }}><CheckIcon /></Button>

                                    <Button variant="contained" size="small" onClick={() => { toggleInProgress(index); toggleProgressVisibility(); }} sx={{ marginLeft: '8px', marginRight: '8px', color: 'black', bgcolor: item.inProgress ? 'lightgrey' : 'white', border: '2px solid black', '&:hover': { bgcolor: 'lightgrey' } }}>
                                        {item.inProgress ? (
                                            <CircularProgress size={20} sx={{ color: 'black' }} />) : (<AccessTimeIcon />)}
                                    </Button>

                                    <Button variant="contained" size="small" onClick={() => handleDialogOpen(index, 'cancel')} sx={{ color: theme.palette.red.main, bgcolor: item.inProgress ? 'lightgrey' : 'white', border: `2px solid ${theme.palette.red.main}`, '&:hover': { bgcolor: theme.palette.red.light } }}><CloseIcon /></Button>
                                </Box>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <DialogTitle>Confirmation</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {actionType === 'delete' ? 'Are you sure this order is completed?' :
                            'Are you sure you want to cancel this order?'}
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
