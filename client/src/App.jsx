import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { ToastContainer } from "react-toastify";
import LandingPage from "./assets/components/LandingPage";
import LoginForm from "./assets/components/LoginForm";
import SignupForm from "./assets/components/SignupForm";
import ComplaintForm from "./assets/components/ComplaintForm";
import AdminDashboard from "./assets/components/AdminDashboard";
import UserDashboard from "./assets/components/UserDashboard";
import Header from "./assets/components/Header";
import Footer from "./assets/components/Footer";
import Track from "./assets/components/Track";
import CategorySelection from "./assets/components/CategorySelection";
// import TrackPage from "./components/TrackPage"; 
// import NotFound from "./components/NotFound"; 

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("Decoded token:", decoded);
        setIsLoggedIn(true);
        setIsAdmin(decoded.isAdmin === true);
        console.log("isAdmin", isAdmin);
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
        setIsAdmin(decoded.isAdmin);
        setIsLoggedIn(true);
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
            {/* <Route path="/" element={<Navigate to={isLoggedIn ? (isAdmin ? "/admin" : "/dashboard") : "/login"} />} /> */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={isLoggedIn ? (<Navigate to={isAdmin ? "/admin" : "/dashboard"} />
                ) : (<LoginForm onLogin={handleLogin} />)
              }
            />

            <Route 
              path="/signup" element={ isLoggedIn ? ( <Navigate to={isAdmin ? "/admin" : "/dashboard"} />
              ) : ( <SignupForm onSignupSuccess={() => (window.location.href = "/login")} /> )
            }
            />

            <Route
              path="/dashboard"
              element={isLoggedIn && !isAdmin ? <UserDashboard /> : <Navigate to="/" />}
            />

            <Route 
              path="/select-category" 
              element={isLoggedIn && !isAdmin && <CategorySelection />} 
            />

            <Route
              path="/complaint"
              element={isLoggedIn && !isAdmin ? <ComplaintForm /> : <Navigate to="/" />}
            />

            <Route
              path="/admin"
              element={isLoggedIn && isAdmin ? <AdminDashboard /> : <Navigate to="/" />}
            />
            <Route
              path="/track"
              element={isLoggedIn && !isAdmin ? <Track /> : <Navigate to="/" />}
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
