import React from "react";
import { useNavigate } from "react-router-dom";
import FloatingIcons from "./ui/FloatingIcons";

const categories = [
  {
    name: "Network",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
      </svg>
    ),
    description: "WiFi issues, internet connectivity, network access problems"
  },
  {
    name: "Cleaning",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v2H5V5z" />
      </svg>
    ),
    description: "Janitorial services, waste disposal, floor cleaning"
  },
  {
    name: "Carpentry",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    description: "Furniture repair, door and window issues, woodwork"
  },
  {
    name: "PC Maintenance",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    description: "Computer hardware issues, software problems, peripheral troubles"
  },
  {
    name: "Plumbing",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    ),
    description: "Water leakage, tap issues, drainage problems, water supply"
  },
  {
    name: "Electricity",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    description: "Power outage, electrical equipment failure, wiring problems"
  },
];

const CategorySelection = () => {
  const navigate = useNavigate();
  const handleSelect = (category) => {
    navigate("/complaint", { state: { category } });
  };

  return (
    <main className="flex-grow mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen"> 
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center justify-center pt-8 pb-16">
          <FloatingIcons />
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500 mb-3">
              IIITA Help Desk
            </h1>
            <h2 className="text-2xl sm:text-3xl font-semibold text-white">
              What can we help you with?
            </h2>
            <p className="mt-3 text-gray-400 max-w-md mx-auto">
              Select the category that best describes your issue to submit a support ticket
            </p>
            <div className="w-24 h-1 bg-indigo-500 mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <div
                key={category.name}
                onClick={() => handleSelect(category.name)}
                className="relative overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 cursor-pointer border border-gray-700 transition-all duration-300 hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-1 group"
              >
                <div className="absolute top-0 right-0 h-24 w-24 -mt-8 -mr-8 bg-indigo-500/10 rounded-full transition-transform duration-300 group-hover:scale-150"></div>
                
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-indigo-600/20 text-indigo-400 transition-all duration-300 group-hover:bg-indigo-600 group-hover:text-white">
                    {category.icon}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {category.description}
                    </p>
                  </div>
                  
                  <div className="text-gray-500 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-indigo-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-10 text-center">
            <p className="text-gray-400 text-sm">
              Need help determining the right category? Contact our support team at <a href="mailto:helpdesk@iiita.ac.in" className="text-indigo-400 hover:text-indigo-300">helpdesk@iiita.ac.in</a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CategorySelection;