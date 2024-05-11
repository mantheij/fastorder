import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box, Button, Typography, InputBase, IconButton, Paper,
    Drawer, Accordion, AccordionSummary, AccordionDetails,
    List, ListItem, ListItemText, Checkbox, Dialog, DialogTitle,
    DialogContent, DialogActions, Modal, TextField, InputLabel, Select, FormControl, DialogContentText
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import MenuItem from "@mui/material/MenuItem";

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    padding: 4,
    width: '80%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    maxHeight: '70vh',
    overflow: 'auto'
};


const Settings = () => {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState({});
    const [filter, setFilter] = useState('');
    const [selectedProducts, setSelectedProducts] = useState(new Set());
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const [newProduct, setNewProduct] = useState({
        name: '',
        price: '',
        quantity: '',
        productCategoryId: '',
        size: ''
    });


    useEffect(() => {
        axios.get('http://localhost:8080/api/productCategories')
            .then(response => {
                setCategories(response.data);
                fetchProducts();
            })
            .catch(error => console.error('Error loading categories:', error));
    }, []);

    const fetchProducts = () => {
        axios.get('http://localhost:8080/api/products')
            .then(response => {
                const categorizedProducts = response.data.reduce((acc, product) => {
                    acc[product.categoryId] = [...(acc[product.categoryId] || []), product];
                    return acc;
                }, {});
                setProducts(categorizedProducts);
            })
            .catch(error => console.error('Error loading products:', error));
    };

    const filteredProducts = categoryId => {
        return products[categoryId] ? products[categoryId].filter(product => product.name.toLowerCase().includes(filter)) : [];
    };
    const formatPrice = (price) => {
        return `${price.toFixed(2).replace('.', ',')}€`;
    };

    const handleAddModalOpen = () => setIsAddModalOpen(true);
    const handleAddModalClose = () => setIsAddModalOpen(false);


    const handleNewProductChange = (event) => {
        setNewProduct({ ...newProduct, [event.target.name]: event.target.value });
    };

    const handleFilterChange = (event) => {
        setFilter(event.target.value.toLowerCase());
    };

    const handleToggleProduct = (productId) => {
        const newSelected = new Set(selectedProducts);
        if (newSelected.has(productId)) {
            newSelected.delete(productId);
        } else {
            newSelected.add(productId);
        }
        setSelectedProducts(newSelected);
    };

    const handleAddProduct = () => {
        const imgName = `${newProduct.name.toLowerCase().replace(/ /g, '_')}.jpg`;
        const cleanedPrice = newProduct.price.replace('€', '').replace(',', '.');
        const formattedPrice = parseFloat(cleanedPrice);
        const formattedQuantity = parseInt(newProduct.quantity, 10);
        const productData = {
            ...newProduct,
            price: formattedPrice,
            quantity: formattedQuantity,
            imgName,
            allergens: "allergens",
            ingredients: "ingredients",
            nutrition: "nutrition"
        };

        axios.post('http://localhost:8080/api/products', productData)
            .then(response => {
                console.log('Product added successfully:', response.data);
                const newProducts = { ...products };
                newProducts[productData.productCategoryId] = newProducts[productData.productCategoryId] || [];
                newProducts[productData.productCategoryId].push(response.data);
                setProducts(newProducts);
                setIsAddModalOpen(false);
            })
            .catch(error => {
                console.error('Error adding product:', error);
            });
    };

    const handleDeleteProducts = () => {
        setDeleteDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDeleteDialogOpen(false);
    };

    const deleteSelectedProducts = () => {
        axios.all(Array.from(selectedProducts).map(productId =>
            axios.delete(`http://localhost:8080/api/products/${productId}`)
        )).then(() => {
            console.log('All selected products deleted successfully');
            fetchProducts(); // Fetch all products again to reflect the deletions
            setSelectedProducts(new Set());
            setDeleteDialogOpen(false);
        }).catch(error => {
            console.error('Failed to delete products', error);
        });
    };


    const renderDeleteConfirmDialog = () => (
        <Dialog
            open={deleteDialogOpen}
            onClose={handleCloseDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{"Confirm delete"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Are you sure you want to delete these items?:

                    {Array.from(selectedProducts).map(productId => {
                        const product = findProduct(productId);
                        return <div key={productId}>{product.name} {formatPrice(product.price)} {product.size}</div>;
                    })}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={deleteSelectedProducts} color="error" variant="contained" autoFocus>
                    Delete
                </Button>
                <Button onClick={handleCloseDialog} color="primary" variant="contained">
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );

    const findProduct = (productId) => {
        for (const key in products) {
            if (products.hasOwnProperty(key)) {
                const found = products[key].find(product => product.productId === productId);
                if (found) return found;
            }
        }
        return null;
    };

    return (
        <Box sx={{ padding: 4, maxHeight: 'calc(100vh - 150px)', overflow: 'auto' }}>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddModalOpen}>
                Add Product
            </Button>
            <Button variant="contained" color="error" startIcon={<DeleteIcon />} onClick={handleDeleteProducts} sx={{ ml: 2 }}>
                Delete Products
            </Button>
            <Paper sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2}}>
                <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Search Products"
                    inputProps={{ 'aria-label': 'search products' }}
                    onChange={handleFilterChange}
                />
                <IconButton sx={{ p: '10px' }} aria-label="search">
                    <SearchIcon />
                </IconButton>
            </Paper>

            {categories.map(category => (
                <Accordion key={category.categoryId}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>{category.name}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <List>
                            {filteredProducts(category.categoryId).map(product => (
                                <ListItem key={product.productId} secondaryAction={
                                    <Checkbox
                                        edge="end"
                                        onChange={() => handleToggleProduct(product.productId)}
                                        checked={selectedProducts.has(product.productId)}
                                    />
                                }>
                                    <ListItemText
                                        primary={product.name}
                                        secondary={`Price:  ${formatPrice(product.price)}, Size: ${product.size}`}
                                    />
                                </ListItem>
                            ))}
                            </List>
                        </AccordionDetails>
                    </Accordion>
                ))}

            <Modal open={isAddModalOpen} onClose={handleAddModalClose}>
                <Box sx={modalStyle}>
                    <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
                        Add New Product
                    </Typography>
                    <TextField label="Name" name="name" fullWidth margin="normal" value={newProduct.name} onChange={handleNewProductChange} />
                    <TextField label="Price €" name="price" fullWidth margin="normal" value={newProduct.price} onChange={handleNewProductChange} placeholder="0.00"/>
                    <TextField label="Quantity" name="quantity" type="number" fullWidth margin="normal" value={newProduct.quantity} onChange={handleNewProductChange} placeholder="0"/>

                    <FormControl fullWidth margin="normal">
                        <InputLabel id="category-label">Category</InputLabel>
                        <Select
                            labelId="category-label"
                            id="category-select"
                            name="productCategoryId"
                            value={newProduct.productCategoryId}
                            label="Category"
                            onChange={handleNewProductChange}
                        >
                            {categories.map((category) => (
                                <MenuItem key={category.categoryId} value={category.categoryId}>
                                    {category.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField label="Size" name="size" fullWidth margin="normal" value={newProduct.size} onChange={handleNewProductChange} placeholder="0,0L" />
                    <TextField label="Allergens" name="allergens" fullWidth margin="normal" value={newProduct.allergens || ""} onChange={handleNewProductChange} disabled />
                    <TextField label="Ingredients" name="ingredients" fullWidth margin="normal" value={newProduct.ingredients || ""} onChange={handleNewProductChange} disabled />
                    <TextField label="Nutrition" name="nutrition" fullWidth margin="normal" value={newProduct.nutrition || ""} onChange={handleNewProductChange} disabled />

                    <Button variant="contained" color="primary" onClick={handleAddProduct} sx={{ mt: 2 }}>
                        Submit
                    </Button>
                </Box>
            </Modal>
            {renderDeleteConfirmDialog()}
        </Box>
    );
};

export default Settings;
