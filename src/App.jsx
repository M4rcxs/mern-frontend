import { useEffect, useState } from 'react'
import './App.css'


function App() {
  const [stores, setStores] = useState([])
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await fetch('https://mern-backend-snowy-pi.vercel.app/stores')
        const data = await response.json()
        setStores(data)
      } catch (error) {
        console.error('Error fetching stores:', error)
      }
    }

    fetchStores()
  }, [])

  return (
    <div className="App">
      <h2>Stores</h2>
      <ul>
        {stores.map((store) => (
          <li key={store._id}>
            <h3>{store.name}</h3>
            <p>{store.description}</p>
            <p>Location: {store.location}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
