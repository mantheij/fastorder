import * as React from "react";
import { useNavigate } from "react-router-dom";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import TableBar from "@mui/icons-material/TableBarOutlined";
import { AccountCircle, Settings, SummarizeOutlined, ExitToApp } from "@mui/icons-material";
import Cookies from "js-cookie";

export default function LabelBottomNavigation({ userRole, onLogout }) {
    const [value, setValue] = React.useState("/");
    const navigate = useNavigate();

    const handleChange = (event, newValue) => {
        setValue(newValue);
        navigate(newValue);
    };

    const handleLogout = () => {
        Cookies.remove('accessGranted');
        Cookies.remove('userRole');
        onLogout();
        navigate('/');
    };

    return (
        <BottomNavigation
            sx={{
                height: "8%",
                width: "100%",
                position: "fixed",
                bottom: 0,
                backgroundColor: "#ffffff",
                boxShadow: "0px 1px 10px rgba(0,0,0,0.3)",
                borderRadius: "10px 10px 0 0"
            }}
            value={value}
            onChange={handleChange}
        >
            {userRole === "admin" && (
            <BottomNavigationAction
                value="/chef"
                icon={<img src="/logo.png" alt="Special" style={{ width: 45, height: 45 }}/>}
            />
            )}
            <BottomNavigationAction
                label="Selection"
                value="/table-selection"
                icon={<TableBar />}
                sx={{ '&:hover': { backgroundColor: '#f0f0f0' } }} // Hover-Effekt
            />
            {userRole !== "guest" && (
                <BottomNavigationAction
                    label="Employee"
                    value="/orders"
                    icon={<SummarizeOutlined />}
                    sx={{ '&:hover': { backgroundColor: '#f0f0f0' } }} // Hover-Effekt
                />
            )}
            <BottomNavigationAction
                label="User"
                value="/user"
                icon={<AccountCircle />}
                sx={{ '&:hover': { backgroundColor: '#f0f0f0' } }} // Hover-Effekt
            />
            {userRole === "admin" && (
                <BottomNavigationAction
                    label="Settings"
                    value="/settings"
                    icon={<Settings />}
                    sx={{ '&:hover': { backgroundColor: '#f0f0f0' } }} // Hover-Effekt
                />
            )}
            <BottomNavigationAction
                label="Logout"
                value="/logout"
                icon={<ExitToApp />}
                onClick={handleLogout}
                sx={{ '&:hover': { backgroundColor: '#f0f0f0' } }} // Hover-Effekt
            />
        </BottomNavigation>
    );
}
