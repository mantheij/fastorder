import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    FormControl,
    IconButton,
    InputBase,
    InputLabel,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    Modal,
    Paper,
    Select,
    TextField,
    Typography,
    Snackbar,
    Alert,
    Grid
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import UploadIcon from '@mui/icons-material/Upload';

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

/**
 * The Settings component is responsible for managing product categories and products,
 * allowing users to add, delete, and search for products and categories.
 */
const Settings = () => {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState({});
    const [filter, setFilter] = useState('');
    const [selectedProducts, setSelectedProducts] = useState(new Set());
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
    const [deleteCategoryDialogOpen, setDeleteCategoryDialogOpen] = useState(false);
    const [newCategory, setNewCategory] = useState({ name: '', description: '' });
    const [categoryToDelete, setCategoryToDelete] = useState('');
    const [newProduct, setNewProduct] = useState({
        name: '',
        price: '',
        quantity: '',
        productCategoryId: '',
        size: '',
        allergens: '',
        ingredients: '',
        nutrition: '',
        imageUrl: ''
    });

    const [productImage, setProductImage] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const getToken = () => {
        return localStorage.getItem('token');
    };

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
    const handleAddCategoryModalOpen = () => setIsAddCategoryModalOpen(true);
    const handleAddCategoryModalClose = () => setIsAddCategoryModalOpen(false);
    const handleDeleteCategoryDialogOpen = () => {
        setDeleteCategoryDialogOpen(true);
    };
    const handleDeleteCategoryDialogClose = () => setDeleteCategoryDialogOpen(false);
    const handleNewProductChange = (event) => {
        setNewProduct({ ...newProduct, [event.target.name]: event.target.value });
    };
    const handleNewCategoryChange = (event) => {
        setNewCategory({ ...newCategory, [event.target.name]: event.target.value });
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

    const handleFileChange = (event) => {
        setProductImage(event.target.files[0]);
        setNewProduct({ ...newProduct, imageUrl: '' });
        setSnackbarMessage('Image selected: ' + event.target.files[0].name);
        setSnackbarOpen(true);
    };

    const handleAddProduct = async () => {
        const imgName = `${newProduct.name.toLowerCase().replace(/ /g, '_')}.jpeg`;
        const cleanedPrice = newProduct.price.replace('€', '').replace(',', '.');
        const formattedPrice = parseFloat(cleanedPrice);
        const formattedQuantity = parseInt(newProduct.quantity, 10);
        const productData = {
            ...newProduct,
            price: formattedPrice,
            quantity: formattedQuantity,
            imgName,
            allergens: newProduct.allergens || "allergens are empty",
            ingredients: newProduct.ingredients || "ingredients are empty",
            nutrition: newProduct.nutrition || "nutrition's are empty"
        };

        const token = getToken();

        try {
            if (productImage) {
                try {
                    console.log('Uploading image:', productImage);
                    setSnackbarMessage('Uploading image...');
                    setSnackbarOpen(true);
                    const formData = new FormData();
                    formData.append('file', productImage, imgName);
                    const response = await axios.post('http://localhost:8080/api/images/upload', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    console.log('Image uploaded successfully', response.data);
                    productData.imageUrl = response.data;
                    setSnackbarMessage('Image uploaded successfully');
                    setSnackbarOpen(true);
                } catch (error) {
                    console.error('Error uploading image:', error);
                    setSnackbarMessage('');
                    setSnackbarOpen(false);
                    setErrorMessage('Error uploading image. Do you want to add the product without the image?');
                    setConfirmDialogOpen(true);
                    return;
                }
            } else if (newProduct.imageUrl) {
                try {
                    console.log('Downloading image from URL:', newProduct.imageUrl);
                    setSnackbarMessage('Downloading image...');
                    setSnackbarOpen(true);
                    const response = await axios.post('http://localhost:8080/api/images/download', {
                        imageUrl: newProduct.imageUrl,
                        filename: imgName
                    }, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    console.log('Image downloaded and uploaded successfully', response.data);
                    productData.imageUrl = response.data;
                    setSnackbarMessage('Image downloaded and uploaded successfully');
                    setSnackbarOpen(true);
                } catch (error) {
                    console.error('Error downloading image:', error);
                    setSnackbarMessage('');
                    setSnackbarOpen(false);
                    setErrorMessage('Error downloading image from URL. Do you want to add the product without the image?');
                    setConfirmDialogOpen(true);
                    return;
                }
            }

            setSnackbarMessage('');
            setSnackbarOpen(false);
            console.log('Sending product data to server:', productData);
            const productResponse = await axios.post('http://localhost:8080/api/products', productData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('Product added successfully:', productResponse.data);
            const newProducts = { ...products };
            newProducts[productData.productCategoryId] = newProducts[productData.productCategoryId] || [];
            newProducts[productData.productCategoryId].push(productResponse.data);
            setProducts(newProducts);
            setIsAddModalOpen(false);
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };

    const handleAddCategory = () => {
        axios.post('http://localhost:8080/api/productCategories', newCategory)
            .then(response => {
                console.log('Category added successfully:', response.data);
                setCategories([...categories, response.data]);
                setIsAddCategoryModalOpen(false);
            })
            .catch(error => {
                console.error('Error adding category:', error);
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
            axios.delete(`http://localhost:8080/api/products/${productId}`)))
            .then(() => {
                console.log('All selected products deleted successfully');
                fetchProducts();
                setSelectedProducts(new Set());
                setDeleteDialogOpen(false);
            }).catch(error => {
            console.error('Failed to delete products', error);
        });
    };

    const deleteCategory = () => {
        axios.delete(`http://localhost:8080/api/productCategories/${categoryToDelete}`)
            .then(() => {
                console.log('Category deleted successfully');
                setCategories(categories.filter(category => category.categoryId !== categoryToDelete));
                setDeleteCategoryDialogOpen(false);
            })
            .catch(error => {
                console.error('Failed to delete category', error);
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

    const renderDeleteCategoryConfirmDialog = () => (
        <Dialog
            open={deleteCategoryDialogOpen}
            onClose={handleDeleteCategoryDialogClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{"Confirm delete category"}</DialogTitle>
            <DialogContent>
                <FormControl fullWidth>
                    <InputLabel id="category-select-label">Select Category</InputLabel>
                    <Select
                        labelId="category-select-label"
                        id="category-select"
                        value={categoryToDelete}
                        label="Select Category"
                        onChange={(event) => setCategoryToDelete(event.target.value)}
                    >
                        {categories.map((category) => (
                            <MenuItem key={category.categoryId} value={category.categoryId}>
                                {category.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={deleteCategory} color="error" variant="contained" autoFocus>
                    Delete
                </Button>
                <Button onClick={handleDeleteCategoryDialogClose} color="primary" variant="contained">
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );

    const renderConfirmDialog = () => (
        <Dialog
            open={confirmDialogOpen}
            onClose={() => setConfirmDialogOpen(false)}
            aria-labelledby="confirm-dialog-title"
            aria-describedby="confirm-dialog-description"
        >
            <DialogTitle id="confirm-dialog-title">{"Image Upload/Download Error"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="confirm-dialog-description">
                    {errorMessage}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={async () => {
                        setConfirmDialogOpen(false);
                        setSnackbarOpen(false);
                        await handleAddProductWithoutImage();
                    }}
                    color="primary"
                    variant="contained"
                >
                    Yes
                </Button>
                <Button
                    onClick={() => setConfirmDialogOpen(false)}
                    color="error"
                    variant="contained"
                >
                    No
                </Button>
            </DialogActions>
        </Dialog>
    );

    const handleAddProductWithoutImage = async () => {
        const imgName = `${newProduct.name.toLowerCase().replace(/ /g, '_')}.jpeg`;
        const cleanedPrice = newProduct.price.replace('€', '').replace(',', '.');
        const formattedPrice = parseFloat(cleanedPrice);
        const formattedQuantity = parseInt(newProduct.quantity, 10);
        const productData = {
            ...newProduct,
            price: formattedPrice,
            quantity: formattedQuantity,
            imgName,
            allergens: newProduct.allergens || "allergens are empty",
            ingredients: newProduct.ingredients || "ingredients are empty",
            nutrition: newProduct.nutrition || "nutrition's are empty",
            imageUrl: ''
        };

        const token = getToken();

        try {
            console.log('Sending product data to server:', productData);
            const productResponse = await axios.post('http://localhost:8080/api/products', productData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('Product added successfully:', productResponse.data);
            const newProducts = { ...products };
            newProducts[productData.productCategoryId] = newProducts[productData.productCategoryId] || [];
            newProducts[productData.productCategoryId].push(productResponse.data);
            setProducts(newProducts);
            setIsAddModalOpen(false);
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };

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
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between', width: '100%' }}>
                <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddCategoryModalOpen} sx={{ flex: 1 }}>
                    Add Category
                </Button>
                <Button variant="contained" color="error" startIcon={<DeleteIcon />}
                        onClick={handleDeleteCategoryDialogOpen} sx={{ flex: 1 }}>
                    Delete Category
                </Button>
                <Divider orientation="vertical" flexItem />
                <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddModalOpen} sx={{ flex: 1 }}>
                    Add Product
                </Button>
                <Button variant="contained" color="error" startIcon={<DeleteIcon />} onClick={handleDeleteProducts}
                        sx={{ flex: 1 }}>
                    Delete Products
                </Button>
            </Box>
            <Paper sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2 }}>
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

                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={6}>
                            <TextField label="Name" name="name" fullWidth margin="normal" value={newProduct.name}
                                       onChange={handleNewProductChange} />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField label="Price €" name="price" fullWidth margin="normal" value={newProduct.price}
                                       onChange={handleNewProductChange} placeholder="0.00" />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField label="Quantity" name="quantity" type="number" fullWidth margin="normal"
                                       value={newProduct.quantity} onChange={handleNewProductChange} placeholder="0" />
                        </Grid>
                        <Grid item xs={6}>
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
                        </Grid>
                        <Grid item xs={6}>
                            <TextField label="Size" name="size" fullWidth margin="normal" value={newProduct.size}
                                       onChange={handleNewProductChange} placeholder="0,0L" />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField label="Allergens" name="allergens" fullWidth margin="normal"
                                       value={newProduct.allergens || ""} onChange={handleNewProductChange}
                                       placeholder="List of allergens" />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField label="Ingredients" name="ingredients" fullWidth margin="normal"
                                       value={newProduct.ingredients || ""} onChange={handleNewProductChange}
                                       placeholder="List of ingredients" />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField label="Nutrition" name="nutrition" fullWidth margin="normal"
                                       value={newProduct.nutrition || ""} onChange={handleNewProductChange}
                                       placeholder="List of nutrition" />
                        </Grid>

                        <Grid item xs={12} sm={9}>
                            <TextField label="Image URL" name="imageUrl" fullWidth margin="normal"
                                       value={newProduct.imageUrl} onChange={handleNewProductChange}
                                       placeholder="http://example.com/image.jpg" />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <Button variant="contained" component="label" startIcon={<UploadIcon />} fullWidth>
                                Upload Local
                                <input type="file" hidden name="productImage" onChange={handleFileChange} />
                            </Button>
                        </Grid>

                        <Grid item xs={12}>
                            <Button variant="contained" color="primary" onClick={handleAddProduct} sx={{ mt: 2 }}>
                                Submit
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Modal>

            <Modal open={isAddCategoryModalOpen} onClose={handleAddCategoryModalClose}>
                <Box sx={modalStyle}>
                    <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
                        Add New Category
                    </Typography>
                    <TextField label="Name" name="name" fullWidth margin="normal" value={newCategory.name}
                               onChange={handleNewCategoryChange} />
                    <TextField label="Description" name="description" fullWidth margin="normal"
                               value={newCategory.description} onChange={handleNewCategoryChange} />

                    <Button variant="contained" color="primary" onClick={handleAddCategory} sx={{ mt: 2 }}>
                        Submit
                    </Button>
                </Box>
            </Modal>

            {renderDeleteConfirmDialog()}
            {renderDeleteCategoryConfirmDialog()}
            {renderConfirmDialog()}
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
                <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarMessage ? "info" : "error"} sx={{ width: '100%' }}>
                    {snackbarMessage || errorMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Settings;
