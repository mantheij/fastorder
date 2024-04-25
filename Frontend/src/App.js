// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LabelBottomNavigation from "./navigation";
import HomeView from "./views/HomeView";
import CardView from "./views/CardView";
import TableView from "./views/TableView";
import SignInView from "./views/SignInView";
import "./App.css";
import EmployeeView from "./views/EmployeeView";

function App() {
  return (
    <Router>
      <div className="App">
        {/* Inhalte über der Navigation */}
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/card" element={<CardView />} />
          <Route path="/table" element={<TableView />} />
          <Route path="/signin" element={<SignInView />} />
          <Route path="/employee" element={<EmployeeView />} />
        </Routes>
        {/* Konstante Navigation am unteren Rand */}
        <LabelBottomNavigation />
      </div>
    </Router>
  );
}

export default App;
