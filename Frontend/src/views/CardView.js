// CardView.js
import React, { useState, useEffect } from "react";
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
} from "@mui/material";

const CardView = () => {
  const [drinks, setDrinks] = useState([]);
  const [value, setValue] = useState(0); // State für den aktuell ausgewählten Tab

  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/drinks.json`)
      .then((response) => response.json())
      .then((data) => setDrinks(data))
      .catch((error) => console.error("Fehler beim Laden der Drinks:", error));
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const filteredDrinks = drinks.filter((drink) => {
    if (value === 0) return true; // Alle Getränke
    else if (value === 1) return drink.type === "non-alcoholic";
    else if (value === 2) return drink.type === "wine";
    else if (value === 3) return drink.type === "sparkling wine";
    else if (value === 4) return drink.type === "cocktail";
    return false;
  });

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
        {filteredDrinks.map((drink) => (
          <Grid item xs={12} sm={6} md={3} key={drink.id}>
            <Card>
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="150"
                  image={`${process.env.PUBLIC_URL}${drink.image}`}
                  alt={drink.name}
                  style={{ objectFit: "contain" }} // Fügt die objectFit eigenschaft hinzu
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
                <Button>add</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default CardView;
