import React from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardEdit, Search } from "lucide-react";

const UserDashboard = () => {
  const navigate = useNavigate();

  const handleSubmitTicket = () => {
    navigate("/complaint");
  };

  const handleTrackTicket = () => {
    navigate("/track");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-6 text-indigo-400">
          Welcome to IIITA Help Desk
        </h1>

        <p className="text-gray-300 mb-6">
          How can we assist you today?
        </p>

        <div className="flex flex-col space-y-4">
          <button
            onClick={handleSubmitTicket}
            className="flex items-center cursor-pointer justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white font-medium transition"
          >
            <ClipboardEdit className="w-5 h-5" />
            Submit a Ticket
          </button>

          <button
            onClick={handleTrackTicket}
            className="flex items-center cursor-pointer justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-medium transition"
          >
            <Search className="w-5 h-5" />
            Track Ticket
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
