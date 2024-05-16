import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import {List, ListItem, ListItemText, IconButton, ListItemAvatar, Avatar, Button, Snackbar, Alert} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import {useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';

const CardView = () => {
    const { tableId } = useParams();
    const [cart, setCart] = useState([]);
    const navigate = useNavigate();
    const [alertOpen, setAlertOpen] = useState(false); // Zustand für Snackbar (Benachrichtigung)
    const [alertMessage, setAlertMessage] = useState(''); // Zustand für Nachricht der Snackbar
    const [alertSeverity, setAlertSeverity] = useState('success'); // Zustand für Schweregrad der Snackbar-Nachricht

    const handleCloseAlert = () => {
        setAlertOpen(false);
    };


    useEffect(() => {
        const loadedCart = Cookies.get('cart');
        if (loadedCart) {
            setCart(JSON.parse(loadedCart));
        }
    }, []);

    const handleRemoveFromCart = (index) => {
        const newCart = [...cart];
        newCart.splice(index, 1);
        setCart(newCart);
        Cookies.set('cart', JSON.stringify(newCart), { expires: 7 });
    };

    const handleBackClick = () => {
        navigate(`/product/${tableId}`);
    };

    const handleCreateOrder = () => {
        const orderDetails = cart.map(item => ({
            quantity: item.quantity,
            product: {
                productId: item.productId // Passen Sie dies entsprechend Ihrer Produkt-ID-Struktur an
            }
        }));

        const orderData = {
            orderDetails,
            tableId: tableId // Setzen Sie die Tisch-ID entsprechend Ihrem Anwendungsfall
        };

        axios.post('http://localhost:8080/api/orders', orderData)
            .then(response => {
                console.log('Order created successfully:', response.data);
                setAlertMessage('Order created successfully');
                setAlertSeverity('success');
                setAlertOpen(true);
                navigate('/product/${tableId}');
                setCart([]); // Leeren Sie den Warenkorb
                Cookies.remove('cart'); // Entfernen Sie den Warenkorb-Cookie
            })
            .catch(error => {
                console.error('Error creating order:', error);
                setAlertMessage('Failed to create order');
                setAlertSeverity('error');
                setAlertOpen(true);
            });
    };

    return (
        <div>
            <div style={{ display: "flex" }}>
                <IconButton onClick={handleBackClick} aria-label="back" style={{ marginLeft: 0 }}>
                    <ArrowBackIosIcon />
                    back
                </IconButton>
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
                <List style={{ width: '100%' }}>
                    {cart.length > 0 ? (
                        cart.map((item, index) => (
                            <ListItem key={index}>
                                <ListItemAvatar>
                                    <Avatar src={`${item.imgName}`} alt={item.name} />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={`${item.name} - ${item.size}`}
                                    secondary={
                                        <React.Fragment>
                                            <div>Quantity: {item.quantity}, Price: ${item.price}</div>
                                            {item.extras && <div>Extras: {item.extras}</div>}
                                        </React.Fragment>
                                    }
                                />
                                <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveFromCart(index)}>
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
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} // Position der Snackbar
                >
                    <Alert severity={alertSeverity} sx={{ width: '100%' }}>
                        {alertMessage}
                    </Alert>
                </Snackbar>
            </div>
            {cart.length > 0 && (
                <Button variant="contained" color="primary" onClick={handleCreateOrder}>
                    Order Now
                </Button>
            )}
        </div>

    );
};

export default CardView;