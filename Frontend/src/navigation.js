import * as React from "react";
import { useNavigate } from "react-router-dom";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import { AccountCircle, Settings, SummarizeOutlined, ExitToApp } from "@mui/icons-material";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ChecklistRtlIcon from '@mui/icons-material/ChecklistRtl';
import Cookies from "js-cookie";
import { createTheme } from "@mui/material/styles";
import { blue } from "@mui/material/colors";

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

    const theme = createTheme({
        palette: {
            primary: {
                light: blue[300],
                main: blue[500],
                dark: blue[700],
                darker: blue[900],
            }
        }
    });

    return (
        <BottomNavigation
            sx={{
                height: "8%",
                width: "100%",
                position: "fixed",
                bottom: 0,
                backgroundColor: "#ffffff",
                boxShadow: "0px 1px 10px rgba(0,0,0,0.3)",
                borderRadius: "10px 10px 0 0",
                zIndex: 99
            }}
            value={value}
            onChange={handleChange}
        >
            {userRole === "admin" && (
                <BottomNavigationAction
                    value="/chef"
                    icon={<img src="/logo.png" alt="Special" style={{ width: 45, height: 45 }} />}
                    sx={{ '& .MuiSvgIcon-root': { color: value === '/chef' ? theme.palette.primary.main : 'black' } }}
                />
            )}
            <BottomNavigationAction
                label="Order"
                value="/table-selection"
                icon={<AddShoppingCartIcon style={{ width: 35, height: 35 }} />}
                sx={{
                    '&:hover': { backgroundColor: '#f0f0f0' },
                    '& .MuiSvgIcon-root': { color: value === '/table-selection' ? theme.palette.primary.main : 'black' }
                }}
            />
            {userRole !== "guest" && (
                <BottomNavigationAction
                    label="Employee"
                    value="/orders"
                    icon={<ChecklistRtlIcon style={{ width: 35, height: 35 }} />}
                    sx={{
                        '&:hover': { backgroundColor: '#f0f0f0' },
                        '& .MuiSvgIcon-root': { color: value === '/orders' ? theme.palette.primary.main : 'black' }
                    }}
                />
            )}
            {userRole === "admin" && (
                <BottomNavigationAction
                    label="Settings"
                    value="/settings"
                    icon={<Settings style={{ width: 35, height: 35 }} />}
                    sx={{
                        '&:hover': { backgroundColor: '#f0f0f0' },
                        '& .MuiSvgIcon-root': { color: value === '/settings' ? theme.palette.primary.main : 'black' }
                    }}
                />
            )}
            <BottomNavigationAction
                label="Logout"
                value="/logout"
                icon={<ExitToApp style={{ width: 35, height: 35 }} />}
                onClick={handleLogout}
                sx={{
                    '&:hover': { backgroundColor: '#f0f0f0' },
                    '& .MuiSvgIcon-root': { color: value === '/logout' ? theme.palette.primary.main : 'black' }
                }}
            />
        </BottomNavigation>
    );
}
