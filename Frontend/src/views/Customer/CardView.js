import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import {
    List,
    ListItem,
    ListItemText,
    IconButton,
    ListItemAvatar,
    Avatar,
    Button,
    Snackbar,
    Alert,
    Box,
    Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { loadCartFromCookies, saveCartToCookies, removeCartFromCookies } from './utils';
import config from "../../config";

const CardView = () => {
    const { tableId } = useParams();
    const [cart, setCart] = useState(loadCartFromCookies(tableId));
    const navigate = useNavigate();
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');

    const handleCloseAlert = () => {
        setAlertOpen(false);
    };

    const handleRemoveFromCart = (index) => {
        const newCart = [...cart];
        newCart.splice(index, 1);
        setCart(newCart);
        saveCartToCookies(tableId, newCart);
    };

    const handleBackClick = () => {
        navigate(`/product/${tableId}`);
    };

    const handleCreateOrder = async () => {
        try {
            const orderDetails = cart.map(item => ({
                quantity: item.quantity,
                product: {
                    productId: item.productId,
                },
                price: item.price, // Preis des Produkts hinzufügen
                productName: item.name // Name des Produkts hinzufügen
            }));
            console.log(orderDetails)

            const orderData = {
                orderDetails,
                tableId: tableId
            };

            const authToken = Cookies.get('authToken');

            // Prüfen Sie die Verfügbarkeit der Produkte
            const checkAvailabilityPromises = cart.map(item =>
                axios.get(`${config.apiBaseUrl}/api/products/${item.productId}`, {
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                })
            );

            const availabilityResponses = await Promise.all(checkAvailabilityPromises);
            const isAvailable = availabilityResponses.every((response, index) =>
                response.data.quantity >= cart[index].quantity
            );

            if (!isAvailable) {
                setAlertMessage('One or more items are out of stock');
                setAlertSeverity('error');
                setAlertOpen(true);
                return;
            }

            // Bestellung erstellen
            await axios.post(`${config.apiBaseUrl}/api/orders`, orderData, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });

            // Produktmengen im Backend aktualisieren
            const updateProductQuantityPromises = cart.map(item => {
                const productData = availabilityResponses.find(response => response.data.productId === item.productId).data;
                const newQuantity = productData.quantity - item.quantity;

                return axios.put(`${config.apiBaseUrl}/api/products/${item.productId}`, {
                    name: productData.name,
                    price: productData.price,
                    imgName: productData.imgName,
                    quantity: newQuantity,
                    productCategoryId: productData.categoryId,
                    size: productData.size // Hier sicherstellen, dass die Größe korrekt ist
                }, {
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                });
            });

            await Promise.all(updateProductQuantityPromises);

            setAlertMessage('Order created successfully');
            setAlertSeverity('success');
            setAlertOpen(true);
            setCart([]);
            removeCartFromCookies(tableId);
            navigate(`/product/${tableId}`);
        } catch (error) {
            console.error('Error creating order:', error);
            setAlertMessage('Failed to create order');
            setAlertSeverity('error');
            setAlertOpen(true);
        }
    };

    const calculateTotalCost = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2).replace('.', ',');
    };

    return (
        <div>
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10}}>
                <Button startIcon={<ArrowBackIcon/>} onClick={handleBackClick}
                        style={{marginTop: '6px', marginLeft: '24px'}}>
                    Back
                </Button>
            </div>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                maxWidth: '1200px',
                marginLeft: 'auto',
                marginRight: 'auto',
                width: '100%'
            }}>
            <Box style={{ width: '100%' }}>
                    <Typography variant="h5" component="div" style={{ marginBottom: '16px' }}>
                        Total Cost: {calculateTotalCost()}€
                    </Typography>
                    <List style={{ width: '100%' }}>
                        {cart.length > 0 ? (
                            cart.map((item, index) => (
                                <ListItem key={index} sx={{ padding: '16px' }}>
                                    <ListItemAvatar>
                                        <Avatar src={`${item.imgName}`} alt={item.name} sx={{ width: 80, height: 80 }} />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={<Typography variant="h6">{`${item.name} - ${item.size}`}</Typography>}
                                        secondary={
                                            <React.Fragment>
                                                <Typography variant="body1">Quantity: {item.quantity}, Price: {item.price.toFixed(2).replace('.', ',')}€</Typography>
                                                {item.extras && <Typography variant="body2">Extras: {item.extras}</Typography>}
                                            </React.Fragment>
                                        }
                                    />
                                    <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveFromCart(index)}  sx={{ marginRight: 2 }}>
                                        <DeleteIcon />
                                    </IconButton>
                                </ListItem>
                            ))
                        ) : (
                            <ListItem>
                                <ListItemText primary="Your cart is empty" />
                            </ListItem>
                        )}
                    </List>
                    <Snackbar
                        open={alertOpen}
                        autoHideDuration={6000}
                        onClose={handleCloseAlert}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                    >
                        <Alert severity={alertSeverity} sx={{ width: '100%' }}>
                            {alertMessage}
                        </Alert>
                    </Snackbar>
                </Box>
            </div>
            {cart.length > 0 && (
                <Button variant="contained" color="primary" onClick={handleCreateOrder} sx={{ marginTop: '16px', fontSize: '1.2rem', padding: '10px 20px' }}>
                    Order Now
                </Button>
            )}
        </div>
    );
};

export default CardView;
