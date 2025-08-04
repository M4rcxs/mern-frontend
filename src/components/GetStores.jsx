export const GetStores = ({ stores, loading }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Stores</h2>
      {loading && <p>Loading...</p>}
      <ul>
        {stores.map((store) => (
          <li key={store.id}>
            {store.name} - {store.location} (ID: {store.id})
          </li>
        ))}
      </ul>
    </div>
  );
};
