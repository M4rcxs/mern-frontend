import React, { useState } from "react";

export const CreateStore = ({ onStoreCreated }) => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [id, setId] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const storeData = { name, location, id };

    try {
      const response = await fetch("https://mern-backend-snowy-pi.vercel.app/stores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(storeData),
      });

      const data = await response.json();
      console.log("Success:", data);

      setName("");
      setLocation("");
      setId("");

      if (onStoreCreated) {
        onStoreCreated();
      }

    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="create-store-container p-4 border rounded shadow-md my-4 max-w-md mx-auto">
      <h2 className="text-xl font-semibold text-center mb-4">
        Create a New Store
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col">
          <label htmlFor="name" className="mb-1 text-left">Store Name:</label>
          <input type="text" id="name" name="name" className="border p-2 rounded"
            required value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="flex flex-col">
          <label htmlFor="location" className="mb-1 text-left">Location:</label>
          <input type="text" id="location" name="location" className="border p-2 rounded"
            required value={location} onChange={(e) => setLocation(e.target.value)} />
        </div>
        <div className="flex flex-col">
          <label htmlFor="id" className="mb-1 text-left">ID:</label>
          <input type="text" id="id" name="id" className="border p-2 rounded"
            required value={id} onChange={(e) => setId(e.target.value)} />
        </div>
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition">
          Create Store
        </button>
      </form>
    </div>
  );
};
