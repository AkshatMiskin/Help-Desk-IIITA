import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Send, Ticket, ShieldCheck, Clock, MessagesSquare } from "lucide-react";
import iiitaImage from "../assets/iiita.jpeg";
import { jwtDecode } from "jwt-decode";
import FloatingIcons from "./ui/FloatingIcons"; // Import the new component
import FeatureCard from "./ui/FeatureCard"
const LandingPage = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setUserName(decoded.name || "User");
    }
  }, []);

  const handleNavigate = (path) => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate(path);
      localStorage.setItem("redirectAfterLogin", path);
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center py-8 px-4 w-full">
      <FloatingIcons />
      
      <h2 className="text-4xl sm:text-5xl font-bold text-indigo-400 mb-2 z-10">
        {userName ? `Welcome ${userName}` : "Welcome to IIITA Help Desk"}
      </h2>
      <p className="text-lg text-gray-300 max-w-2xl mb-6 z-10">
        {userName ? "Here's how you can manage and monitor your complaints easily." :
          "A unified platform for students and staff to raise, manage, and track complaints across hostels, departments, and campus facilities at IIITA."}
      </p>

      <img
        src={iiitaImage}
        alt="IIITA Campus"
        className="w-2xs sm:max-w-sm md:max-w-md lg:max-w-lg h-auto mb-10 rounded-lg shadow-lg object-cover z-10"
      />

      <div className="flex gap-6 mb-10 z-10">
        <button
          onClick={() => handleNavigate("/select-category")}
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl text-left z-10">
        <FeatureCard
          icon={<ShieldCheck className="w-6 h-6 text-indigo-400" />}
          title="Secure Complaint Filing"
          description="Easily submit complaints using a secure and structured ticket system categorized by facility or department."
        />
        <FeatureCard
          icon={<Clock className="w-6 h-6 text-indigo-400" />}
          title="Real-Time Tracking"
          description="Track the progress of your complaint in real-time with updates on status changes and resolution timeline."
        />
        <FeatureCard
          icon={<MessagesSquare className="w-6 h-6 text-indigo-400" />}
          title="Transparent Communication"
          description="Engage directly with assigned personnel or administrators via the ticket thread to clarify issues or request updates."
        />
      </div>
    </div>
  );
};

export default LandingPage;