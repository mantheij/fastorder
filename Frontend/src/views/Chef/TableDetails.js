import React from "react";
import { Button, Box, IconButton, Typography, Paper } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PaymentIcon from '@mui/icons-material/Payment';

const TableDetails = () => {
    const navigate = useNavigate();
    const { tableId } = useParams();

    const handleOrderClick = () => {
        navigate(`/product/${tableId}`);
    };

    const handleViewOrdersClick = () => {
        navigate(`viewOrders/`);
    };

    const handlePayClick = () => {

        console.log('Zahlen Button Clicked');
    };

    return (
        <Box sx={{ padding: 4, bgcolor: '#f0f4f8', minHeight: '90vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Paper sx={{ width: '100%', maxWidth: 600, padding: 2, mb: 2, display: 'flex', alignItems: 'center', bgcolor: '#1976d2', color: 'white', boxSizing: 'border-box' }}>
                <IconButton onClick={() => navigate(-1)} sx={{ color: 'white' }}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h4" component="h1" sx={{ ml: 2, flexGrow: 1 }}>
                    Table {tableId}
                </Typography>
            </Paper>
            <Paper sx={{ width: '100%', maxWidth: 600, padding: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, boxSizing: 'border-box' }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleOrderClick}
                    sx={{ width: '100%', height: '50px', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}
                >
                    <ShoppingCartIcon sx={{ mr: 1 }} />
                    Order
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleViewOrdersClick}
                    sx={{ width: '100%', height: '50px', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}
                >
                    <VisibilityIcon sx={{ mr: 1 }} />
                    View
                </Button>
                <Button
                    variant="contained"
                    color="error"
                    onClick={handlePayClick}
                    sx={{ width: '100%', height: '50px', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}
                >
                    <PaymentIcon sx={{ mr: 1 }} />
                    Pay
                </Button>
            </Paper>
        </Box>
    );
};

export default TableDetails;