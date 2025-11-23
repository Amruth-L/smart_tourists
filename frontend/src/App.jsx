import React from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import EmergencyContacts from "./pages/EmergencyContacts";
import TouristID from "./pages/TouristID";
import Alerts from "./pages/Alerts";
import MapView from "./pages/MapView";
import Auth from "./pages/Auth";
import TouristProfileDetail from "./pages/TouristProfileDetail";
import AuthorityProfileDetail from "./pages/AuthorityProfileDetail";

export default function App() {
  const [route, setRoute] = React.useState("home");
  const [placeType, setPlaceType] = React.useState(null);
  const [userId, setUserId] = React.useState(null);
  const [userType, setUserType] = React.useState(null);

  return (
    <div className="min-h-screen bg-slate-50">
      {route !== "auth" && route !== "login" && route !== "tourist-profile" && route !== "authority-profile" && route !== "dashboard" && <Navbar setRoute={setRoute} />}

      <div className={`container mx-auto p-6 ${route !== "dashboard" ? "pt-24" : ""}`}>
        {route === "home" && <Home setPlaceType={setPlaceType} setRoute={setRoute} />}
        {route === "dashboard" && <Dashboard userId={userId} userType={userType} />}
        {route === "contacts" && <EmergencyContacts />}
        {route === "id" && <TouristID />}
        {route === "alerts" && <Alerts />}
        {route === "map" && <MapView placeType={placeType} />}
        {route === "auth" && <Auth setRoute={setRoute} setUserId={setUserId} setUserType={setUserType} />}
        {route === "login" && <Auth setRoute={setRoute} setUserId={setUserId} setUserType={setUserType} />}
        {route === "tourist-profile" && <TouristProfileDetail userId={userId} onComplete={() => setRoute("dashboard")} />}
        {route === "authority-profile" && <AuthorityProfileDetail userId={userId} onComplete={() => setRoute("dashboard")} />}
      </div>
    </div>
  );
}
