import React from "react";
import { useNavigate } from "react-router-dom";

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
    console.log(category);
    navigate("/complaint", { state: { category } });
  };

  return (
    <div className="flex flex-col items-center justify-center px-4">
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
  );
};

export default CategorySelection;
