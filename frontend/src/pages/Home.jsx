import React from "react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import Card from "../components/Card";

export default function Home() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const handlePlaceTypeClick = (type) => {
    setSearchParams({ type });
    navigate("/map");
  };

  const safetyResources = [
    {
      title: "Nearby Hospitals",
      type: "hospital",
      icon: "🏥",
      description: "Find the nearest medical facilities",
      gradient: "from-red-500 to-pink-500",
    },
    {
      title: "Police Stations",
      type: "police",
      icon: "🚔",
      description: "Locate police stations in your area",
      gradient: "from-blue-500 to-indigo-500",
    },
    {
      title: "Restaurants",
      type: "restaurant",
      icon: "🍽️",
      description: "Discover safe dining options",
      gradient: "from-orange-500 to-amber-500",
    },
  ];

  return (
    <div className="w-full min-h-screen">
      {/* HERO SECTION */}
      <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600"></div>
        <div className="absolute inset-0 bg-black/20"></div>

        <div className="relative z-10 px-8 md:px-20 text-center max-w-5xl">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-extrabold leading-tight text-white mb-6 drop-shadow-lg"
          >
            SMART TOURIST <br /> SAFETY PORTAL
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-2xl mx-auto mt-6 text-gray-100 text-lg md:text-xl mb-8"
          >
            AI-powered safety monitoring, real-time SOS alerts, emergency
            coordination, and safe travel guidance — all in one powerful portal.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex gap-4 justify-center flex-wrap"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/dashboard")}
              className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-shadow"
            >
              Get Started
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/contacts")}
              className="px-8 py-4 bg-blue-500/20 backdrop-blur-sm text-white border-2 border-white rounded-xl font-semibold text-lg hover:bg-blue-500/30 transition-colors"
            >
              Emergency Contacts
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* SAFETY RESOURCES */}
      <section className="px-8 md:px-20 py-20 bg-gradient-to-b from-white to-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold mb-4 text-gray-800 text-center">
            Explore Safety Resources
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Quick access to essential safety services and information
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {safetyResources.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              onClick={() => handlePlaceTypeClick(item.type)}
              className="cursor-pointer"
            >
              <Card className="h-full hover:shadow-xl transition-shadow">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-4xl mb-4`}>
                  {item.icon}
                </div>
                <h3 className="text-2xl font-semibold mb-2 text-gray-800">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
                <div className="mt-4 text-blue-600 font-medium flex items-center gap-2">
                  Explore <span>→</span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="px-8 md:px-20 py-20 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          <h2 className="text-4xl font-bold mb-12 text-gray-800 text-center">
            Why Choose Our Portal?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🚨",
                title: "Real-time SOS",
                description: "Instant emergency alerts with location tracking",
              },
              {
                icon: "📍",
                title: "Live Location",
                description: "Track your location and share with authorities",
              },
              {
                icon: "🛡️",
                title: "Safe Travel",
                description: "Get safety recommendations for your journey",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 text-center bg-gray-900 text-gray-400">
        <p className="text-lg">
          © {new Date().getFullYear()} Tourist Safety Portal — Stay Safe, Travel Smart
        </p>
      </footer>
    </div>
  );
}
