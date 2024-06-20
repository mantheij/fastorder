import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    Typography
} from '@mui/material';
import useEmployeeController from '../../controller/EmployeeController';
import { createTheme } from '@mui/material/styles';
import { blue, green, red } from '@mui/material/colors';
import RestoreIcon from '@mui/icons-material/Restore';
import TableBarIcon from '@mui/icons-material/TableBar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import config from '../../config';

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
                        orderTimeReal: new Date(order.datetime),
                        orderTime: `${format(new Date(order.datetime), 'HH:mm')} Uhr`,
                        orderDate: `${format(new Date(order.datetime), 'dd.MM.yyyy')}`,
                        text: order.orderDetails.map((detail, index) => ({
                            id: `${order.orderId}-${index}`,
                            content: `-(x${detail.quantity}) ${detail.productName} ${detail.productSize}`
                        }))
                    }))
                    .sort((a, b) => a.orderTimeReal - b.orderTimeReal);
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
                light: '#20a9fa',
                main: '#20a9fa',
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
            axios.patch(`${config.apiBaseUrl}/api/orders/${orderId}/status`, { status: newStatus })
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
        <div style={{ paddingBottom: '56px', minHeight: 'calc(100vh - 56px)', overflowY: 'auto', background: '#f0f4f8' }}>
            <ClockBar currentTime={currentTime} />

            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '80px' }}>
                <Button variant="contained" color="primary" onClick={() => navigate('/orders')} sx={{ bgcolor: theme.palette.primary.main }}>
                    Back
                </Button>
            </Box>

            <Box style={{ marginTop: '20px' }}>
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
                                        boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.2)'
                                    }}>

                                    <Typography variant="h3" gutterBottom sx={{
                                        color: theme.palette.primary.main,
                                        padding: '5px',
                                        borderRadius: '4px',
                                        textShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)'
                                    }}>
                                        <Box component="span" sx={{
                                            fontSize: '3rem',
                                            display: 'inline-flex',
                                            position: 'relative',
                                            top: '8px',
                                            padding: '5px',
                                            borderRadius: '4px',
                                        }}>
                                            <TableBarIcon sx={{
                                                fontSize: 'inherit', filter:
                                                    'drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.2))'
                                            }} />
                                        </Box>
                                        {item.tableNumber}</Typography>

                                    <Typography sx={{
                                        fontSize: '0.9rem', marginBottom: '8px', textShadow:
                                            '0px 2px 4px rgba(0, 0, 0, 0.2)'
                                    }}>{item.orderTime}</Typography>

                                    <Typography sx={{
                                        fontSize: '0.7rem', marginBottom: '8px', textShadow:
                                            '0px 2px 4px rgba(0, 0, 0, 0.2)'
                                    }}>{item.orderDate}</Typography>

                                    {item.text.map((product) => (
                                        <Box key={product.id} sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                            <Checkbox
                                                disabled
                                                checked={true}
                                                sx={{ paddingLeft: 0 }}
                                            />
                                            <Typography
                                                sx={{
                                                    textDecoration: 'line-through',
                                                    color: 'rgba(0,0,0,0.5)',
                                                    textShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
                                                    marginLeft: 1
                                                }}
                                                dangerouslySetInnerHTML={{ __html: product.content }}
                                            />
                                        </Box>
                                    ))}

                                    <Box sx={{ marginTop: '20px' }}>
                                        <Button variant="contained" size="small"
                                                onClick={() => handleDialogOpen(index)} sx={{
                                            color: 'white',
                                            bgcolor: theme.palette.primary.main,
                                            '&:hover': { bgcolor: theme.palette.primary.dark }
                                        }}><RestoreIcon /></Button>
                                    </Box>
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
