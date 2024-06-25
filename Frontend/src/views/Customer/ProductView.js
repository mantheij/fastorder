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
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import ContactSupport from '@mui/icons-material/ContactSupport';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

import { useNavigate, useParams } from "react-router-dom";
import { loadCartFromCookies, saveCartToCookies } from "./utils";
import config from "../../config";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const ProductView = () => {
    const { tableId } = useParams();
    const [drinks, setDrinks] = useState([]);
    const [groupedDrinks, setGroupedDrinks] = useState({});
    const [categories, setCategories] = useState([]);
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
                const grouped = groupBy(response.data, 'name');
                setGroupedDrinks(grouped);
            })
            .catch(error => console.error("Error loading the products:", error));

        axios.get(`${config.apiBaseUrl}/api/productCategories`)
            .then(response => {
                setCategories(response.data);
            })
            .catch(error => console.error("Error loading the categories:", error));
    }, []);

    const groupBy = (array, key) => {
        return array.reduce((result, currentValue) => {
            (result[currentValue[key]] = result[currentValue[key]] || []).push(currentValue);
            return result;
        }, {});
    };

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

        const newCart = [...cart, {
            ...selectedProduct,
            imgName: `${selectedProduct.imgName}`,
            size: selectedProduct.size,
            price: selectedProduct.price,
            productId: selectedProduct.productId
        }];

        setCart(newCart);
        saveCartToCookies(tableId, newCart);
        setAlertMessage('Added drink to cart');
        setAlertSeverity('success');
        setAlertOpen(true);
        setBottomSheetOpen(false);
    };

    const handleOpenBottomSheet = (product) => {
        const availableSizes = drinks.filter(p => p.name === product.name);
        setSelectedProduct({
            name: product.name,
            imgName: `/images/products/${product.imgName}`,
            availableSizes,
            size: availableSizes[0]?.size || '',
            price: availableSizes[0]?.price || 0,
            productId: product.productId,
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
            return drink[0].name.toLowerCase().includes(searchQuery.toLowerCase());
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

    const filteredDrinks = Object.values(groupedDrinks).flatMap(group => filterDrinks([group]));

    const isProductAvailable = (product) => {
        return product.some(p => p.quantity > 0);
    };

    const handleCallWaiter = () => {
        setAlertMessage('Waiter has been called');
        setAlertSeverity('info');
        setAlertOpen(true);
    };

    return (
        <Container maxWidth={false}>
            <Grid container justifyContent="space-between" alignItems="center" style={{ marginBottom: 10 }}>
                <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(`/customerStart/${tableId}`)}>
                    Back
                </Button>
                <Tabs value={value} onChange={(event, newValue) => setValue(newValue)} centered>
                    <Tab label="All Drinks" value={0} />
                    {categories.map((category, index) => (
                        <Tab label={category.name} value={category.categoryId} key={index} />
                    ))}
                </Tabs>
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
                    style={{ marginBottom: 10 }}
                />
            )}
            <Grid container spacing={2}>
                {filteredDrinks.filter(group => group.some(drink => drink.categoryId === value || value === 0)).map((group, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card>
                            <CardActionArea
                                onClick={() => isProductAvailable(group) ? handleOpenBottomSheet(group[0]) : null}
                                disabled={!isProductAvailable(group)}
                                style={{ opacity: !isProductAvailable(group) ? 0.5 : 1 }}
                            >
                                <CardMedia
                                    style={{ height: 200, width: '100%', objectFit: 'contain' }}
                                    component="img"
                                    image={`/images/products/${group[0].imgName}`}
                                    alt={group[0].name}
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                        {group[0].name}
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
                sx={{ '& .MuiDrawer-paper': { width: '100%', height: '55%', margin: 'auto' } }}
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
                        <Typography variant="h4" sx={{ width: '100%', textAlign: 'center' }}>
                            {selectedProduct.name}
                        </Typography>
                    </ListItem>
                    <ListItem>
                        <Typography variant="h6" sx={{ width: '100%', textAlign: 'center' }}>
                            Select Size and Quantity
                        </Typography>
                    </ListItem>
                    <Grid container spacing={2} justifyContent="center" alignItems="center" style={{ padding: '0 20px' }}>
                        <Grid item xs={12} container justifyContent="center" alignItems="center">
                            <Select
                                value={selectedProduct.size || ''}
                                onChange={handleSizeChange}
                                style={{ width: '300px', textAlign: 'center', fontSize: '1.5rem' }}
                            >
                                {selectedProduct.availableSizes && selectedProduct.availableSizes.map((option) => (
                                    <MenuItem key={option.size} value={option.size} style={{ fontSize: '1.5rem' }}>
                                        {option.size} - {option.price.toFixed(2).replace('.', ',')}€
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
                                inputProps={{ min: 1, style: { textAlign: 'center', fontSize: '1.5rem' } }}
                                style={{ width: '100px', textAlign: 'center' }}
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
                                style={{ display: 'flex', alignItems: 'center', minWidth: '300px', fontSize: '1.5rem' }}
                            >
                                <ShoppingCartIcon style={{ marginRight: '10px' }} />
                                {`${(selectedProduct.price * selectedProduct.quantity).toFixed(2).replace('.', ',')}€`}
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
