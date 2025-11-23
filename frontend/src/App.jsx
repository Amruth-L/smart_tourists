import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Alerts from "./pages/Alerts";
import Auth from "./pages/Auth";
import AuthorityProfileDetail from "./pages/AuthorityProfileDetail";
import Dashboard from "./pages/Dashboard";
import EmergencyContacts from "./pages/EmergencyContacts";
import Home from "./pages/Home";
import MapView from "./pages/MapView";
import TouristID from "./pages/TouristID";
import TouristProfileDetail from "./pages/TouristProfileDetail";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />
      <main className="pt-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/contacts" element={<EmergencyContacts />} />
          <Route path="/id" element={<TouristID />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/map" element={<MapView />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/tourist-profile" element={<TouristProfileDetail />} />
          <Route path="/authority-profile" element={<AuthorityProfileDetail />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
