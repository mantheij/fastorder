// LabelBottomNavigation.js
import * as React from "react";
import { useNavigate } from "react-router-dom";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Login from "@mui/icons-material/LoginOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import TableBar from "@mui/icons-material/TableBarOutlined";
import {AccountCircle} from "@mui/icons-material";

export default function LabelBottomNavigation() {
  const [value, setValue] = React.useState("/");
  const navigate = useNavigate();

  const handleChange = (event, newValue) => {
    setValue(newValue);
    navigate(newValue); // Wechseln Sie zur neuen Route
  };

  return (
    <BottomNavigation
      sx={{height: "8%", width: "100%", position: "fixed", bottom: 0 }}
      value={value}
      onChange={handleChange}
    >
      <BottomNavigationAction
          value="/"
          icon={<img src="/logo.png" alt="Special" style={{ width: 45, height: 45 }}/>}
      />
      <BottomNavigationAction
          label="Table"
          value="/table"
          icon={<TableBar />}
      />
      <BottomNavigationAction
        label="Card"
        value="/card"
        icon={<ShoppingCartOutlinedIcon />}
      />
      <BottomNavigationAction
        label="User"
        value="/user"
        icon={<AccountCircle />}
      />
      <BottomNavigationAction
        label="Sign-in"
        value="/signin"
        icon={<Login />}
      />
    </BottomNavigation>
  );
}
