import React from "react";
import { motion } from "framer-motion";

export default function Home({ setPlaceType, setRoute }) {
  return (
    <div className="w-full min-h-screen bg-black text-white overflow-x-hidden">

      {/* HERO SECTION */}
      <section className="relative h-screen w-full overflow-hidden">
        <img
          src="/static/bhoo.webp"
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/90"></div>

        <div className="relative z-10 px-8 md:px-20 pt-32">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-5xl md:text-7xl font-extrabold leading-tight drop-shadow-lg"
          >
            SMART TOURIST <br /> SAFETY PORTAL
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            className="max-w-xl mt-6 text-gray-300 text-lg"
          >
            AI-powered safety monitoring, real-time SOS alerts, emergency
            coordination, and safe travel guidance — all in one powerful portal.
          </motion.p>

          <button className="mt-6 bg-blue-500 px-6 py-3 rounded-2xl text-white font-semibold hover:bg-blue-600 transition">
            Explore Now
          </button>
        </div>
      </section>

      {/* SAFETY RESOURCES */}
      <section className="px-8 md:px-20 py-16 bg-black">
        <h2 className="text-3xl font-bold mb-6">EXPLORE SAFETY RESOURCES</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         {[
  {
    title: "Nearby Hospitals",
    type: "hospital",
    img: "...",
  },
  {
    title: "Police Stations",
    type: "police",
    img: "...",
  },
  {
    title: "Restaurants",
    type: "restaurant",
    img: "...",
  },
].map((item, i) => (
  <motion.div
    key={i}
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    onClick={() => {
      setPlaceType(item.type);
      setRoute("map");
    }}
    className="rounded-2xl overflow-hidden shadow-xl bg-gray-900 cursor-pointer hover:scale-105 transition-transform"
  >
    <img
      src={item.img}
      className="w-full h-56 object-cover opacity-80"
    />
    <div className="p-6">
      <h3 className="text-xl font-semibold">{item.title}</h3>
    </div>
  </motion.div>
))}

        </div>
      </section>

      {/* TRAVEL IMAGES GRID */}
      <section className="relative w-full px-8 py-20 bg-gray-950">
        <h2 className="text-4xl font-bold text-center mb-16">
          Safe Travel, Beautiful Destinations
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {["/static/images/place1.jpg", "/static/images/place2.jpg", "/static/images/place3.jpg"].map((src, i) => (
            <motion.img
              key={i}
              src={src}
              whileHover={{ scale: 1.05 }}
              className="rounded-2xl shadow-lg object-cover w-full h-64"
            />
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 text-center text-gray-500 border-t border-gray-800">
        © {new Date().getFullYear()} Tourist Safety Portal — Stay Safe, Travel Smart
      </footer>
    </div>
  );
}
