import React, { useEffect, useState } from "react";
import axios from 'axios';
import Cookies from 'js-cookie';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
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

import { useNavigate, useParams } from "react-router-dom";
import {loadCartFromCookies, saveCartToCookies, removeCartFromCookies} from "./utils";

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
    const [selectedProduct, setSelectedProduct] = useState({});
    const [openDialog, setOpenDialog] = useState(false);
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [extras, setExtras] = useState('');
    const navigate = useNavigate();
    const baseURL = "http://localhost:3000/images/products/";

    useEffect(() => {
        const loadedCart = loadCartFromCookies(tableId);
        setCart(loadedCart);

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
            navigate(`/product/${tableId}/card`);
        }
    };
    const handleCloseDialog = () => setOpenDialog(false);

    const handleAddToCart = () => {
        const newCart = [...cart, { ...selectedProduct, imgName: `${selectedProduct.imgName}`, extras }];
        setCart(newCart);
        saveCartToCookies(tableId, newCart);
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
            availableSizes: drinks.filter(p => p.name === product.name),
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
        setSelectedProduct({ ...selectedProduct, size: newSize, price: selectedSize.price });
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
                        <ListItemText primary={`${item.name} - ${item.size}`} secondary={`Quantity: ${item.quantity}, Price: $${item.price}`} />
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
                    <Grid container spacing={2} style={{ padding: '0 16px' }}>
                        <Grid item xs={12} sm={6}>
                            <Select
                                value={selectedProduct.size || ''}
                                onChange={handleSizeChange}
                                fullWidth
                            >
                                {selectedProduct.availableSizes?.length > 0 ? (
                                    selectedProduct.availableSizes.map(p => (
                                        <MenuItem key={p.size} value={p.size} disabled={p.quantity === 0}>
                                            {`${p.size} - $${p.price}`}
                                        </MenuItem>
                                    ))
                                ) : (
                                    <MenuItem disabled>No sizes available</MenuItem>
                                )}
                            </Select>
                        </Grid>
                        <Grid item xs={12} sm={6}>
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
                        </Grid>
                    </Grid>
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
                    <div style={{ position: 'fixed', bottom: '20px', right: '20px', width: 'calc(100% - 40px)', zIndex: 1000 }}>
                        <Button onClick={handleAddToCart} color="primary" variant="contained" fullWidth>Add to Cart</Button>
                    </div>
                    <ListItem>
                        <div>
                            <Accordion style={{ width: "98.3vw", height: "auto" }}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}
                                                  id="panel1-header"
                                                  aria-controls="panel1-content"
                                >
                                    <Typography style={{fontSize: "1.2rem"}}>Ingredients and allergens</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography>
                                        <Typography style={{ fontWeight: "bold"}}>Ingredients:</Typography> {selectedProduct.ingredients} <br />
                                        <Typography style={{ fontWeight: "bold"}}>Allergens:</Typography> {selectedProduct.allergens}
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}
                                                  id="panel2-header"
                                                  aria-controls="panel2-content"
                                >
                                    <Typography style={{fontSize: "1.2rem"}}>Nutritional values</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography>
                                        {selectedProduct.nutrition}
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                        </div>
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
            <Fab color="secondary" aria-label="call-waiter" style={{ position: 'fixed', left: 20, bottom: 50, zIndex: 1 }} onClick={handleCallWaiter}>
                <ContactSupport />
            </Fab>
        </Container>
    );
};

export default ProductView;
