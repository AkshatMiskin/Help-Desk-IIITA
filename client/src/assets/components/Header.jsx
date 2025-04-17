import React, { useEffect, useState } from "react";
import { Building2 } from "lucide-react";
import { jwtDecode } from "jwt-decode"; // Make sure you use named import
import { Link, useLocation, useNavigate } from "react-router-dom";

const Header = ({ isLoggedIn, onLogout }) => {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          setUserName(decoded.name  || "User");
        } catch (err) {
          console.error("Invalid token", err);
        }
      }
    }
  }, [isLoggedIn]);

  const handleLogoutClick = () => {
    localStorage.removeItem("token");
    onLogout(); // Notify App.jsx to update isLoggedIn state
    navigate("/login");
  };

  return (
    <header className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-700 shadow-md backdrop-blur bg-opacity-80 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building2 className="h-8 w-8 text-white" />
            <h1 className="text-xl font-bold text-white tracking-tight">
              IIITA Help Desk
            </h1>
          </div>

          {!isLoggedIn ? (
            <div className="flex gap-2">
              <Link
                to="/login"
                className="px-4 py-1.5 text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 rounded-full transition duration-200"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-1.5 text-sm font-medium text-indigo-600 bg-white hover:bg-gray-100 rounded-full transition duration-200"
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <span className="text-white font-medium">{userName}</span>
              <button
                onClick={handleLogoutClick}
                className="px-4 py-1.5 text-sm cursor-pointer font-medium text-white bg-red-500 hover:bg-red-600 rounded-full transition duration-200"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

