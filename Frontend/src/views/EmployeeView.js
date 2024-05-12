import React, { useState, useEffect } from 'react';
import { Grid, Typography, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, CircularProgress } from '@mui/material';
import useEmployeeController from '../controller/EmployeeController';
import { createTheme } from '@mui/material/styles';
import { blue, green, red } from '@mui/material/colors';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';


const ClockBar = ({ currentTime }) => {
    const theme = createTheme({
        palette: {
            primary: {
                main: blue[500],
            },
        },
    });

    return (
        <Box sx={{ background: 'linear-gradient(to right bottom, #430089, #3da7f6)', height: '56px', width: '100%', position: 'fixed', top: 0, left: 0, zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Typography variant="h5" align="center" sx={{ color: 'white', textShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)' }}>
                {currentTime.toLocaleTimeString()}
            </Typography>
        </Box>
    );
};

const EmployeeView = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [dialogOpen, setDialogOpen] = useState(false);
    const [actionIndex, setActionIndex] = useState(null);
    const [actionType, setActionType] = useState(null);
    const [progressVisible, setProgressVisible] = useState(false); // State for Circular Progress visibility
    const { boxes, addOrder, deleteBox, toggleInProgress, cancelOrder } = useEmployeeController();

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);



    useEffect(() => {
        const fetchOpenOrders = async () => {
            try {
                axios.get('http://localhost:8080/api/orders/open')
                    .then(response =>{
                        handleOpenOrder(response.data)
                    })

                // response.data.forEach(order => {
                //     handleOpenOrder(order);
                // });
            } catch (error) {
                console.error('Error fetching open orders:', error);
            }
        };


        const timer = setInterval(() => {
            handleOpenOrder(fetchOpenOrders())
        }, 5000);

        return () => clearInterval(timer);
    }, [addOrder]);


    //TODO: this
    const handleOpenOrder = (openOrder) => {
        const { tableId, orderDetails } = openOrder;
        const productName = openOrder.orderDetails.productName;
        const quantity = openOrder.orderDetails.quantity;
        const boxContent = orderDetails.map(detail => `- ${productName} x${quantity}`).join('<br>');
        addOrder(tableId, boxContent);
    };


    const handleDialogOpen = (index, type) => {
        setActionIndex(index);
        setActionType(type);
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setActionIndex(null);
        setActionType(null);
    };

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
                <Typography>
                    <Button onClick={() => addOrder(5, "-Cola (250ml) x3<br>-Fanta (250ml) x1")}>Add Order</Button>
                </Typography>

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
                                    wordWrap: 'break-word',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    maxWidth: '100%',
                                    boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.16)'
                                }}
                            >
                                <Typography variant="h3" gutterBottom sx={{ color: theme.palette.primary.main,
                                    padding: '5px', borderRadius: '4px', textShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)' }}>
                                    {item.tableNumber}</Typography>
                                <Typography sx={{ fontSize: '0.9rem', marginBottom: '8px', textShadow:
                                        '0px 2px 4px rgba(0, 0, 0, 0.2)' }}>{item.timestamp}</Typography>
                                <Typography dangerouslySetInnerHTML={{ __html: item.text }} sx={{ textShadow:
                                        '0px 2px 4px rgba(0, 0, 0, 0.2)' }} />
                                <Box sx={{ marginTop: '20px' }}>
                                    <Button variant="contained" size="small" onClick={() => handleDialogOpen(index,
                                        'delete')} sx={{ color: theme.palette.green.main, bgcolor: item.inProgress ? 'lightgrey' : 'white',
                                        border: `2px solid ${theme.palette.green.main}`, '&:hover':
                                            { bgcolor: theme.palette.green.light } }}><CheckIcon /></Button>
                                    <Button variant="contained" size="small" onClick={() => {toggleInProgress(index);
                                        toggleProgressVisibility();}} sx={{ marginLeft: '8px', marginRight: '8px',
                                        color: 'black', bgcolor: item.inProgress ? 'lightgrey' : 'white',
                                        border: '2px solid black', '&:hover': { bgcolor: 'lightgrey' } }}>
                                        { item.inProgress ? (
                                            <CircularProgress size={20} sx={{ color: 'black' }} />
                                        ) : (
                                            <AccessTimeIcon />
                                        )}
                                    </Button>
                                    <Button variant="contained" size="small" onClick={() => handleDialogOpen(index, 'cancel')}
                                            sx={{ color: theme.palette.red.main, bgcolor: item.inProgress ? 'lightgrey' : 'white',
                                                border: `2px solid ${theme.palette.red.main}`, '&:hover':
                                                    { bgcolor: theme.palette.red.light} }}><CloseIcon /></Button>
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
                        {actionType === 'delete' ? 'Are you sure this order is completed?' : 'Are you sure you want to cancel this order?'}
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
