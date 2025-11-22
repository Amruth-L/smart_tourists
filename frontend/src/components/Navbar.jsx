import React from "react";

export default function Navbar({ setRoute }) {
  return (
    <nav className="w-full bg-black/80 text-white px-6 py-4 flex justify-between items-center shadow-lg backdrop-blur-md fixed top-0 z-50">
      <h1
        className="text-2xl font-bold cursor-pointer"
        onClick={() => setRoute("home")}
      >
        Tourist Safety Portal
      </h1>

      <div className="flex gap-6 text-lg">
        <button onClick={() => setRoute("home")} className="hover:text-blue-400">
          Home
        </button>
        <button
          onClick={() => setRoute("dashboard")}
          className="hover:text-blue-400"
        >
          Dashboard
        </button>
        <button
          onClick={() => setRoute("contacts")}
          className="hover:text-blue-400"
        >
          Contacts
        </button>
        <button
          onClick={() => setRoute("login")}
          className="hover:text-blue-400"
        >
          Login
        </button>
      </div>
    </nav>
  );
}
