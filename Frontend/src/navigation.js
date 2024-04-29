import * as React from "react";
import { useNavigate } from "react-router-dom";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Login from "@mui/icons-material/LoginOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import StoreIcon from '@mui/icons-material/Store';
import TableBar from "@mui/icons-material/TableBarOutlined";
import {AccountCircle} from "@mui/icons-material";

export default function LabelBottomNavigation() {
  const [value, setValue] = React.useState("/");
  const navigate = useNavigate();

  const handleChange = (event, newValue) => {
    setValue(newValue);
    navigate(newValue);
  };

  return (
      <BottomNavigation
          sx={{
            height: "8%",
            width: "100%",
            position: "fixed",
            bottom: 0,
            backgroundColor: "#ffffff", // neutrale weiße Farbe
            boxShadow: "0px 1px 10px rgba(0,0,0,0.3)", // Schatten für Tiefe
            borderRadius: "10px 10px 0 0" // Abgerundete obere Ecken
          }}
          value={value}
          onChange={handleChange}
      >
        <BottomNavigationAction
            value="/chef"
            icon={<img src="/logo.png" alt="Special" style={{ width: 45, height: 45 }}/>}
        />
        <BottomNavigationAction
            label="Auswahl"
            value="/"
            icon={<TableBar />}
            sx={{ '&:hover': { backgroundColor: '#f0f0f0' } }} // Hover-Effekt
        />
        <BottomNavigationAction
            label="Orders"
            value="/orders"
            icon={<ShoppingCartOutlinedIcon />}
            sx={{ '&:hover': { backgroundColor: '#f0f0f0' } }} // Hover-Effekt
        />
        <BottomNavigationAction
            label="Benutzer"
            value="/user"
            icon={<AccountCircle />}
            sx={{ '&:hover': { backgroundColor: '#f0f0f0' } }} // Hover-Effekt
        />
        <BottomNavigationAction
            label="Anmeldung"
            value="/signin"
            icon={<Login />}
            sx={{ '&:hover': { backgroundColor: '#f0f0f0' } }} // Hover-Effekt
        />
      </BottomNavigation>
  );
}
