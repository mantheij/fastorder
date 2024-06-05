// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LabelBottomNavigation from "./navigation";
import ProductView from "./views/ProductView";
import CustomerView from "./views/CustomerView";
import SignInView from "./views/SignInView";
import "./App.css";
import {TablesProvider} from "./model/TablesContext";
import EmployeeView from "./views/EmployeeView";
import CustomerStartUpButton from "./views/CustomerView";
import CardView from "./views/CardView";
import CompletedOrdersView from "./views/CompletedOrdersView";
import TableDetails from "./views/Chef/TableDetails";
import ViewOrders from "./views/Chef/ViewOrders";
import TableSelectionView from "./views/Selection/TableSelectionView";
import SettingsView from "./views/Settings/SettingsView";
import ProductSettings from "./views/Settings/ProductSettings";
import HomeView from "./views/Chef/HomeView";

function App() {
  return (
    <Router>
      <div className="App">
        {/* Inhalte über der Navigation */}
        <TablesProvider>
            <Routes>
                <Route path="/" element={<SignInView />} />
                <Route path="/customer" element={<CustomerView />} />
                <Route path="/table-selection" element={<TableSelectionView />} />
                <Route path="/chef" element={<HomeView />} />
                <Route path="/orders" element={<EmployeeView />} />
                <Route path="/orders/completed" element={<CompletedOrdersView />} />
                <Route path="/customerStart/:tableId" element={<CustomerStartUpButton />} />
                <Route path="/product/:tableId" element={<ProductView />} />
                <Route path="/product/:tableId/card" element={<CardView />} />
                <Route path="/settings" element={<SettingsView />} />
                <Route path="/settings/product" element={<ProductSettings />} />
                <Route path="/chef/tableDetails/:tableId" element={<TableDetails />} />
                <Route path="/chef/tableDetails/:tableId/viewOrders" element={<ViewOrders />} />
            </Routes>
        </TablesProvider>
        {/* Konstante Navigation am unteren Rand */}
        <LabelBottomNavigation />
      </div>
    </Router>

  );
}

export default App;
