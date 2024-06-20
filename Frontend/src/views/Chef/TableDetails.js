import React, { useState } from "react";
import { Button, Box, IconButton, Typography, Paper, Snackbar } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PaymentIcon from '@mui/icons-material/Payment';
import { useTables } from "../../model/TablesContext";
import { updateOrdersToPaid } from "./updateOrdersToPaid";

const TableDetails = () => {
    const navigate = useNavigate();
    const { tableId } = useParams();
    const { tables } = useTables();
    const [showWarning, setShowWarning] = useState(false);

    const table = tables.find(t => t.tableId === parseInt(tableId));

    const handleOrderClick = () => {
        navigate(`/product/${tableId}`);
    };

    const handleViewOrdersClick = () => {
        navigate(`viewOrders/`);
    };

    const handlePayClick = () => {
        if (showWarning) {
            updateOrdersToPaid(tableId, navigate);
        } else {
            setShowWarning(true);
        }
    };

    const handleCloseWarning = () => {
        setShowWarning(false);
    };

    const isArea2 = table && table.area === 2;
    const getBackgroundColor = () => {
        return isArea2 ? '#388E3C' : '#1976d2';
    };

    const getScreenBackgroundColor = () => {
        return isArea2 ? '#E0F2F1' : '#f0f4f8';
    };

    const buttonStyles = {
        width: '100%',
        height: '60px',
        fontSize: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
    };

    return (
        <Box sx={{ padding: 4, bgcolor: getScreenBackgroundColor(), minHeight: '90vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Paper sx={{ width: '100%', maxWidth: 700, padding: 3, mb: 3, display: 'flex', alignItems: 'center', bgcolor: getBackgroundColor(), color: 'white', boxSizing: 'border-box' }}>
                <IconButton onClick={() => navigate(-1)} sx={{ color: 'white' }}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h3" component="h1" sx={{ ml: 3, flexGrow: 1 }}>
                    Table {tableId}
                </Typography>
            </Paper>
            <Paper sx={{ width: '100%', maxWidth: 700, padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, boxSizing: 'border-box' }}>
                <Button
                    variant="contained"
                    sx={{
                        ...buttonStyles,
                        backgroundColor: getBackgroundColor(),
                        '&:hover': {
                            backgroundColor: getBackgroundColor(),
                            opacity: 0.9
                        }
                    }}
                    onClick={handleOrderClick}
                >
                    <ShoppingCartIcon sx={{ mr: 1 }} />
                    Order
                </Button>
                <Button
                    variant="contained"
                    sx={{
                        ...buttonStyles,
                        backgroundColor: '#8c4aff',
                        '&:hover': {
                            backgroundColor: '#8c4aff',
                            opacity: 0.9
                        }
                    }}
                    onClick={handleViewOrdersClick}
                >
                    <VisibilityIcon sx={{ mr: 1 }} />
                    View
                </Button>
                <Button
                    variant="contained"
                    sx={{
                        ...buttonStyles,
                        backgroundColor: '#ff4a4a',
                        '&:hover': {
                            backgroundColor: '#ff4a4a',
                            opacity: 0.9
                        }
                    }}
                    onClick={handlePayClick}
                >
                    <PaymentIcon sx={{ mr: 1 }} />
                    Pay
                </Button>
            </Paper>
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
        </Box>
    );
};

export default TableDetails;
