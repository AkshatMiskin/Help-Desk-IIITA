import React from "react";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-6 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="text-sm">
              &copy; 2025 IIITA Help Desk. Made with <span className="text-red-500">♥</span> by Team.
            </p>
            <p className="text-sm mt-2">
              Check out the{" "}
              <a
                href="https://github.com/kalim-Asim/Help-Desk-IIITA"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:underline"
              >
                source code on GitHub
              </a>{" "}
              to learn more or contribute.
            </p>
          </div>

          <div className="flex space-x-6">
            <a
              href="https://github.com/kalim-Asim"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-400 transition duration-300 text-xl"
              aria-label="GitHub"
            >
              <FaGithub />
            </a>
            <a
              href="https://linkedin.com/in/name"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-400 transition duration-300 text-xl"
              aria-label="LinkedIn"
            >
              <FaLinkedin />
            </a>
            <a
              href="https://instagram.com/name"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-400 transition duration-300 text-xl"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
