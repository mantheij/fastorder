import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from "react-router-dom";
import LabelBottomNavigation from "./navigation";
import ProductView from "./views/Customer/ProductView";
import CustomerView from "./views/Customer/CustomerView";
import SignInView from "./views/SignIn/SignInView";
import "./App.css";
import { TablesProvider } from "./model/TablesContext";
import CustomerStartUpButton from "./views/Customer/CustomerView";
import CardView from "./views/Customer/CardView";
import CompletedOrdersView from "./views/Employee/CompletedOrdersView";
import TableDetails from "./views/Chef/TableDetails";
import ViewOrders from "./views/Chef/ViewOrders";
import TableSelectionView from "./views/Selection/TableSelectionView";
import SettingsView from "./views/Settings/SettingsView";
import ProductSettings from "./views/Settings/ProductSettings";
import HomeView from "./views/Chef/HomeView";
import Cookies from "js-cookie";
import { AuthProvider } from './AuthContext';
import EmployeeSettings from "./views/Settings/EmployeeSettings";
import EmployeeView from "./views/Employee/EmployeeView"

function App() {
    const [accessGranted, setAccessGranted] = useState(false);
    const [userRole, setUserRole] = useState("");

    useEffect(() => {
        const access = Cookies.get('accessGranted');
        const role = Cookies.get('userRole');
        if (access && role) {
            setAccessGranted(true);
            setUserRole(role);
        }
    }, []);

    const handleButtonClick = (role) => {
        setAccessGranted(true);
        setUserRole(role);
        Cookies.set('accessGranted', 'true', { expires: 1 }); // 1 day expiration
        Cookies.set('userRole', role, { expires: 1 });
    };

    const handleLogout = () => {
        setAccessGranted(false);
        setUserRole("");
        Cookies.remove('accessGranted');
        Cookies.remove('userRole');
    };

    return (
        <AuthProvider>
            <Router>
                <div className="App">
                    <TablesProvider>
                        <Routes>
                            {!accessGranted && <Route path="/" element={<SignInView onButtonClick={handleButtonClick} />} />}
                            {accessGranted ? (
                                <>
                                    <Route path="/" element={<Navigate to="/table-selection" />} />
                                    {userRole !== "guest" && <Route path="/orders" element={<EmployeeView />} />}
                                    {userRole === "admin" && <Route path="/chef" element={<HomeView />} />}
                                    {userRole === "admin" && <Route path="/settings" element={<SettingsView />} />}
                                    {userRole === "admin" && <Route path="/settings/product" element={<ProductSettings />} />}
                                    {userRole === "admin" && <Route path="/settings/employee" element={<EmployeeSettings />} />}
                                    <Route path="/customer" element={<CustomerView />} />
                                    <Route path="/table-selection" element={<TableSelectionView />} />
                                    <Route path="/orders/completed" element={<CompletedOrdersView />} />
                                    <Route path="/customerStart/:tableId" element={<CustomerStartUpButton />} />
                                    <Route path="/product/:tableId" element={<ProductView />} />
                                    <Route path="/product/:tableId/card" element={<CardView />} />
                                    {userRole === "admin" && <Route path="/chef/tableDetails/:tableId" element={<TableDetails />} />}
                                    {userRole === "admin" && <Route path="/chef/tableDetails/:tableId/viewOrders" element={<ViewOrders />} />}
                                </>
                            ) : (
                                <Route path="*" element={<Navigate to="/" />} />
                            )}
                        </Routes>
                        <NavigationWrapper accessGranted={accessGranted} userRole={userRole} handleLogout={handleLogout} />
                    </TablesProvider>
                </div>
            </Router>
        </AuthProvider>
    );
}

const NavigationWrapper = ({ accessGranted, userRole, handleLogout }) => {
    const location = useLocation();
    const hideNavBar = userRole === "guest" && ["/customerStart", "/product"].some(path => location.pathname.startsWith(path));

    if (accessGranted && !hideNavBar) {
        return <LabelBottomNavigation userRole={userRole} onLogout={handleLogout} />;
    }
    return null;
};

export default App;
