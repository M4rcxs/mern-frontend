export const GetStores = ({ stores, loading }) => {
  return (
    <div>
      <h2>Stores</h2>
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
