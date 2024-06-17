import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, List, ListItem, ListItemText, IconButton, Divider, Paper, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PaymentIcon from "@mui/icons-material/Payment";
import { format } from "date-fns";

const ViewOrders = () => {
    const { tableId } = useParams();
    const [orderDetails, setOrderDetails] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const navigate = useNavigate();

    const fetchCompletedOrders = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/orders');
            const completedOrders = response.data.filter(order => order.status === 'completed' && order.tableId === parseInt(tableId));

            const allOrderDetails = completedOrders.flatMap(order => order.orderDetails);

            // Grouping order details by product name
            const groupedDetails = allOrderDetails.reduce((acc, detail) => {
                const existing = acc.find(item => item.productName === detail.productName);
                if (existing) {
                    existing.quantity += detail.quantity;
                    existing.totalPrice += detail.price * detail.quantity;
                } else {
                    acc.push({ ...detail, totalPrice: detail.price * detail.quantity });
                }
                return acc;
            }, []);

            setOrderDetails(groupedDetails);

            const total = completedOrders.reduce((acc, order) => acc + order.totalPrice, 0);
            setTotalPrice(total);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    useEffect(() => {
        fetchCompletedOrders();
        const interval = setInterval(fetchCompletedOrders, 20000);

        return () => clearInterval(interval);
    }, [tableId]);

    const formatPrice = (price) => {
        return price.toFixed(2).replace('.', ',') + '€';
    };

    const handleOrderClick = () => {
        axios.get('http://localhost:8080/api/orders')
            .then(response => {
                const completedOrders = response.data.filter(order => order.status === 'completed' && order.tableId === parseInt(tableId));
                const updatePromises = completedOrders.map(order =>
                    axios.patch(`http://localhost:8080/api/orders/${order.orderId}/status`, { status: 'paid' })
                );
                Promise.all(updatePromises)
                    .then(results => {
                        console.log('Orders updated successfully:', results);
                        // Refresh the orders to exclude paid orders
                        navigate('/chef');
                    })
                    .catch(error => {
                        console.error('Error updating orders:', error);
                    });
            })
            .catch(error => {
                console.error('Error fetching orders:', error);
            });
    };

    const handleOpenConfirmDialog = () => {
        setConfirmDialogOpen(true);
    };

    const handleCloseConfirmDialog = () => {
        setConfirmDialogOpen(false);
    };

    const handleConfirmPay = () => {
        handleOrderClick();
        setConfirmDialogOpen(false);
    };

    return (
        <Box sx={{ padding: 4, bgcolor: '#f0f4f8', minHeight: '88vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Paper sx={{ padding: 2, mb: 2, display: 'flex', alignItems: 'center', bgcolor: '#1976d2', color: 'white' }}>
                <IconButton onClick={() => navigate(-1)} sx={{ color: 'white' }}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h4" component="h1" sx={{ ml: 2, flexGrow: 1 }}>
                    Orders for Table {tableId}
                </Typography>
            </Paper>
            <Paper sx={{ padding: 2, flexGrow: 1 }}>
                <List>
                    {orderDetails.map((detail, index) => (
                        <React.Fragment key={detail.productId}>
                            <ListItem>
                                <ListItemText
                                    primary={`${detail.quantity}x ${detail.productName}`}
                                    secondary={`${formatPrice(detail.price)}`}
                                    primaryTypographyProps={{ fontWeight: 'bold', fontSize: '1.2rem' }}
                                    secondaryTypographyProps={{ fontSize: '1rem' }}
                                />
                                <Typography variant="body1" sx={{ marginLeft: 'auto', fontWeight: 'bold', fontSize: '1.2rem' }}>
                                    {formatPrice(detail.totalPrice)}
                                </Typography>
                            </ListItem>
                            {index < orderDetails.length - 1 && <Divider />}
                        </React.Fragment>
                    ))}
                </List>
                <Typography variant="h6" component="h2" sx={{ mt: 2, textAlign: 'right', fontWeight: 'bold', color: '#ff4a4a' }}>
                    Price: {formatPrice(totalPrice)}
                </Typography>
            </Paper>
            <Button
                variant="contained"
                color="error"
                onClick={handleOpenConfirmDialog}
                sx={{ width: '100%', height: '50px', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 2, alignSelf: 'center' }}
            >
                <PaymentIcon sx={{ mr: 1 }} />
                Pay
            </Button>
            <Dialog
                open={confirmDialogOpen}
                onClose={handleCloseConfirmDialog}
            >
                <DialogTitle>Confirm Payment</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to mark this table as paid?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirmDialog}>Cancel</Button>
                    <Button onClick={handleConfirmPay} color="error">Confirm</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ViewOrders;
