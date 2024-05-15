import React, { useState, useEffect } from "react";
import axios from 'axios';
import Cookies from 'js-cookie';
import {
    Container,
    Grid,
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Typography,
    Tabs,
    Tab,
    Button,
    Fab,
    Badge,
    Snackbar,
    Alert,
    Drawer,
    List,
    ListItem,
    ListItemText,
    Select,
    MenuItem,
    IconButton,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    ListItemIcon,
    Avatar,
    ListItemAvatar
} from "@mui/material";
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from "react-router-dom";

const ProductView = () => {
    const [drinks, setDrinks] = useState([]);
    const [uniqueDrinks, setUniqueDrinks] = useState([]);
    const [value, setValue] = useState(0);
    const [cart, setCart] = useState([]);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');
    const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState({});
    const [openDialog, setOpenDialog] = useState(false);
    const navigate = useNavigate();
    const [extras, setExtras] = useState('');
    const baseURL = "http://localhost:3000/images/products/";

    useEffect(() => {
        const loadedCart = Cookies.get('cart');
        if (loadedCart) {
            setCart(JSON.parse(loadedCart));
        }
        axios.get("http://localhost:8080/api/products")
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
            navigate('/product/card');
        }
    };

    const handleCloseDialog = () => setOpenDialog(false);

    const handleAddToCart = () => {
        const newCart = [...cart, { ...selectedProduct, imgName: `${selectedProduct.imgName}`, extras }];
        console.log(newCart);
        setCart(newCart);
        Cookies.set('cart', JSON.stringify(newCart), { expires: 7 });
        setAlertMessage('Added drink to cart');
        setAlertSeverity('success');
        setAlertOpen(true);
        setBottomSheetOpen(false);
        setExtras('');
    };

    const handleOpenBottomSheet = (product) => {
        const productWithImage = {
            ...product,
            imgName: `/images/products/${product.imgName}`
        };
        setSelectedProduct({
            ...productWithImage,
            availableSizes: drinks.filter(p => p.name === product.name && p.quantity > 0),
            quantity: 1,
            size: '',  // Reset size when opening the bottom sheet
            price: 0   // Reset price when opening the bottom sheet
        });
        setBottomSheetOpen(true);
    };

    const handleCloseBottomSheet = () => {
        setBottomSheetOpen(false);
    };

    const handleSizeChange = (event) => {
        const newSize = event.target.value;
        const selectedSize = drinks.find(p => p.name === selectedProduct.name && p.size === newSize);
        setSelectedProduct({ ...selectedProduct, size: newSize, price: selectedSize ? selectedSize.price : 0 });
    };

    const handleQuantityChange = (event) => {
        const newQuantity = Number(event.target.value);
        setSelectedProduct({ ...selectedProduct, quantity: newQuantity });
    };

    const handleExtraChange = (event) => {
        setExtras(event.target.value);
    };

    const handleRemoveFromCart = (index) => {
        const newCart = [...cart];
        newCart.splice(index, 1);
        setCart(newCart);
        Cookies.set('cart', JSON.stringify(newCart), { expires: 7 });
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
                        <ListItemIcon>
                            <img src={`${item.imgName}`} alt={`${item.name} Logo`}
                                 style={{ width: 30, height: 30 }} />
                        </ListItemIcon>
                        <ListItemText primary={`${item.name} - ${item.size}`}
                                      secondary={`Quantity: ${item.quantity}, Price: $${item.price}`} />
                        <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveFromCart(index)}>
                            <DeleteIcon />
                        </IconButton>
                    </ListItem>
                ))}
            </List>
        );
    };

    return (
        <Container maxWidth={false}>
            <Tabs value={value} onChange={(event, newValue) => setValue(newValue)} centered>
                <Tab label="All Drinks" />
            </Tabs>
            <Grid container spacing={2}>
                {uniqueDrinks.filter(drink => drink.categoryId === value || value === 0).map((drink) => (
                    <Grid item xs={12} sm={6} md={3} key={drink.productId}>
                        <Card>
                            <CardActionArea
                                onClick={() => drink.quantity > 0 ? handleOpenBottomSheet(drink) : null}
                                disabled={drink.quantity === 0}
                                style={{ opacity: drink.quantity === 0 ? 0.5 : 1 }}
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
                onClose={handleCloseBottomSheet}>
                <List>
                    <ListItem>
                        <ListItemAvatar sx={{ fontSize: 100 }}>
                            <Avatar
                                src={`${selectedProduct.imgName}`}
                                alt={selectedProduct.name}
                                sx={{ width: 128, height: 128 }}
                            />
                        </ListItemAvatar>
                    </ListItem>
                    <ListItem>
                        <ListItemText primary={selectedProduct.name} />
                    </ListItem>
                    <ListItem>
                        <ListItemText secondary="Select Size and Quantity" />
                    </ListItem>
                    <ListItem>
                        <Select
                            value={selectedProduct.size || ''}
                            onChange={handleSizeChange}
                            fullWidth
                            disabled={selectedProduct.availableSizes?.length === 0}
                        >
                            {selectedProduct.availableSizes?.length > 0 ? (
                                selectedProduct.availableSizes.map(p => (
                                    <MenuItem key={p.size} value={p.size}>{`${p.size} - $${p.price}`}</MenuItem>
                                ))
                            ) : (
                                <MenuItem disabled>No sizes available</MenuItem>
                            )}
                        </Select>
                    </ListItem>
                    <ListItem>
                        <TextField
                            label="Quantity"
                            type="number"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                            value={selectedProduct.quantity}
                            onChange={handleQuantityChange}
                            fullWidth
                        />
                    </ListItem>
                    <ListItem>
                        <TextField
                            label="Extras"
                            type="text"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                            value={extras}
                            onChange={handleExtraChange}
                            fullWidth
                        />
                    </ListItem>
                    <ListItem>
                        <Button onClick={handleAddToCart} color="primary" variant="contained" fullWidth disabled={!selectedProduct.size}>Add to Cart</Button>
                    </ListItem>
                </List>
            </Drawer>
            <Snackbar
                open={alertOpen}
                autoHideDuration={6000}
                onClose={() => setAlertOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <Alert severity={alertSeverity} sx={{ width: '100%' }}>
                    {alertMessage}
                </Alert>
            </Snackbar>
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Your Cart</DialogTitle>
                <DialogContent>
                    {renderCartItems()}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Close</Button>
                </DialogActions>
            </Dialog>
            <Badge badgeContent={cart.length} color="error" anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                   sx={{ position: 'fixed', right: 25, bottom: 95, zIndex: 1 }}>
                <Fab color="primary" aria-label="cart" style={{ position: 'fixed', right: 20, bottom: 50, zIndex: 0 }}
                     onClick={handleOpenCardView}>
                    <ShoppingCartOutlinedIcon />
                </Fab>
            </Badge>
        </Container>
    );
};
export default ProductView;
