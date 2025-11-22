import React from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import EmergencyContacts from "./pages/EmergencyContacts";
import TouristID from "./pages/TouristID";
import Alerts from "./pages/Alerts";
import MapView from "./pages/MapView";

export default function App() {
  const [route, setRoute] = React.useState("home");
  const [placeType, setPlaceType] = React.useState(null);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar setRoute={setRoute} />

      <div className="container mx-auto p-6 pt-24">
        {route === "home" && <Home setPlaceType={setPlaceType} setRoute={setRoute} />}
        {route === "dashboard" && <Dashboard />}
        {route === "contacts" && <EmergencyContacts />}
        {route === "id" && <TouristID />}
        {route === "alerts" && <Alerts />}
        {route === "map" && <MapView placeType={placeType} />}
      </div>
    </div>
  );
}
