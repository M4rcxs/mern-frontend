import { useEffect, useState } from 'react'
import './App.css'
import { CreateStore } from './components/CreateStore.jsx'
import { fetchStores } from './services/fetchStores.js'
import { GetStores } from './components/GetStores.jsx'


function App() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStores = async () => {
    try {
      const response = await fetch("https://mern-backend-snowy-pi.vercel.app/stores");
      const data = await response.json();
      setStores(data);
    } catch (err) {
      console.error("Erro ao buscar lojas:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  return (
    <div className="App">
      <GetStores onFetchStores={fetchStores} stores={stores} loading={loading} />
      <CreateStore onStoreCreated={fetchStores} />
    </div>
  )
}

export default App
