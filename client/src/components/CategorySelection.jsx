import React from "react";
import { useNavigate } from "react-router-dom";
import FloatingIcons from "./ui/FloatingIcons";

const categories = [
  "Network",
  "Cleaning",
  "Carpentry",
  "PC Maintenance",
  "Plumbing",
  "Electricity",
];

const CategorySelection = () => {
  const navigate = useNavigate();
  const handleSelect = (category) => {
    navigate("/complaint", { state: { category } });
  };

  return (
    <main className="flex-grow mx-auto px-4 sm:px-6 lg:px-8 py-8"> 
    <div className="flex flex-col items-center justify-center px-4 py-24">
      <FloatingIcons />
      <h2 className="text-2xl sm:text-3xl font-semibold text-indigo-400 mb-6">
        What can we help you with?
      </h2>

      <div className="w-full max-w-md space-y-3">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleSelect(cat)}
            className="w-full cursor-pointer text-left px-6 py-3 border border-gray-700 text-indigo-400 hover:bg-gray-800 rounded-lg transition duration-200 font-medium"
          >
            » {cat}
          </button>
        ))}
      </div>
    </div>
    </main>
  );
};

export default CategorySelection;