// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LabelBottomNavigation from "./navigation";
import HomeView from "./views/HomeView";
import CardView from "./views/CardView";
import CustomerView from "./views/CustomerView";
import SignInView from "./views/SignInView";
import "./App.css";
import TableSelectionView from "./views/TableSelectionView";
import {TablesProvider} from "./model/TablesContext";
import EmployeeView from "./views/EmployeeView";

function App() {
  return (
    <Router>
      <div className="App">
        {/* Inhalte über der Navigation */}
        <TablesProvider>
        <Routes>
          <Route path="/" element={<TableSelectionView />} />
          <Route path="/customer" element={<CustomerView />} />
          <Route path="/signin" element={<SignInView />} />
          <Route path="/chef" element={<HomeView />}/>
          <Route path="/orders" element={<EmployeeView />}/>
        </Routes>
        </TablesProvider>
        {/* Konstante Navigation am unteren Rand */}
        <LabelBottomNavigation />
      </div>
    </Router>

  );
}

export default App;
