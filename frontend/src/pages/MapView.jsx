import React, { useEffect, useRef } from "react";

export default function MapView({ placeType }) {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!placeType) return;

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
          }
        );
      },
      () => alert("Please enable location permission!")
    );
  }, [placeType]);

  return (
    <div className="w-full h-[80vh] rounded-xl shadow-lg">
      <div ref={mapRef} className="w-full h-full"></div>
    </div>
  );
}
