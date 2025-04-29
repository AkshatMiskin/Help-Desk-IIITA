import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { ToastContainer } from "react-toastify";
import LandingPage from "./components/LandingPage";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import ComplaintForm from "./components/ComplaintForm";
import AdminDashboard from "./components/AdminDashboard";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Track from "./components/Track";
import UserDashboard from "./components/UserDashboard";
import CategorySelection from "./components/CategorySelection";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setIsLoggedIn(true);
        setIsAdmin(decoded.isAdmin === true);
      } catch (err) {
        console.error("Invalid token", err);
        localStorage.removeItem("token");
      }
    }
  }, []);


  const handleLogin = async (email, password) => {
    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (data.success && data.token) {
        localStorage.setItem("token", data.token);

        const decoded = jwtDecode(data.token);
        setIsLoggedIn(true);
        setIsAdmin(decoded.isAdmin);

      } else {
        alert("Invalid credentials");
      }
    } catch (error) {
      console.error("Login failed", error);
      alert("Server error: " + error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setIsAdmin(false);
  };

  return (
    <>
    <ToastContainer />
    <Router>
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <Header isLoggedIn={isLoggedIn} isAdmin={isAdmin} onLogout={handleLogout} />
        <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route 
              path="/" 
              element={<LandingPage />} 
            />
            <Route 
              path="/login" 
              element={isLoggedIn ? (<Navigate to={isAdmin ? "/admin" : "/dashboard"} />) : (<LoginForm onLogin={handleLogin} />)
              }
            />
            <Route 
              path="/signup"
              element={ isLoggedIn ? <Navigate to={isAdmin ? "/admin" : "/login"} /> : <SignupForm /> }
            />
            <Route
              path="/complaint"
              element={isLoggedIn && !isAdmin ? <ComplaintForm /> : <Navigate to="/" />}
            />
            <Route
              path="/admin"
              element={isAdmin && <AdminDashboard />}
            />
            <Route 
               path="/select-category" 
               element={isLoggedIn && !isAdmin ?<CategorySelection /> : <Navigate to="/" />} 
             />
            <Route
              path="/profile"
              element={isLoggedIn && !isAdmin && <UserDashboard />}
            />
            <Route
              path="/track"
              element={isLoggedIn && !isAdmin ? <Track /> : <Navigate to="/" />}
            />
            <Route
              path="/forgot-password"
              element={<ForgotPassword />}
            />
            <Route 
              path="/reset-password/:token" 
              element={<ResetPassword />} 
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
    </>
  );
};

export default App;
