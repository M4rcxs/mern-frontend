import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import { Header } from "./Header";
import { Dashboard } from "./Dashboard";
import { useTranslation } from "react-i18next";


const userIcon = new L.Icon({
  iconUrl: "https://images.icon-icons.com/882/PNG/512/1-09_icon-icons.com_68883.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const bikeIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/9041/9041693.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

const RecenterMap = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) map.setView(position, 15);
  }, [position, map]);
  return null;
};

const MapComponent = () => {
  const defaultPosition = [-22.904, -43.190];
  const [userPosition, setUserPosition] = useState(null);
  const [stations, setStations] = useState([]);
  const [showDashboard, setShowDashboard] = useState(false);
    const { t } = useTranslation();


  const fetchStations = async (lat, lon) => {
    try {
      let radius = 1000;
      const maxRadius = 5000;
      let found = false;
      while (!found && radius <= maxRadius) {
        const res = await axios.get(
          `https://mern-backend-snowy-pi.vercel.app/stations-nearby?lat=${lat}&lon=${lon}&radius=${radius}`
        );
        if (res.data.nearby.length > 0) {
          const nearbyStations = res.data.nearby.sort((a, b) => a.distance - b.distance);
          setStations(nearbyStations);
          found = true;
        } else radius += 1000;
      }
    } catch (err) {
      console.error("Erro ao buscar estações:", err);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = [position.coords.latitude, position.coords.longitude];
          setUserPosition(coords);
          fetchStations(coords[0], coords[1]);
        },
        () => {
          setUserPosition(defaultPosition);
          fetchStations(defaultPosition[0], defaultPosition[1]);
        }
      );
    } else {
      setUserPosition(defaultPosition);
      fetchStations(defaultPosition[0], defaultPosition[1]);
    }
  }, []);

  useEffect(() => {
    if (userPosition) fetchStations(userPosition[0], userPosition[1]);
  }, [userPosition]);

  if (!userPosition) return <div>Carregando mapa...</div>;

  return (
    <div className="flex flex-col h-screen w-screen relative">
      <Header stations={stations} setUserPosition={setUserPosition} fetchStations={fetchStations} />
      <div className="flex flex-1 flex-col lg:flex-row">
        <div className="flex-1 p-4 lg:p-6">
          <MapContainer
            center={userPosition}
            zoom={15}
            style={{
              height: "100%",
              width: "100%",
              borderRadius: "1rem",
              overflow: "hidden",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            <TileLayer url={`https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=ovDGV2dDP2oKlv9JNrII`} />
            <RecenterMap position={userPosition} />
            <Marker position={userPosition} icon={userIcon}>
              <Popup>Você está aqui</Popup>
            </Marker>
            {stations.map((station) => (
              <Marker key={station.id} position={[station.lat, station.lon]} icon={bikeIcon}>
                <Popup>
                  <strong>{station.name}</strong>
                  <br />
                  Bikes disponíveis: {station.bikes_available}
                  <br />
                  Vagas disponíveis: {station.docks_available}
                  <br />
                  Distância: {Math.round(station.distance)} m
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
        <div className="hidden lg:flex w-full lg:w-1/3 p-6">
          <Dashboard stations={stations} setShowDashboard={setShowDashboard} />
        </div>
      </div>
       <button
        onClick={() => setShowDashboard(!showDashboard)}
        className="lg:hidden fixed bottom-4 mb-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-emerald-600 transition z-[1000]"
      >
        {showDashboard ? t("closeStats") : t("viewStats")}
      </button>

      <div
        className={`lg:hidden fixed bottom-0 left-0 w-full bg-white rounded-t-2xl shadow-2xl transition-transform duration-300 z-[9999] ${
          showDashboard ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ maxHeight: "90vh", overflowY: "auto" }}
      >
        <Dashboard stations={stations} setShowDashboard={setShowDashboard} />
      </div>
    </div>
  );
};

export default MapComponent;
