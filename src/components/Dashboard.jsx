import { useTranslation } from "react-i18next";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#10b981", "#3b82f6"]; // verde e azul

export const Dashboard = ({ stations, setShowDashboard }) => {
  const { t } = useTranslation(); // hook i18n
  const totalBikes = stations.reduce((acc, s) => acc + s.bikes_available, 0);
  const totalDocks = stations.reduce((acc, s) => acc + s.docks_available, 0);

  const pieData = [
    { name: t("availableBikes"), value: totalBikes },
    { name: t("availableDocks"), value: totalDocks },
  ];

  const topStations = stations
    .sort((a, b) => b.bikes_available - a.bikes_available)
    .slice(0, 5)
    .map(s => ({ name: s.name, bikes: s.bikes_available }));

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 w-full md:w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-700">📊 {t("statistics")}</h2>
        <button
          className="text-gray-500 hover:text-gray-800 font-bold"
          onClick={() => setShowDashboard(false)}
        >
          ✕
        </button>
      </div>

      <div className="flex flex-col items-center">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={pieData} dataKey="value" cx="50%" cy="50%" outerRadius={70} label>
              {pieData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>

        <div className="flex justify-center gap-6 mt-2">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-emerald-500 rounded-full"></span>
            <span className="text-gray-700 text-sm">{t("availableBikes")}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-blue-500 rounded-full"></span>
            <span className="text-gray-700 text-sm">{t("availableDocks")}</span>
          </div>
        </div>
      </div>

      <h3 className="text-md font-semibold mt-6 mb-2 text-gray-600">{t("topStations")}</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={topStations}>
          <XAxis dataKey="name" hide />
          <YAxis />
          <Tooltip />
          <Bar dataKey="bikes" fill="#10b981" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
