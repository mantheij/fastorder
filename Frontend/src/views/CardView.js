import React, { useState, useEffect } from "react";
import axios from 'axios';
import {
    Container, Grid, Card, CardActionArea, CardContent,
    CardMedia, Typography, CardActions, Tabs, Tab,
    Button, Fab, Badge, Snackbar, Alert,
    Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemText, Select, MenuItem
} from "@mui/material";
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';

const CardView = () => {
    const [drinks, setDrinks] = useState([]);
    const [value, setValue] = useState(0);
    const [cart, setCart] = useState([]);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedSizes, setSelectedSizes] = useState({}); // State für ausgewählte Größen

    useEffect(() => {
        axios.get("http://localhost:8080/api/products")
            .then(response => setDrinks(response.data))
            .catch(error => console.error("Error loading the products:", error));
    }, []);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleAddToCart = (drink) => {
        setCart(prev => [...prev, drink]);
        setAlertMessage('Added drink to cart');
        setAlertSeverity('success');
        setAlertOpen(true);
    };

    const handleDrinkChange = (drink) => {
        if (!selectedSizes[drink.id]) {
            setSelectedSizes({ ...selectedSizes, [drink.id]: "" });
        }
    };

    const handleSizeChange = (event, drinkId) => {
        setSelectedSizes({ ...selectedSizes, [drinkId]: event.target.value });
    };

    const handleOpenDialog = () => setOpenDialog(true);
    const handleCloseDialog = () => setOpenDialog(false);

    const handleOrderNow = async () => {
        try {
            const response = await axios.post('http://localhost:8080/api/orders', { items: cart });
            console.log('Order response:', response);
            setAlertMessage('Order placed successfully!');
            setAlertSeverity('success');
            setCart([]);
            setOpenDialog(false);
        } catch (error) {
            console.error('Error placing order:', error);
            setAlertMessage('Failed to place order.');
            setAlertSeverity('error');
        } finally {
            setAlertOpen(true);
        }
    };

    const handleCloseAlert = (reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAlertOpen(false);
    };

    const filteredDrinks = (category) => {
        if (category === 0) {
            return drinks;
        } else if (category === 1) {
            return drinks.filter(drink => drink.categoryId === 1);
        } else if (category === 2) {
            return drinks.filter(drink => drink.categoryId === 2);
        }
        return [];
    };

    return (
        <Container maxWidth={false}>
            <Tabs value={value} onChange={handleChange} centered>
                <Tab label="All Drinks"/>
                <Tab label="Non-Alcoholic"/>
                <Tab label="Wine"/>
                <Tab label="Sparkling Wine"/>
                <Tab label="Cocktails"/>
            </Tabs>
            <Grid container spacing={2}>
                {filteredDrinks(value).map((drink) => (
                    <Grid item xs={12} sm={6} md={3} key={drink.productId}>
                        <Card>
                            <CardActionArea onClick={() => handleDrinkChange(drink)}>
                                <CardMedia
                                    component="img"
                                    height="150"
                                    image="/placeholder.jpg"
                                    alt={drink.name}
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                        {drink.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Price: ${drink.price}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">

                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Select
                                        value={selectedSizes[drink.id] || ""}
                                        onChange={(e) => handleSizeChange(e, drink.id)}
                                        disabled={selectedSizes[drink.id] === undefined}
                                    >
                                        {drink.size && drink.size.map((size) => (
                                            <MenuItem key={size} value={size}>
                                                {size}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    <Button onClick={() => handleAddToCart(drink)} disabled={!selectedSizes[drink.id]}>Add to Cart</Button>
                                </CardActions>
                            </CardActionArea>

                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Badge badgeContent={cart.length} color="error" anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                   sx={{ position: 'fixed', right: 25, bottom: 95, zIndex: 1 }}>
                <Fab color="primary" aria-label="cart" style={{ position: 'fixed', right: 20, bottom: 50, zIndex: 0 }} onClick={handleOpenDialog}>
                    <ShoppingCartOutlinedIcon />
                </Fab>
            </Badge>

            <Dialog open={openDialog} onClose={handleCloseDialog} aria-labelledby="cart-dialog-title">
                <DialogTitle id="cart-dialog-title">Your Cart</DialogTitle>
                <DialogContent>
                    <List>
                        {cart.map((item, index) => (
                            <ListItem key={index}>
                                <ListItemText primary={item.name} secondary={`Price: $${item.price}`} />
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Close</Button>
                    <Button onClick={handleOrderNow} color="primary" variant="contained">Order Now</Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleCloseAlert}>
                <Alert onClose={handleCloseAlert} severity={alertSeverity} sx={{ width: '100%' }}>
                    {alertMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default CardView;
