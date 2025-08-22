import React, { useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import brflag from "../flags/br.png";
import ukflag from "../flags/uk.png";

export const Header = ({ stations, setUserPosition, fetchStations }) => {
    const [search, setSearch] = useState("");
    const { t, i18n } = useTranslation(); // pegar t e i18n

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
                alert(t("neighborhoodNotFound")); // tradução
            }
        } catch (err) {
            console.error("Erro na busca por bairro:", err);
        }
    };

    return (
        <div className="flex flex-col items-center mt-4">
            <div className="flex gap-3 mb-2">
                <button
                    onClick={() => i18n.changeLanguage("pt")}
                    className="p-1.5 rounded-lg shadow-md hover:scale-105 hover:shadow-lg transition"
                >
                    <img src={brflag} alt="PT" className="w-8 h-6 object-cover rounded" />
                </button>

                <button
                    onClick={() => i18n.changeLanguage("en")}
                    className="p-1.5 rounded-lg shadow-md hover:scale-105 hover:shadow-lg transition"
                >
                    <img src={ukflag} alt="EN" className="w-8 h-6 object-cover rounded" />
                </button>
            </div>

            <h1 className="text-2xl font-bold text-emerald-600 mb-4 flex items-center">
                {t("appTitle")}
            </h1>

            <div className="flex flex-col md:flex-row justify-center items-start w-full gap-6 px-4">
                <div className="flex gap-2 w-full md:w-1/2">
                    <input
                        type="text"
                        placeholder={t("searchPlaceholder")}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 p-3 rounded-xl border bg-white border-gray-300 shadow-sm focus:outline-none 
                     focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
                    />
                    <button
                        onClick={handleSearch}
                        className="bg-emerald-500 text-white px-5 py-3 rounded-xl shadow-md 
                     hover:bg-emerald-600 transition duration-200 font-semibold"
                    >
                        🔍 {t("searchButton")}
                    </button>
                </div>

                <div className="flex justify-around items-center bg-white rounded-2xl shadow-md p-3 w-full md:w-1/3">
                    <div className="flex flex-col items-center">
                        <span className="text-gray-500 text-lg">📍</span>
                        <p className="text-gray-600 text-sm">{t("stations")}</p>
                        <p className="text-emerald-500 font-bold">{stations.length}</p>
                    </div>

                    <div className="flex flex-col items-center">
                        <span className="text-gray-500 text-lg">🚲</span>
                        <p className="text-gray-600 text-sm">{t("bikes")}</p>
                        <p className="text-blue-500 font-bold">{stations.reduce((a, s) => a + s.bikes_available, 0)}</p>
                    </div>

                    <div className="flex flex-col items-center">
                        <span className="text-gray-500 text-lg">🅿️</span>
                        <p className="text-gray-600 text-sm">{t("docks")}</p>
                        <p className="text-purple-500 font-bold">{stations.reduce((a, s) => a + s.docks_available, 0)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
