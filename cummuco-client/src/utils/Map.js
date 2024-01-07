import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const Map = ({ latitude, longitude }) => {
    useEffect(() => {
        const map = L.map("map").setView([latitude, longitude], 15);

        // Add OpenStreetMap tile layer
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© OpenStreetMap contributors",
        }).addTo(map);

        // Add a marker with the default Leaflet icon
        L.marker([latitude, longitude], {
            icon: L.icon({
                iconUrl:
                "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
            }),
        }).addTo(map);

        // Cleanup function
        return () => {
            map.remove();
        };
    }, [latitude, longitude]);

    return <div id="map" style={{ height: "400px" }}> map </div>;
};

export default Map

