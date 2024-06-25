import React, { useEffect, useState } from "react";
import axios from 'axios';
import {
    Alert,
    Avatar, Badge,
    Button,
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Container, Dialog, DialogActions, DialogContent, DialogTitle,
    Drawer, Fab,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    MenuItem,
    Select,
    Snackbar, Tab, Tabs,
    TextField,
    Typography,
} from "@mui/material";
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import ContactSupport from '@mui/icons-material/ContactSupport';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

import { useNavigate, useParams } from "react-router-dom";
import {loadCartFromCookies, saveCartToCookies, removeCartFromCookies} from "./utils";
import config from "../../config";

const ProductView = () => {
    const { tableId } = useParams();
    const [drinks, setDrinks] = useState([]);
    const [uniqueDrinks, setUniqueDrinks] = useState([]);
    const [value, setValue] = useState(0);
    const [cart, setCart] = useState([]);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');
    const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState({
        name: '',
        imgName: '',
        availableSizes: [],
        size: '',
        price: 0,
        quantity: 1
    });
    const [openDialog, setOpenDialog] = useState(false);
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const loadedCart = loadCartFromCookies(tableId);
        setCart(loadedCart);
        axios.get(`${config.apiBaseUrl}/api/products`)
            .then(response => {
                setDrinks(response.data);
                setUniqueDrinks(Array.from(new Set(response.data.map(drink => drink.name)))
                    .map(name => response.data.find(drink => drink.name === name)));
            })
            .catch(error => console.error("Error loading the products:", error));
    }, []);

    const handleOpenCardView = () => {
        if (cart.length === 0) {
            setAlertMessage('Your cart is empty');
            setAlertSeverity('error');
            setAlertOpen(true);
        } else {
            navigate(`/product/${tableId}/card`);
        }
    };

    const handleCloseDialog = () => setOpenDialog(false);

    const handleAddToCart = () => {
        if (!selectedProduct.size) {
            setAlertMessage('Please select a size');
            setAlertSeverity('error');
            setAlertOpen(true);
            return;
        }
        console.log(selectedProduct.size)

        const newCart = [...cart, {
            ...selectedProduct,
            imgName: `${selectedProduct.imgName}`,
            size: selectedProduct.size, // Größe hinzufügen
            price: selectedProduct.price, // Preis hinzufügen
            productId: selectedProduct.productId // Stellen Sie sicher, dass productId hinzugefügt wird
        }];
        console.log(newCart)

        setCart(newCart);
        saveCartToCookies(tableId, newCart);
        setAlertMessage('Added drink to cart');
        setAlertSeverity('success');
        setAlertOpen(true);
        setBottomSheetOpen(false);
    };

    const handleOpenBottomSheet = (product) => {
        const productWithImage = {
            ...product,
            imgName: `/images/products/${product.imgName}`
        };
        const availableSizes = drinks.filter(p => p.name === product.name);
        setSelectedProduct({
            ...productWithImage,
            availableSizes,
            size: availableSizes[0]?.size || '', // Setze die erste verfügbare Größe oder eine leere Größe
            price: availableSizes[0]?.price || 0, // Setze den Preis der ersten verfügbaren Größe oder 0
            productId: product.productId, // Stellen Sie sicher, dass productId gesetzt ist
            quantity: 1
        });
        setBottomSheetOpen(true);
    };



    const handleCloseBottomSheet = () => {
        setBottomSheetOpen(false);
    };

    const handleSizeChange = (event) => {
        const newSize = event.target.value;
        const selectedSize = drinks.find(p => p.name === selectedProduct.name && p.size === newSize);

        if (selectedSize) {
            setSelectedProduct(prevProduct => ({
                ...prevProduct,
                size: newSize,
                price: selectedSize.price,
                productId: selectedSize.productId
            }));
        }
    };



    const handleQuantityChange = (increment) => {
        const newQuantity = selectedProduct.quantity + increment;
        if (newQuantity > 0) {
            setSelectedProduct(prevProduct => ({ ...prevProduct, quantity: newQuantity }));
        }
    };


    const handleRemoveFromCart = (index) => {
        const newCart = [...cart];
        newCart.splice(index, 1);
        setCart(newCart);
        saveCartToCookies(tableId, newCart);
        setAlertMessage('Item removed from cart');
        setAlertSeverity('info');
        setAlertOpen(true);
    };

    const renderCartItems = () => {
        if (cart.length === 0) {
            return <ListItem>
                <ListItemText primary="Your cart is empty" />
            </ListItem>;
        }
        return (
            <List>
                {cart.map((item, index) => (
                    <ListItem key={index}>
                        <ListItemAvatar>
                            <Avatar src={`${item.imgName}`} alt={`${item.name} Logo`} />
                        </ListItemAvatar>
                        <ListItemText primary={`${item.name} - ${item.size}`} secondary={`Quantity: ${item.quantity}, Price: €${item.price}`} />
                        <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveFromCart(index)}>
                            <DeleteIcon />
                        </IconButton>
                    </ListItem>
                ))}
            </List>
        );
    };

    const filterDrinks = (drinks) => {
        return drinks.filter(drink => {
            if (!searchQuery) {
                return true;
            }
            return drink.name.toLowerCase().includes(searchQuery.toLowerCase());
        });
    };

    const handleSearchButtonClick = () => {
        setIsSearchVisible(prevState => !prevState);
        handleResetSearch();
    };

    const handleResetSearch = () => {
        setSearchQuery("");
    };

    const handleSearchInputChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredDrinks = filterDrinks(uniqueDrinks);

    const isProductAvailable = (product) => {
        const availableSizes = drinks.filter(p => p.name === product.name && p.quantity > 0);
        return availableSizes.length > 0;
    };

    const handleCallWaiter = () => {
        setAlertMessage('Waiter has been called');
        setAlertSeverity('info');
        setAlertOpen(true);
    };

    return (
        <Container maxWidth={false}>
            <Grid>
                <Tabs value={value} onChange={(event, newValue) => setValue(newValue)} centered>
                    <Tab label="All Drinks" />
                </Tabs>
                <Grid container justifyContent="flex-end" alignItems="center" spacing={2}>
                    <IconButton onClick={handleSearchButtonClick}>
                        <SearchIcon />
                    </IconButton>
                </Grid>
                {isSearchVisible && (
                    <TextField
                        label="Search drinks"
                        variant="outlined"
                        value={searchQuery}
                        onChange={handleSearchInputChange}
                        fullWidth
                        style={{ marginTop: 10, marginBottom: 10 }}
                    />
                )}
            </Grid>
            <Grid container spacing={2}>
                {filteredDrinks.filter(drink => drink.categoryId === value || value === 0).map((drink) => (
                    <Grid item xs={12} sm={6} md={3} key={drink.productId}>
                        <Card>
                            <CardActionArea
                                onClick={() => isProductAvailable(drink) ? handleOpenBottomSheet(drink) : null}
                                disabled={!isProductAvailable(drink)}
                                style={{ opacity: !isProductAvailable(drink) ? 0.5 : 1 }}
                            >
                                <CardMedia
                                    style={{ height: 200, width: '100%', objectFit: 'contain' }}
                                    component="img"
                                    image={`/images/products/${drink.imgName}`}
                                    alt={drink.name}
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                        {drink.name}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Drawer
                anchor="bottom"
                open={bottomSheetOpen}
                onClose={handleCloseBottomSheet}
                sx={{ '& .MuiDrawer-paper': { width: '100%', margin: 'auto' } }}
            >
                <List>
                    <ListItem sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <ListItemAvatar sx={{ fontSize: 150 }}>
                            <Avatar
                                src={`${selectedProduct.imgName}`}
                                alt={selectedProduct.name}
                                sx={{ width: 200, height: 200 }}
                            />
                        </ListItemAvatar>
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary={selectedProduct.name}
                            style={{ width: '220px', textAlign: 'center', fontSize: '2rem' }}
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            secondary="Select Size and Quantity"
                            style={{ width: '220px', textAlign: 'center', fontSize: '1.4rem' }}
                        />
                    </ListItem>
                    <Grid container spacing={2} justifyContent="center" alignItems="center" style={{ padding: '0 20px' }}>
                        <Grid item xs={12} container justifyContent="center" alignItems="center">
                            <Select
                                value={selectedProduct.size || ''}
                                onChange={handleSizeChange}
                                style={{ width: '300px', textAlign: 'center', fontSize: '1.1rem' }}
                            >
                                {selectedProduct.availableSizes && selectedProduct.availableSizes.map((option) => (
                                    <MenuItem key={option.size} value={option.size} style={{ fontSize: '1.2rem' }}>
                                        {option.size} - €{option.price}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                        <Grid item xs={12} container justifyContent="center" alignItems="center">
                            <IconButton onClick={() => handleQuantityChange(-1)} size="large">
                                <RemoveIcon />
                            </IconButton>
                            <TextField
                                type="number"
                                variant="outlined"
                                value={selectedProduct.quantity}
                                inputProps={{ min: 1, style: { textAlign: 'center', fontSize: '1.2rem' } }}
                                style={{ width: '70px', textAlign: 'center' }}
                            />
                            <IconButton onClick={() => handleQuantityChange(1)} size="large">
                                <AddIcon />
                            </IconButton>
                        </Grid>
                        <Grid item xs={12} container justifyContent="center" alignItems="center">
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleAddToCart}
                                style={{ display: 'block', marginBottom: '160px', minWidth: '300px', fontSize: '1.1rem' }}
                            >
                                Add to Cart
                            </Button>
                        </Grid>
                    </Grid>
                </List>
            </Drawer>

            <Snackbar
                open={alertOpen}
                autoHideDuration={6000}
                onClose={() => setAlertOpen(false)}
            >
                <Alert onClose={() => setAlertOpen(false)} severity={alertSeverity}>
                    {alertMessage}
                </Alert>
            </Snackbar>
            <Fab color="primary" aria-label="cart" onClick={() => setOpenDialog(true)}
                 style={{ position: 'fixed', bottom: 16, right: 16 }}>
                <Badge badgeContent={cart.length} color="secondary">
                    <ShoppingCartOutlinedIcon />
                </Badge>
            </Fab>
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Cart</DialogTitle>
                <DialogContent>
                    {renderCartItems()}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Close</Button>
                    <Button variant="contained" color="primary" onClick={handleOpenCardView}>Checkout</Button>
                </DialogActions>
            </Dialog>
            <Fab color="primary" aria-label="call waiter" onClick={handleCallWaiter}
                 style={{ position: 'fixed', bottom: 90, right: 16 }}>
                <ContactSupport />
            </Fab>
        </Container>
    );
};

export default ProductView;
