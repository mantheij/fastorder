// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LabelBottomNavigation from "./navigation";
import HomeView from "./views/HomeView";
import CardView from "./views/CardView";
import SignInView from "./views/SignInView";
import "./App.css";
import UserView from "./views/UserView";

function App() {
  return (
    <Router>
      <div className="App">
        {/* Inhalte über der Navigation */}
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/card" element={<CardView />} />
          <Route path="/user" element={<UserView/>} />
          <Route path="/signin" element={<SignInView />} />
        </Routes>
        {/* Konstante Navigation am unteren Rand */}
        <LabelBottomNavigation />
      </div>
    </Router>
  );
}

export default App;
