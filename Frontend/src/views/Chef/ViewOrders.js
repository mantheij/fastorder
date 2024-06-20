import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, List, ListItem, ListItemText, IconButton, Divider, Paper, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar, FormControlLabel, Switch, Grid } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PaymentIcon from "@mui/icons-material/Payment";
import config from "../../config";
import { useTables } from "../../model/TablesContext";
import { updateOrdersToPaid } from "./updateOrdersToPaid";

const ViewOrders = () => {
    const { tableId } = useParams();
    const [orderDetails, setOrderDetails] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [showWarning, setShowWarning] = useState(false);
    const [showPaidOrders, setShowPaidOrders] = useState(false);
    const navigate = useNavigate();
    const { tables } = useTables();

    const table = tables.find(t => t.tableId === parseInt(tableId));

    const fetchOrders = async (status) => {
        try {
            const response = await axios.get(`${config.apiBaseUrl}/api/orders`);
            const orders = response.data.filter(order => order.status === status && order.tableId === parseInt(tableId));

            const allOrderDetails = orders.flatMap(order => order.orderDetails);

            setOrderDetails(allOrderDetails);

            const total = orders.reduce((acc, order) => acc + order.totalPrice, 0);
            setTotalPrice(total);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    useEffect(() => {
        fetchOrders(showPaidOrders ? 'paid' : 'completed');
        const interval = setInterval(() => {
            fetchOrders(showPaidOrders ? 'paid' : 'completed');
        }, 20000);

        return () => clearInterval(interval);
    }, [tableId, showPaidOrders]);

    const formatPrice = (price) => {
        return price.toFixed(2).replace('.', ',') + '€';
    };

    const handleOpenConfirmDialog = () => {
        setConfirmDialogOpen(true);
    };

    const handleCloseConfirmDialog = () => {
        setConfirmDialogOpen(false);
    };

    const handleConfirmPay = () => {
        updateOrdersToPaid(tableId, navigate);
        setConfirmDialogOpen(false);
    };

    const handlePayClick = () => {
        if (showWarning) {
            handleOpenConfirmDialog();
        } else {
            setShowWarning(true);
        }
    };

    const handleCloseWarning = () => {
        setShowWarning(false);
    };

    const handleTogglePaidOrders = () => {
        setShowPaidOrders(!showPaidOrders);
    };

    const isArea2 = table && table.area === 2;
    const getBackgroundColor = () => {
        return isArea2 ? '#388E3C' : '#1976d2';
    };

    const getScreenBackgroundColor = () => {
        return isArea2 ? '#E0F2F1' : '#f0f4f8';
    };

    return (
        <Box sx={{ padding: 4, bgcolor: getScreenBackgroundColor(), minHeight: '88vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
            <Paper sx={{ padding: 2, mb: 2, display: 'flex', alignItems: 'center', bgcolor: getBackgroundColor(), color: 'white', width: '100%', maxWidth: 700 }}>
                <IconButton onClick={() => navigate(-1)} sx={{ color: 'white' }}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h4" component="h1" sx={{ ml: 2, flexGrow: 1 }}>
                    Orders for Table {tableId}
                </Typography>
            </Paper>
            <Paper sx={{ padding: 2, flexGrow: 1, width: '100%', maxWidth: 700 }}>
                <List>
                    {orderDetails.map((detail, index) => (
                        <React.Fragment key={detail.orderDetailId}>
                            <ListItem>
                                <ListItemText
                                    primary={`${detail.quantity}x ${detail.productName} (${detail.productSize})`}
                                    secondary={`${formatPrice(detail.price / detail.quantity)}`}
                                    primaryTypographyProps={{ fontWeight: 'bold', fontSize: '1.2rem', color: showPaidOrders ? 'rgba(0,0,0,0.5)' : 'rgba(0, 0, 0, 1)' }}
                                    secondaryTypographyProps={{ fontSize: '1rem', color: showPaidOrders ? 'rgba(0,0,0,0.5)' : 'rgba(0, 0, 0, 1)' }}
                                />
                                <Typography variant="body1" sx={{ marginLeft: 'auto', fontWeight: 'bold', fontSize: '1.2rem', color: showPaidOrders ? 'rgba(0,0,0,0.5)' : 'rgba(0, 0, 0, 1)' }}>
                                    {formatPrice(detail.price)}
                                </Typography>
                            </ListItem>
                            {index < orderDetails.length - 1 && <Divider />}
                        </React.Fragment>
                    ))}
                </List>
                <Typography variant="h6" component="h2" sx={{ mt: 2, textAlign: 'right', fontWeight: 'bold', color: showPaidOrders ? 'rgba(255,74,74,0.5)' : 'rgb(255,74,74)'  }}>
                    Price: {formatPrice(totalPrice)}
                </Typography>
            </Paper>
            <Grid container justifyContent="center" alignItems="center" sx={{ mt: 2 }}>
                <FormControlLabel
                    control={
                        <Switch
                            checked={showPaidOrders}
                            onChange={handleTogglePaidOrders}
                            color="primary"
                        />
                    }
                    label="Show Paid Orders"
                />
            </Grid>
            <Button
                variant="contained"
                sx={{
                    width: '100%',
                    maxWidth: 700,
                    height: '50px',
                    fontSize: '1.2rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1,
                    mt: 2,
                    backgroundColor: "#ff4a4a",
                    '&:hover': {
                        backgroundColor: "#ff4a4a",
                        opacity: 0.9
                    }
                }}
                onClick={handlePayClick}
            >
                <PaymentIcon sx={{ mr: 1 }} />
                Pay
            </Button>
            <Snackbar
                open={showWarning}
                autoHideDuration={6000}
                onClose={handleCloseWarning}
                message="Press 'Pay' again to confirm payment."
                action={
                    <Button color="inherit" size="small" onClick={handleCloseWarning}>
                        OK
                    </Button>
                }
            />
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
