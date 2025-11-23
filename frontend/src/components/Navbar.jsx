import { motion } from "framer-motion";
import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/dashboard", label: "Dashboard" },
    { path: "/contacts", label: "Contacts" },
    { path: "/auth", label: "Login" },
  ];

  return (
    <nav className="w-full bg-white/95 backdrop-blur-md text-gray-800 px-6 py-4 flex justify-between items-center shadow-md fixed top-0 z-50 border-b border-gray-200">
      <Link to="/" className="flex items-center gap-2">
        <motion.h1
          whileHover={{ scale: 1.05 }}
          className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent cursor-pointer"
        >
          Tourist Safety Portal
        </motion.h1>
      </Link>

      <div className="flex gap-2 items-center">
        {navLinks.map((link) => (
          <Link key={link.path} to={link.path}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                isActive(link.path)
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              {link.label}
            </motion.button>
          </Link>
        ))}
      </div>
    </nav>
  );
}
