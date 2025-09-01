import React, { useEffect, useState } from "react";
import axios from "axios";

export default function OwnerDashboard() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const token = localStorage.getItem("token"); // token saved at login
        const res = await axios.get("http://localhost:4000/api/stores/owner/mystores", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStores(res.data);
      } catch (err) {
        console.error("Error fetching stores:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStores();
  }, []);

  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Stores & Ratings</h1>
      {stores.length === 0 ? (
        <p>You don’t own any stores yet.</p>
      ) : (
        stores.map((store) => (
          <div key={store.id} className="border rounded-lg shadow p-4 mb-6">
            <h2 className="text-xl font-semibold">{store.name}</h2>
            <p className="text-gray-600">{store.address}</p>
            <h3 className="mt-4 font-medium">Ratings:</h3>
            {store.Ratings && store.Ratings.length > 0 ? (
              <ul className="list-disc pl-5">
                {store.Ratings.map((r) => (
                  <li key={r.id} className="mt-1">
                    ⭐ {r.rating} – {r.comment || "No comment"} <br />
                    <span className="text-sm text-gray-500">
                      by {r.User?.name} ({r.User?.email})
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No ratings yet.</p>
            )}
          </div>
        ))
      )}
    </div>
  );
}
