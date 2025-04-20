import React, { useEffect, useState } from "react";
import { Building2, ArrowLeft } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Header = ({ isLoggedIn, onLogout }) => {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isLoggedIn) {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          setUserName(decoded.name || "User");
        } catch (err) {
          console.error("Invalid token", err);
        }
      }
    }
  }, [isLoggedIn]);

  const handleLogoutClick = () => {
    localStorage.removeItem("token");
    onLogout();
    navigate("/login");
  };

  const handleBackClick = () => {
    navigate("/");
  };

  return (
    <header className="bg-gradient-to-r from-indigo-800 via-indigo-700 to-indigo-800 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {location.pathname !== "/" && (
              <button
                onClick={handleBackClick}
                className="text-white hover:bg-indigo-600 p-1.5 rounded-full transition duration-200"
                aria-label="Back to Home"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            )}
            <Building2 className="h-8 w-8 text-white" />
            <h1 className="text-2xl font-bold text-white tracking-tight">
              IIITA Help Desk
            </h1>
          </div>

          {!isLoggedIn ? (
            <div className="flex gap-3">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 rounded-full transition duration-200"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 text-sm font-medium text-indigo-600 bg-white hover:bg-gray-100 rounded-full transition duration-200"
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1 bg-white text-indigo-700 rounded-full font-medium text-sm shadow-sm">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-3 py-1 text-indigo-700 rounded-full font-medium text-sm hover:bg-gray-100"
                >
                  <span className="bg-indigo-200 text-indigo-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                    {userName.charAt(0).toUpperCase()}
                  </span>
                  <span>{userName}</span>
                </Link>

              </div>
              <button
                onClick={handleLogoutClick}
                className="px-4 py-2 text-sm cursor-pointer font-medium text-white bg-red-500 hover:bg-red-600 rounded-full transition duration-200"
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
