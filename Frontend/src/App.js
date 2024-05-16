// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LabelBottomNavigation from "./navigation";
import HomeView from "./views/HomeView";
import ProductView from "./views/ProductView";
import CustomerView from "./views/CustomerView";
import SignInView from "./views/SignInView";
import "./App.css";
import TableSelectionView from "./views/TableSelectionView";
import {TablesProvider} from "./model/TablesContext";
import EmployeeView from "./views/EmployeeView";
import CustomerStartUpButton from "./views/CustomerView";
import CardView from "./views/CardView";
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
          <Route path="/chef" element={<HomeView />}/>
          <Route path="/orders" element={<EmployeeView />}/>
          <Route path="/customerStart/:tableId" element ={<CustomerStartUpButton />}/>
          <Route path="/product/:tableId" element ={<ProductView />}/>
          <Route path="/product/:tableId/card" element ={<CardView />}/>
        </Routes>
        </TablesProvider>
        {/* Konstante Navigation am unteren Rand */}
        <LabelBottomNavigation />
      </div>
    </Router>

  );
}

export default App;
