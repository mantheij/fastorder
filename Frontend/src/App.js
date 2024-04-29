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

function App() {
  return (
    <Router>
      <div className="App">
        {/* Inhalte über der Navigation */}
        <TablesProvider>
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/card" element={<CardView />} />
          <Route path="/customer" element={<CustomerView />} />
          <Route path="/signin" element={<SignInView />} />
          <Route path="/table-selection" element={<TableSelectionView />}/>
        </Routes>
        </TablesProvider>
        {/* Konstante Navigation am unteren Rand */}
        <LabelBottomNavigation />
      </div>
    </Router>

  );
}

export default App;
