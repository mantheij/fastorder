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
    Typography
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

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
    /**
     * State to manage the list of product categories.
     */
    const [categories, setCategories] = useState([]);

    /**
     * State to manage the list of products grouped by category.
     */
    const [products, setProducts] = useState({});

    /**
     * State to manage the search filter value.
     */
    const [filter, setFilter] = useState('');

    /**
     * State to manage the set of selected product IDs.
     */
    const [selectedProducts, setSelectedProducts] = useState(new Set());

    /**
     * State to manage the visibility of the Add Product modal.
     */
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    /**
     * State to manage the visibility of the Delete Products dialog.
     */
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    /**
     * State to manage the visibility of the Add Category modal.
     */
    const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);

    /**
     * State to manage the visibility of the Delete Category dialog.
     */
    const [deleteCategoryDialogOpen, setDeleteCategoryDialogOpen] = useState(false);

    /**
     * State to manage the data of a new category being added.
     */
    const [newCategory, setNewCategory] = useState({name: '', description: ''});

    /**
     * State to manage the ID of the category to be deleted.
     */
    const [categoryToDelete, setCategoryToDelete] = useState('');

    /**
     * State to manage the data of a new product being added.
     */
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

    const getToken = () => {
        return localStorage.getItem('token');
    };

    /**
     * useEffect hook to load product categories and products from the server when the component mounts.
     */
    useEffect(() => {
        axios.get('http://localhost:8080/api/productCategories')
            .then(response => {
                setCategories(response.data);
                fetchProducts();
            })
            .catch(error => console.error('Error loading categories:', error));
    }, []);

    /**
     * Fetches the list of products from the server and groups them by category.
     */
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

    /**
     * Filters products by category and search filter.
     * @param {string} categoryId - The ID of the category to filter.
     * @returns {Array} - The filtered products.
     */
    const filteredProducts = categoryId => {
        return products[categoryId] ? products[categoryId].filter(product => product.name.toLowerCase().includes(filter)) : [];
    };

    /**
     * Formats the price of a product to a string with a currency symbol.
     * @param {number} price - The price of the product.
     * @returns {string} - The formatted price.
     */
    const formatPrice = (price) => {
        return `${price.toFixed(2).replace('.', ',')}€`;
    };

    /**
     * Opens the Add Product modal.
     */
    const handleAddModalOpen = () => setIsAddModalOpen(true);

    /**
     * Closes the Add Product modal.
     */
    const handleAddModalClose = () => setIsAddModalOpen(false);

    /**
     * Opens the Add Category modal.
     */
    const handleAddCategoryModalOpen = () => setIsAddCategoryModalOpen(true);

    /**
     * Closes the Add Category modal.
     */
    const handleAddCategoryModalClose = () => setIsAddCategoryModalOpen(false);

    /**
     * Opens the Delete Category dialog.
     */
    const handleDeleteCategoryDialogOpen = () => {
        setDeleteCategoryDialogOpen(true);
    };

    /**
     * Closes the Delete Category dialog.
     */
    const handleDeleteCategoryDialogClose = () => setDeleteCategoryDialogOpen(false);

    /**
     * Updates the state with the new product data entered by the user.
     * @param {object} event - The input change event.
     */
    const handleNewProductChange = (event) => {
        setNewProduct({ ...newProduct, [event.target.name]: event.target.value });
    };

    /**
     * Updates the state with the new category data entered by the user.
     * @param {object} event - The input change event.
     */
    const handleNewCategoryChange = (event) => {
        setNewCategory({ ...newCategory, [event.target.name]: event.target.value });
    };

    /**
     * Updates the search filter state with the value entered by the user.
     * @param {object} event - The input change event.
     */
    const handleFilterChange = (event) => {
        setFilter(event.target.value.toLowerCase());
    };

    /**
     * Adds or removes a product from the selected products set.
     * @param {string} productId - The ID of the product to toggle.
     */
    const handleToggleProduct = (productId) => {
        const newSelected = new Set(selectedProducts);
        if (newSelected.has(productId)) {
            newSelected.delete(productId);
        } else {
            newSelected.add(productId);
        }
        setSelectedProducts(newSelected);
    };

    /**
     * Handles the file input change event.
     * @param {object} event - The input change event.
     */
    const handleFileChange = (event) => {
        setProductImage(event.target.files[0]);
    };

    /**
     * Formats the new product data and sends a POST request to add the product to the server.
     */
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
                console.log('Uploading image:', productImage);
                const formData = new FormData();
                formData.append('file', productImage, imgName);
                const response = await axios.post('http://localhost:8080/api/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log('Image uploaded successfully', response.data);
                productData.imageUrl = response.data;
            } else if (newProduct.imageUrl) {
                console.log('Downloading image from URL:', newProduct.imageUrl);
                const response = await axios.get(newProduct.imageUrl, {responseType: 'arraybuffer'});
                const blob = new Blob([response.data], {type: 'image/jpeg'});
                const formData = new FormData();
                formData.append('file', blob, imgName);
                const uploadResponse = await axios.post('http://localhost:8080/api/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log('Image downloaded and uploaded successfully', uploadResponse.data);
                productData.imageUrl = uploadResponse.data;
            }

            console.log('Sending product data to server:', productData);
            const productResponse = await axios.post('http://localhost:8080/api/products', productData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('Product added successfully:', productResponse.data);
            const newProducts = {...products};
            newProducts[productData.productCategoryId] = newProducts[productData.productCategoryId] || [];
            newProducts[productData.productCategoryId].push(productResponse.data);
            setProducts(newProducts);
            setIsAddModalOpen(false);
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };

    /**
     * Sends a POST request to add the new category to the server.
     */
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

    /**
     * Opens the Delete Products dialog.
     */
    const handleDeleteProducts = () => {
        setDeleteDialogOpen(true);
    };

    /**
     * Closes the Delete Products dialog.
     */
    const handleCloseDialog = () => {
        setDeleteDialogOpen(false);
    };

    /**
     * Sends DELETE requests to remove the selected products from the server and updates the state.
     */
    const deleteSelectedProducts = () => {
        axios.all(Array.from(selectedProducts).map(productId =>
            axios.delete(`http://localhost:8080/api/products/${productId}`)))
            .then(() => {
                console.log('All selected products deleted successfully');
                fetchProducts(); // Fetch all products again to reflect the deletions
                setSelectedProducts(new Set());
                setDeleteDialogOpen(false);
            }).catch(error => {
            console.error('Failed to delete products', error);
        });
    };

    /**
     * Sends a DELETE request to remove the selected category from the server and updates the state.
     */
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

    /**
     * Renders the confirmation dialog for deleting selected products.
     * @returns {JSX.Element} - The delete confirmation dialog.
     */
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

    /**
     * Renders the confirmation dialog for deleting a category.
     * @returns {JSX.Element} - The delete category confirmation dialog.
     */
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

    /**
     * Finds a product by its ID in the products state.
     * @param {string} productId - The ID of the product to find.
     * @returns {object|null} - The found product or null if not found.
     */
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
                    <TextField label="Name" name="name" fullWidth margin="normal" value={newProduct.name}
                               onChange={handleNewProductChange} />
                    <TextField label="Price €" name="price" fullWidth margin="normal" value={newProduct.price}
                               onChange={handleNewProductChange} placeholder="0.00" />
                    <TextField label="Quantity" name="quantity" type="number" fullWidth margin="normal"
                               value={newProduct.quantity} onChange={handleNewProductChange} placeholder="0" />

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

                    <TextField label="Size" name="size" fullWidth margin="normal" value={newProduct.size}
                               onChange={handleNewProductChange} placeholder="0,0L" />
                    <TextField label="Allergens" name="allergens" fullWidth margin="normal"
                               value={newProduct.allergens || ""} onChange={handleNewProductChange}
                               placeholder="List of allergens" />
                    <TextField label="Ingredients" name="ingredients" fullWidth margin="normal"
                               value={newProduct.ingredients || ""} onChange={handleNewProductChange}
                               placeholder="List of ingredients" />
                    <TextField label="Nutrition" name="nutrition" fullWidth margin="normal"
                               value={newProduct.nutrition || ""} onChange={handleNewProductChange}
                               placeholder="List of nutrition" />
                    <TextField label="Image URL" name="imageUrl" fullWidth margin="normal"
                               value={newProduct.imageUrl} onChange={handleNewProductChange}
                               placeholder="http://example.com/image.jpg" />
                    <input type="file" name="productImage" onChange={handleFileChange} />

                    <Button variant="contained" color="primary" onClick={handleAddProduct} sx={{ mt: 2 }}>
                        Submit
                    </Button>
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
        </Box>
    );
};

export default Settings;
