// LabelBottomNavigation.js
import * as React from "react";
import { useNavigate } from "react-router-dom";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Login from "@mui/icons-material/LoginOutlined";
import House from "@mui/icons-material/HouseOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import StoreIcon from '@mui/icons-material/Store';
import TableBar from "@mui/icons-material/TableBarOutlined";

export default function LabelBottomNavigation() {
  const [value, setValue] = React.useState("/");
  const navigate = useNavigate();

  const handleChange = (event, newValue) => {
    setValue(newValue);
    navigate(newValue); // Wechseln Sie zur neuen Route
  };

  return (
    <BottomNavigation
      sx={{ width: "100%", position: "fixed", bottom: 0 }}
      value={value}
      onChange={handleChange}
    >
      <BottomNavigationAction label="Home" value="/" icon={<House />} />
      <BottomNavigationAction
        label="Card"
        value="/card"
        icon={<ShoppingCartOutlinedIcon />}
      />
      <BottomNavigationAction
          label="Customer"
          value="/customer"
          icon={<StoreIcon />}
      />
      <BottomNavigationAction
        label="Table"
        value="/table"
        icon={<TableBar />}
      />
      <BottomNavigationAction
        label="Sign-in"
        value="/signin"
        icon={<Login />}
      />
    </BottomNavigation>
  );
}
