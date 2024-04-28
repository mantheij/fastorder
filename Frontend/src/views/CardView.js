import React, { useState, useEffect } from "react";
import axios from 'axios';
import {
    Container, Grid, Card, CardActionArea, CardContent,
    CardMedia, Typography, CardActions, Tabs, Tab,
    Button, Fab, Badge, Snackbar, Alert
} from "@mui/material";
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';

const CardView = () => {
    const [drinks, setDrinks] = useState([]);
    const [value, setValue] = useState(0);
    const [cart, setCart] = useState([]);
    const [alertOpen, setAlertOpen] = useState(false);

    useEffect(() => {
        axios.get("http://localhost:8080/api/products")  // URL geändert, um Ihre Angabe zu reflektieren
            .then(response => setDrinks(response.data))
            .catch(error => console.error("Error loading the products:", error));
    }, []);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleAddToCart = (drink) => {
        setCart(prev => [...prev, drink]);
        setAlertOpen(true);
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
            return drinks.filter(drinks => drink.categoryId === 2);
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
                            <CardActionArea>
                                <CardMedia
                                    component="img"
                                    height="150"
                                    image="/placeholder.jpg"  // Fügt einen Platzhalter hinzu
                                    alt={drink.name}
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                        {drink.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Price: ${drink.price}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button onClick={() => handleAddToCart(drink)}>Add to Cart</Button>
                                </CardActions>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Badge badgeContent={cart.length} color="error" anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                   sx={{ position: 'fixed', right: 25, bottom: 95, zIndex: 1 }}>
                <Fab color="primary" aria-label="cart" style={{ position: 'fixed', right: 20, bottom: 50, zIndex: 0 }}>
                    <ShoppingCartOutlinedIcon />
                </Fab>
            </Badge>

            <Snackbar open={alertOpen} autoHideDuration={6000} onClose={() => handleCloseAlert('timeout')}>
                <Alert onClose={() => handleCloseAlert('timeout')} severity="success" sx={{ width: '100%' }}>
                    Added drink to cart
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default CardView;
