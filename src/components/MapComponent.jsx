import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";

// ícones personalizados
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

// componente para centralizar mapa
const RecenterMap = ({ position }) => {
    const map = useMap();
    useEffect(() => {
        if (position) map.setView(position, 15);
    }, [position, map]);
    return null;
};

const MapComponent = () => {
    const defaultPosition = [-22.904, -43.190]; // fallback
    const [userPosition, setUserPosition] = useState(null);
    const [stations, setStations] = useState([]);
    const [search, setSearch] = useState("");

    // busca estações de bike
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
                    const nearbyStations = res.data.nearby
                        .sort((a, b) => a.distance - b.distance);

                    setStations(nearbyStations);
                    found = true;
                } else {
                    radius += 1000;
                }
            }
        } catch (err) {
            console.error("Erro ao buscar estações:", err);
        }
    };


    // pega localização do usuário
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const coords = [position.coords.latitude, position.coords.longitude];
                    setUserPosition(coords);
                    fetchStations(coords[0], coords[1]);
                },
                (error) => {
                    console.warn("Usuário não autorizou localização, usando padrão.");
                    setUserPosition(defaultPosition);
                    fetchStations(defaultPosition[0], defaultPosition[1]);
                }
            );
        } else {
            setUserPosition(defaultPosition);
            fetchStations(defaultPosition[0], defaultPosition[1]);
        }
    }, []);

    // busca por bairro
    const handleSearch = async () => {
        if (!search) return;

        try {
            const res = await axios.get(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(search)}`
            );

            if (res.data && res.data.length > 0) {
                const { lat, lon } = res.data[0];
                const coords = [parseFloat(lat), parseFloat(lon)];
                setUserPosition(coords);
                fetchStations(coords[0], coords[1]);
            } else {
                alert("Bairro não encontrado");
            }
        } catch (err) {
            console.error("Erro na busca por bairro:", err);
        }
    };

    if (!userPosition) return <div>Carregando mapa...</div>;

    return (
        <div className="flex flex-col" style={{ height: "100vh", width: "100%", position: "relative", fontFamily: "Arial, sans-serif" }}>

            {/* Container flex principal */}
                <h1 className="flex justify-center items-center font-semibold text-xl">
                    OndeTemBike? 🚲
                </h1>
            <div className="flex flex-col md:flex-row justify-center items-start mt-6 w-full gap-6 px-4">


                {/* Busca por bairro */}
                <div className="p-2 gap-2 flex">

                    <input
                        type="text"
                        placeholder="Digite o nome do bairro"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 p-3 rounded-lg border border-gray-300 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition placeholder-gray-400"
                    />
                    <button
                        onClick={handleSearch}
                        className="bg-blue-500 text-white px-5 py-3 rounded-lg shadow-md hover:bg-blue-600 transition duration-200 font-semibold"
                    >
                        Buscar
                    </button>
                </div>
                {/* Estatísticas */}
                <div className="w-full md:w-1/3 p-4 border rounded-xl shadow-lg bg-white/90">
                    <h2 className="text-xl font-semibold mb-2">Estatísticas</h2>
                    <p>Total de estações: {stations.length}</p>
                    <p>Bikes disponíveis: {stations.reduce((acc, station) => acc + station.bikes_available, 0)}</p>
                    <p>Vagas disponíveis: {stations.reduce((acc, station) => acc + station.docks_available, 0)}</p>
                </div>
            </div>


            <MapContainer className="mt-[100px]" center={userPosition} zoom={15} style={{ height: "50%", width: "100%" }}>
                <TileLayer
                    url={`https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=ovDGV2dDP2oKlv9JNrII`}
                />

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
    );
};

export default MapComponent;
