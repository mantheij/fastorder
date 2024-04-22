import React, { useState, useEffect } from "react";
import {
  Container, Grid, Card, CardActionArea, CardContent,
  CardMedia, Typography, CardActions, Tabs, Tab,
  Button, Fab, Badge, Alert, Snackbar
} from "@mui/material";
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';

const CardView = () => {
  const [drinks, setDrinks] = useState([]);
  const [value, setValue] = useState(0);
  const [cart, setCart] = useState([]); // Nun ein Array von Getränken
  const [alertOpen, setAlertOpen] = useState(false);

  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/drinks.json`)
        .then((response) => response.json())
        .then((data) => setDrinks(data))
        .catch((error) => console.error("Fehler beim Laden der Drinks:", error));
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleAddToCart = (drink) => {
    fetch('http://localhost:3001/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(drink),
    })
        .then(response => response.json())
        .then(data => {
          console.log('Success:', data);
          setCart(currentCart => [...currentCart, data]);
          setAlertOpen(true);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlertOpen(false);
  };

  return (
      <Container maxWidth={false}>
        <Tabs value={value} onChange={handleChange} centered>
          <Tab label="all" />
          <Tab label="non-alcoholic" />
          <Tab label="wine" />
          <Tab label="sparkling wine" />
          <Tab label="cocktails" />
        </Tabs>
        <Grid container spacing={2}>
          {drinks.map((drink) => (
              <Grid item xs={12} sm={6} md={3} key={drink.id}>
                <Card>
                  <CardActionArea>
                    <CardMedia
                        component="img"
                        height="150"
                        image={`${process.env.PUBLIC_URL}${drink.image}`}
                        alt={drink.name}
                        style={{ objectFit: "contain" }}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {drink.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {drink.description}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                  <CardActions>
                    <Button onClick={() => handleAddToCart(drink)}>add</Button>
                  </CardActions>
                </Card>
              </Grid>
          ))}
        </Grid>

        <Badge badgeContent={cart.length} color="error" anchorOrigin={{ vertical: 'top', horizontal: 'right' }} sx={{ position: 'fixed', right: 25, bottom: 95, zIndex: 1 }}>
          <Fab color="primary" aria-label="cart" style={{ position: 'fixed', right: 20, bottom: 50, zIndex: 0 }}>
            <ShoppingCartOutlinedIcon />
          </Fab>
        </Badge>

        <Snackbar open={alertOpen} autoHideDuration={1000} onClose={handleCloseAlert}>
          <Alert onClose={handleCloseAlert} severity="success" sx={{ width: '100%' }}>
            Added drink to cart
          </Alert>
        </Snackbar>
      </Container>
  );
};

export default CardView;