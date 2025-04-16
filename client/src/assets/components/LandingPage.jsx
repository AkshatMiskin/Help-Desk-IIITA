import React from "react";
import { useNavigate } from "react-router-dom";
import { Send, Ticket } from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate(path);
      localStorage.setItem("redirectAfterLogin", path);
    } else {
      // Save the intended path to localStorage before redirecting to login
      
      navigate("/login");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-4 w-full">
      <h2 className="text-4xl sm:text-5xl font-bold text-indigo-400 mb-4">
        Welcome to IIITA Help Desk
      </h2>
      <p className="text-gray-300 max-w-2xl mb-8 text-lg">
        A unified platform to raise and track complaints for your hostel, campus, and other facilities.
      </p>

      <div className="flex gap-6">
        <button
          onClick={() => handleNavigate("/complaint")}
          className="inline-flex cursor-pointer items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition"
        >
          <Send className="w-5 h-5" />
          Submit a Ticket
        </button>
        <button
          onClick={() => handleNavigate("/track")}
          className="inline-flex cursor-pointer items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-medium transition"
        >
          <Ticket className="w-5 h-5" />
          View Existing Ticket
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
