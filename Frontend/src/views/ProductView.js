// Importiere erforderliche Abhängigkeiten aus React und MUI-Bibliothek
import React, {useState, useEffect} from "react";
import axios from 'axios'; // HTTP-Anfragenbibliothek für das Abholen von Produktdaten
import Cookies from 'js-cookie'; // Bibliothek zur Verwaltung von Cookies
import {
    Container,
    Grid,
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Typography,
    CardActions,
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
    ListItemIcon, Avatar, ListItemAvatar
} from "@mui/material"; // Material-UI-Komponenten
// MUI-Symbole importieren
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import {useNavigate, useParams} from "react-router-dom";

// Funktion für die Darstellung von Produktkarten und Warenkorb
const ProductView = () => {
    // Zustände für verschiedene Daten und UI-Interaktionen
    const { tableId } = useParams();
    const [drinks, setDrinks] = useState([]); // Zustand für Produkte
    const [uniqueDrinks, setUniqueDrinks] = useState([]); // Zustand für eindeutige Produkte (ohne Duplikate)
    const [value, setValue] = useState(0); // Zustand für aktiven Tab-Wert
    const [cart, setCart] = useState([]); // Zustand für Warenkorb
    const [alertOpen, setAlertOpen] = useState(false); // Zustand für Snackbar (Benachrichtigung)
    const [alertMessage, setAlertMessage] = useState(''); // Zustand für Nachricht der Snackbar
    const [alertSeverity, setAlertSeverity] = useState('success'); // Zustand für Schweregrad der Snackbar-Nachricht
    const [bottomSheetOpen, setBottomSheetOpen] = useState(false); // Zustand für die untere Blattöffnung (Auswahlgröße und Menge)
    const [selectedProduct, setSelectedProduct] = useState({}); // Zustand für das ausgewählte Produkt
    const [openDialog, setOpenDialog] = useState(false); // Zustand für Dialog (Warenkorbansicht)
    const navigate = useNavigate();
    const [extras, setExtras] = useState('');
    const baseURL = "http://localhost:3000/images/products/"; // Basierend auf Ihrer Serverkonfiguration


    // Effekt für die Initialisierung von Produktdaten und des Warenkorbs
    useEffect(() => {
        // Lade den Warenkorb aus Cookies, falls vorhanden
        const loadedCart = Cookies.get(`cart`);
        if (loadedCart) {
            setCart(JSON.parse(loadedCart));
        }
        // Lade Produktdaten von der API
        axios.get("http://localhost:8080/api/products")
            .then(response => {
                setDrinks(response.data); // Setze Produktdaten im Zustand
                // Filtere eindeutige Produkte und setze sie im Zustand
                setUniqueDrinks(Array.from(new Set(response.data.map(drink => drink.name)))
                    .map(name => response.data.find(drink => drink.name === name)));
            })
            .catch(error => console.error("Error loading the products:", error)); // Fehlerbehandlung bei Datenabruf
    }, []); // Leerer Abhängigkeitsarray bedeutet einmalige Ausführung beim ersten Rendern

    const handleOpenCardView = () => {
        if (cart.length === 0) {
            setAlertMessage('Your cart is empty'); // Setzen der Fehlermeldung
            setAlertSeverity('error'); // Setzen des Schweregrads der Snackbar auf 'error'
            setAlertOpen(true); // Öffnen der Snackbar
        } else {
            navigate(`/product/${tableId}/card`); // Navigieren zur CardView Route, wenn Warenkorb nicht leer ist
        }
    };
    const handleCloseDialog = () => setOpenDialog(false); // Schließe den Dialog

    // Funktion zur Behandlung des Hinzufügens eines Produkts zum Warenkorb
    const handleAddToCart = () => {
        const newCart = [...cart, {...selectedProduct, imgName: `${selectedProduct.imgName}`, extras }];
        console.log(newCart);  // Überprüfen Sie den neuen Warenkorb
        setCart(newCart);
        Cookies.set('cart', JSON.stringify(newCart), { expires: 7 });
        setAlertMessage('Added drink to cart');
        setAlertSeverity('success');
        setAlertOpen(true);
        setBottomSheetOpen(false);
        setExtras(''); // Extras zurücksetzen
    };

    // Funktion zur Behandlung der Öffnung des unteren Blatts (Größe und Menge auswählen)
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

    // Funktion zur Behandlung des Schließens des unteren Blatts
    const handleCloseBottomSheet = () => {
        setBottomSheetOpen(false); // Schließe das untere Blatt
    };

    // Funktion zur Behandlung der Größenänderung
    const handleSizeChange = (event) => {
        const newSize = event.target.value; // Neue Größe aus dem Ereignis
        // Suche das ausgewählte Produkt mit der neuen Größe und aktualisiere es
        const selectedSize = drinks.find(p => p.name === selectedProduct.name && p.size === newSize);
        setSelectedProduct({...selectedProduct, size: newSize, price: selectedSize.price});
    };

    // Funktion zur Behandlung der Mengenänderung
    const handleQuantityChange = (event) => {
        const newQuantity = Number(event.target.value); // Neue Menge aus dem Ereignis
        setSelectedProduct({...selectedProduct, quantity: newQuantity}); // Setze die neue Menge für das ausgewählte Produkt
    };

    const handleExtraChange = (event) => {
        setExtras(event.target.value);
    };

    // Funktion zur Behandlung des Entfernens eines Produkts aus dem Warenkorb
    const handleRemoveFromCart = (index) => {
        const newCart = [...cart]; // Kopiere den aktuellen Warenkorb
        newCart.splice(index, 1); // Entferne das Produkt an der angegebenen Indexposition
        setCart(newCart); // Setze den aktualisierten Warenkorb im Zustand
        Cookies.set('cart', JSON.stringify(newCart), {expires: 7}); // Speichere den Warenkorb in Cookies mit Ablaufdatum
        setAlertMessage('Item removed from cart'); // Setze die Benachrichtigungsnachricht
        setAlertSeverity('info'); // Setze die Benachrichtigungsschweregrad
        setAlertOpen(true); // Öffne die Benachrichtigung
    };

    // Funktion zur Darstellung der Warenkorbartikel
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
    return (
        <Container maxWidth={false}>
            <Tabs value={value} onChange={(event, newValue) => setValue(newValue)} centered>
                <Tab label="All Drinks"/>
            </Tabs>
            <Grid container spacing={2}>
                {uniqueDrinks.filter(drink => drink.categoryId === value || value === 0).map((drink) => (
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
                                sx={{width: 128, height: 128}}  // Stil für größeren Avatar
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
                </List>
            </Drawer>
            <Snackbar
                open={alertOpen}
                autoHideDuration={6000}
                onClose={() => setAlertOpen(false)}
                anchorOrigin={{vertical: 'bottom', horizontal: 'left'}} // Position der Snackbar
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