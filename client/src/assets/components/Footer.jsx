import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-center items-center text-center md:text-left">
          <p className="text-sm">&copy; 2025 IIITA Help Desk.</p>
          {/* <div className="flex space-x-6 mt-4 md:mt-0"> */}
            {/* <a href="#" className="hover:text-indigo-400 transition duration-300">Privacy Policy</a>
            <a href="#" className="hover:text-indigo-400 transition duration-300">Terms of Service</a> */}
          {/* </div> */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
