import React, { useState, useEffect } from 'react';
import { Grid, Typography, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle }
    from '@mui/material';
import useEmployeeController from '../../controller/EmployeeController';
import { createTheme } from '@mui/material/styles';
import { blue } from '@mui/material/colors';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import RestoreIcon from '@mui/icons-material/Restore';
import config from '../../config'

const ClockBar = ({ currentTime }) => {
    return (
        <Box sx={{ background: "linear-gradient(to top, #0383E2, #5DADF0)", height: '56px', width: '100%', position:
                'fixed', top: 0, left: 0, zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="h5" align="center" sx={{ color: 'white', textShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)' }}>
                    {currentTime.toLocaleTimeString()}
                </Typography>
                <Typography variant="subtitle1" align="center" sx={{ color: 'white', textShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)', marginLeft: 1 }}>
                    {currentTime.toLocaleDateString()}
                </Typography>
            </Box>
        </Box>
    );
};

const CompletedOrdersView = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [dialogOpen, setDialogOpen] = useState(false);
    const [actionIndex, setActionIndex] = useState(null);
    const { boxes, setBoxes } = useEmployeeController();
    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const fetchCompletedOrders = async () => {
            try {
                const response = await axios.get(`${config.apiBaseUrl}/api/orders`);
                const completedOrders = response.data
                    .filter(order => order.status === 'completed' || order.status === 'payed')
                    .map(order => ({
                        orderStatus: order.status,
                        tableNumber: order.tableId,
                        orderId: order.orderId,
                        orderTime: `${format(new Date(order.datetime), 'HH:mm')} Uhr`,
                        orderDate: `${format(new Date(order.datetime), 'dd.MM.yyyy')}`,
                        text: order.orderDetails.map(detail => `-(x${detail.quantity}) ${detail.productName} 
                        ${detail.productSize}`).join('<br/>')
                    }));
                setBoxes(completedOrders);
            } catch (error) {
                console.error('Error loading completed orders:', error);
            }
        };

        fetchCompletedOrders();
        const interval = setInterval(fetchCompletedOrders, 20000);

        return () => clearInterval(interval);
    }, [setBoxes]);

    const theme = createTheme({
        palette: {
            primary: {
                light: blue[300],
                main: blue[500],
                dark: blue[700],
                darker: blue[900],
            }
        },
    });

    const handleDialogOpen = (index) => {
        setActionIndex(index);
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setActionIndex(null);
    };

    const handleAction = () => {
        if (actionIndex !== null) {
            const orderId = boxes[actionIndex].orderId;
            const newStatus = 'open';
            axios.patch(`http://localhost:8080/api/orders/${orderId}/status`, { status: newStatus })
                .then(response => {
                    console.log('PATCH erfolgreich:', response.data);
                    setBoxes(prevBoxes => prevBoxes.filter((_, i) => i !== actionIndex));
                })
                .catch(error => {
                    console.error('Fehler beim PATCH:', error);
                });
            setDialogOpen(false);
            setActionIndex(null);
        }
    };

    return (
        <div style={{ paddingBottom: '56px', minHeight: 'calc(100vh - 56px)', overflowY: 'auto' }}>
            <ClockBar currentTime={currentTime} />

            <Box sx={{display: 'flex', justifyContent: 'center', marginTop: '70px' }}>
                <Button variant="contained" color="primary" onClick={() => navigate('/orders')} sx={{background: "linear-gradient(to top, #0383E2, #5DADF0)"}}>
                    Back
                </Button>
            </Box>

            <Box style={{ marginTop: '30px' }}>
                <Grid container spacing={2} justifyContent="center">
                    {boxes.length === 0 ? (
                        <Typography variant="h6" align="center" sx={{ marginTop: '20px' }}>
                            No completed orders
                        </Typography>
                    ) : (
                        boxes.map((item, index) => (
                            <Grid item key={index}>
                                <Box
                                    sx={{
                                        bgcolor: 'white',
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

                                    <Typography variant="h3" gutterBottom sx={{ color: theme.palette.primary.main,
                                        padding: '5px', borderRadius: '4px', textShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)' }}>
                                        {item.tableNumber}</Typography>

                                    <Typography sx={{ fontSize: '0.9rem', marginBottom: '4px', textShadow:
                                            '0px 2px 4px rgba(0, 0, 0, 0.2)' }}>{item.orderTime}</Typography>

                                    <Typography sx={{ fontSize: '0.9rem', marginBottom: '8px', textShadow:
                                            '0px 2px 4px rgba(0, 0, 0, 0.2)' }}>{item.orderDate}</Typography>

                                    <Typography dangerouslySetInnerHTML={{ __html: item.text }} sx={{ textShadow:
                                            '0px 2px 4px rgba(0, 0, 0, 0.2)' }} />

                                    <Button variant="contained" color="primary" size="small"    style={{ minWidth: '30px',
                                        minHeight: '30px', padding: '5px', background: "linear-gradient(to top, #0383E2, #5DADF0)" }} onClick={() => handleDialogOpen(index)}>
                                        <RestoreIcon/>
                                    </Button>
                                </Box>
                            </Grid>
                        ))
                    )}
                </Grid>
            </Box>

            <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <DialogTitle>Confirmation</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to reopen this order?
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

export default CompletedOrdersView;
