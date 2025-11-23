import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import Card from "../components/Card";

export default function MapView() {
  const [searchParams] = useSearchParams();
  const placeType = searchParams.get("type");
  const mapRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!placeType) {
      setError("No place type specified");
      setLoading(false);
      return;
    }

    if (!window.google) {
      setError("Google Maps API not loaded");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userLocation = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };

        const map = new window.google.maps.Map(mapRef.current, {
          center: userLocation,
          zoom: 14,
        });

        new window.google.maps.Marker({
          position: userLocation,
          map,
          title: "You are here",
          icon: {
            url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
          },
        });

        const service = new window.google.maps.places.PlacesService(map);

        service.nearbySearch(
          {
            location: userLocation,
            radius: 3000,
            type: placeType,
          },
          (results, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
              results.forEach((place) => {
                new window.google.maps.Marker({
                  position: place.geometry.location,
                  map,
                  title: place.name,
                });
              });
            }
            setLoading(false);
          }
        );
      },
      () => {
        setError("Please enable location permission!");
        setLoading(false);
      }
    );
  }, [placeType]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-2">
            {placeType ? `${placeType.charAt(0).toUpperCase() + placeType.slice(1)} Locations` : "Map View"}
          </h2>
          <p className="text-gray-600">Find nearby places on the map</p>
        </motion.div>

        <Card className="p-0 overflow-hidden shadow-xl">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
                <div className="text-gray-700">Loading map...</div>
              </div>
            </div>
          )}
          {error && (
            <div className="p-8 text-center">
              <div className="text-red-600 mb-2">{error}</div>
            </div>
          )}
          <div ref={mapRef} className="w-full h-[80vh] rounded-xl"></div>
        </Card>
      </div>
    </div>
  );
}
