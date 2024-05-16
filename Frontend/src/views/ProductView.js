// Import necessary dependencies from a React and MUI library
import React, {useEffect, useState} from "react";
import axios from 'axios'; // HTTP request library for fetching product data
import Cookies from 'js-cookie'; // Library for managing cookies
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Alert,
    Avatar,
    Badge,
    Button,
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Drawer,
    Fab,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemIcon,
    ListItemText,
    MenuItem,
    Select,
    Snackbar,
    Tab,
    Tabs,
    TextField,
    Typography,
} from "@mui/material"; // Material-UI components
// Import MUI icons
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import {useNavigate} from "react-router-dom";

// Function for displaying product cards and cart
const ProductView = () => {
    // States for various data and UI interactions
    const [drinks, setDrinks] = useState([]); // State for products
    const [uniqueDrinks, setUniqueDrinks] = useState([]); // State for unique products (without duplicates)
    const [value, setValue] = useState(0); // State for active tab value
    const [cart, setCart] = useState([]); // State for cart
    const [alertOpen, setAlertOpen] = useState(false); // State for Snackbar (notification)
    const [alertMessage, setAlertMessage] = useState(''); // State for a Snackbar message
    const [alertSeverity, setAlertSeverity] = useState('success'); // State for Snackbar severity
    const [bottomSheetOpen, setBottomSheetOpen] = useState(false); // State for a bottom sheet open (selecting size
    // and quantity)
    const [selectedProduct, setSelectedProduct] = useState({}); // State for selected product
    const [openDialog, setOpenDialog] = useState(false); // State for dialog (cart view)
    const [isSearchVisible, setIsSearchVisible] = useState(false); // State for search bar visibility
    const [searchQuery, setSearchQuery] = useState(''); // State for a search query
    const [extras, setExtras] = useState('');
    const navigate = useNavigate();
    const baseURL = "http://localhost:3000/images/products/"; // Based on your server configuration

    // Effect for initializing product data and cart
    useEffect(() => {
        // Load cart from cookies if available
        const loadedCart = Cookies.get('cart');
        if (loadedCart) {
            setCart(JSON.parse(loadedCart));
        }
        // Load product data from API
        axios.get("http://localhost:8080/api/products")
            .then(response => {
                setDrinks(response.data); // Set product data in state
                // Filter unique products and set them in state
                setUniqueDrinks(Array.from(new Set(response.data.map(drink => drink.name)))
                    .map(name => response.data.find(drink => drink.name === name)));
            })
            .catch(error => console.error("Error loading the products:", error)); // Error handling for data retrieval
    }, []); // Empty dependency array means run once on initial render

    const handleOpenCardView = () => {
        if (cart.length === 0) {
            setAlertMessage('Your cart is empty'); // Set error message
            setAlertSeverity('error'); // Set an severity of Snackbar to 'error'
            setAlertOpen(true); // Open Snackbar
        } else {
            navigate('/product/card'); // Navigate to CardView route if a cart is not empty
        }
    };
    const handleCloseDialog = () => setOpenDialog(false); // Close the dialog

    // Function for handling adding a product to cart
    const handleAddToCart = () => {
        const newCart = [...cart, {...selectedProduct, imgName: `${selectedProduct.imgName}`, extras}];
        console.log(newCart); // Check the new cart
        setCart(newCart);
        Cookies.set('cart', JSON.stringify(newCart), {expires: 7});
        setAlertMessage('Added drink to cart');
        setAlertSeverity('success');
        setAlertOpen(true);
        setBottomSheetOpen(false);
        setExtras(''); // Reset extras
    };

    // Function for handling an opening bottom sheet (selecting size and quantity)
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

    // Function for handling a closing bottom sheet
    const handleCloseBottomSheet = () => {
        setBottomSheetOpen(false); // Close bottom sheet
    };

    // Function for handling size change
    const handleSizeChange = (event) => {
        const newSize = event.target.value; // New size from the event
        // Find the selected product with the new size and update it
        const selectedSize = drinks.find(p => p.name === selectedProduct.name && p.size === newSize);
        setSelectedProduct({...selectedProduct, size: newSize, price: selectedSize.price});
    };

    // Function for handling quantity change
    const handleQuantityChange = (event) => {
        const newQuantity = Number(event.target.value); // New quantity from the event
        setSelectedProduct({...selectedProduct, quantity: newQuantity}); // Set the new quantity for the selected product
    };

    const handleExtraChange = (event) => {
        setExtras(event.target.value);
    };

    // Function for handling removing a product from cart
    const handleRemoveFromCart = (index) => {
        const newCart = [...cart]; // Copy the current cart
        newCart.splice(index, 1); // Remove the product at the specified index position
        setCart(newCart); // Set the updated cart in state
        Cookies.set('cart', JSON.stringify(newCart), {expires: 7}); // Save the cart in cookies with expiry
        setAlertMessage('Item removed from cart'); // Set the notification message
        setAlertSeverity('info'); // Set the notification severity
        setAlertOpen(true); // Open the notification
    };

    // Function for rendering cart items
    const renderCartItems = () => {
        if (cart.length === 0) {
            return <ListItem>
                <ListItemText primary="Your cart is empty"/>
            </ListItem>;
        }
        return (
            <List>
                {cart.map((item, index) => (
                    <ListItem key={index}>
                        <ListItemIcon>
                            <img src={`${item.imgName}`} alt={`${item.name} Logo`}
                                 style={{width: 30, height: 30}}/>
                        </ListItemIcon>
                        <ListItemText primary={`${item.name} - ${item.size}`}
                                      secondary={`Quantity: ${item.quantity}, Price: $${item.price}`}/>
                        <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveFromCart(index)}>
                            <DeleteIcon/>
                        </IconButton>
                    </ListItem>
                ))}
            </List>
        );
    };

    // Function for filtering drinks based on search query
    const filterDrinks = (drinks) => {
        return drinks.filter(drink => {
            // If no search query present, show all drinks
            if (!searchQuery) {
                return true;
            }
            // Check if drink name contains a search query (case-insensitive)
            return drink.name.toLowerCase().includes(searchQuery.toLowerCase());
        });
    };

    // Function to toggle search bar visibility
    const handleSearchButtonClick = () => {
        setIsSearchVisible(prevState => !prevState);
        handleResetSearch();
    };

    // Function to reset a search query
    const handleResetSearch = () => {
        setSearchQuery("");
    };

    // Handler function for changing search query
    const handleSearchInputChange = (event) => {
        setSearchQuery(event.target.value);
    };

    // Apply filter to displayed drinks
    const filteredDrinks = filterDrinks(uniqueDrinks);

    return (
        <Container maxWidth={false}>
            <Grid>
                <Tabs value={value} onChange={(event, newValue) => setValue(newValue)} centered>
                    <Tab label="All Drinks"/>
                </Tabs>
                <Grid container justifyContent="flex-end" alignItems="center" spacing={2}>
                    <IconButton onClick={handleSearchButtonClick}>
                        <SearchIcon/>
                    </IconButton>
                </Grid>
                {isSearchVisible && (
                    <TextField
                        label="Search drinks"
                        variant="outlined"
                        value={searchQuery}
                        onChange={handleSearchInputChange}
                        fullWidth
                        style={{marginTop: 10, marginBottom: 10}}
                    />
                )}
            </Grid>
            <Grid container spacing={2}>
                {filteredDrinks.filter(drink => drink.categoryId === value || value === 0).map((drink) => (
                    <Grid item xs={12} sm={6} md={3} key={drink.productId}>
                        <Card>
                            <CardActionArea
                                onClick={() => drink.quantity > 0 ? handleOpenBottomSheet(drink) : null}
                                disabled={drink.quantity === 0}
                                style={{opacity: drink.quantity === 0 ? 0.5 : 1}}
                            >
                                <CardMedia
                                    style={{height: 200, width: '100%', objectFit: 'contain'}}
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
                        <ListItemAvatar sx={{fontSize: 100}}>
                            <Avatar
                                src={`${selectedProduct.imgName}`}
                                alt={selectedProduct.name}
                                sx={{width: 128, height: 128}}  // Style for larger Avatar
                            />
                        </ListItemAvatar>
                    </ListItem>
                    <ListItem>
                        <ListItemText primary={selectedProduct.name}/>
                    </ListItem>
                    <ListItem>
                        <ListItemText secondary="Select Size and Quantity"/>
                    </ListItem>
                    <ListItem>
                        <Select
                            value={selectedProduct.size || ''}
                            onChange={handleSizeChange}
                            fullWidth
                        >
                            {selectedProduct.availableSizes?.map(p => (
                                <MenuItem key={p.size} value={p.size}>{`${p.size} - $${p.price}`}</MenuItem>
                            ))}
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
                        <Button onClick={handleAddToCart} color="primary" variant="contained" fullWidth>Add to
                            Cart</Button>
                    </ListItem>
                    <ListItem>
                        <div>
                            <Accordion style={{width: "98.3vw", height: "auto"}}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon/>}
                                                  id="panel1-header"
                                                  aria-controls="panel1-content"
                                >
                                    <Typography>Ingredients and allergens</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography>
                                        Ingredients: {selectedProduct.ingredients} <br/>
                                        Allergens: {selectedProduct.allergens}
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion>
                                <AccordionSummary expandIcon={<ExpandMoreIcon/>}
                                                  id="panel2-header"
                                                  aria-controls="panel2-content"
                                >
                                    <Typography>Nutritional values</Typography>
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
                anchorOrigin={{vertical: 'bottom', horizontal: 'left'}} // Snackbar position
            >
                <Alert severity={alertSeverity} sx={{width: '100%'}}>
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
            <Badge badgeContent={cart.length} color="error" anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                   sx={{position: 'fixed', right: 25, bottom: 95, zIndex: 1}}>
                <Fab color="primary" aria-label="cart" style={{position: 'fixed', right: 20, bottom: 50, zIndex: 0}}
                     onClick={handleOpenCardView}>
                    <ShoppingCartOutlinedIcon/>
                </Fab>
            </Badge>
        </Container>
    );
};
export default ProductView;
