import React, { useEffect, useState } from "react";
import API from "../api";

function UserDashboard() {
  const [stores, setStores] = useState([]);
  const [ratings, setRatings] = useState({}); // { storeId: ratingValue }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Unauthorized! Please login.");
          return;
        }

        // ✅ Fetch all stores
        const res = await API.get("/stores", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStores(res.data);

        // ✅ Fetch user’s ratings
        const ratingRes = await API.get("/user/ratings", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const ratingMap = {};
        ratingRes.data.forEach((r) => {
          ratingMap[r.storeId] = r.rating;
        });
        setRatings(ratingMap);
      } catch (err) {
        console.error("Error loading user dashboard", err);
      }
    };

    fetchData();
  }, []);

  // ✅ Handle rating submission
  const handleRate = async (storeId, value) => {
    try {
      const token = localStorage.getItem("token");
      await API.post(
        "/ratings",
        { storeId, rating: value },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRatings({ ...ratings, [storeId]: value });
      alert("Rating submitted!");
    } catch (err) {
      console.error("Error submitting rating", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>User Dashboard</h2>
      <h3>Available Stores</h3>

      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Store Name</th>
            <th>Email</th>
            <th>Address</th>
            <th>Your Rating</th>
          </tr>
        </thead>
        <tbody>
          {stores.length > 0 ? (
            stores.map((store) => (
              <tr key={store.id}>
                <td>{store.name}</td>
                <td>{store.email}</td>
                <td>{store.address}</td>
                <td>
                  <select
                    value={ratings[store.id] || ""}
                    onChange={(e) => handleRate(store.id, Number(e.target.value))}
                  >
                    <option value="">Rate</option>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No stores available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default UserDashboard;
