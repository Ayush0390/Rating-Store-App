import React, { useEffect, useState } from "react";
import API from "../api";

export default function Stores() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);

  const role = localStorage.getItem("role");
  const userId = parseInt(localStorage.getItem("id"));

  const [newStore, setNewStore] = useState({
    name: "",
    email: "",
    address: "",
    ownerId: "",
  });
  const [userRating, setUserRating] = useState({}); // { storeId: { rating, comment } }

  const fetchStores = async () => {
    setLoading(true);
    try {
      const { data } = await API.get("/stores");
      setStores(data);
    } catch (e) {
      alert("Failed to load stores");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("ROLE FROM LOCALSTORAGE:", role, "USER ID:", userId);
    fetchStores();
  }, []);

  const addStore = async (e) => {
    e.preventDefault();
    try {
      let payload = {
        name: newStore.name,
        email: newStore.email,
        address: newStore.address,
      };

      if (role === "admin" && newStore.ownerId) {
        payload.ownerId = Number(newStore.ownerId);
      }

      await API.post("/stores", payload);

      setNewStore({ name: "", email: "", address: "", ownerId: "" });
      fetchStores();
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to add store");
    }
  };

  const rate = async (id) => {
    try {
      const { rating, comment } = userRating[id] || {};
      if (!rating) return alert("Please select a rating");

      await API.post(`/stores/${id}/rate`, { rating: Number(rating), comment });
      setUserRating((prev) => ({ ...prev, [id]: { rating: "", comment: "" } }));
      fetchStores();
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to rate");
    }
  };

  return (
    <>
      <h2>Stores</h2>

      {/* ✅ Admin or Owner can add stores */}
      {(role === "admin" || role === "owner") && (
        <form onSubmit={addStore} style={{ marginBottom: 16 }}>
          <h3>Add Store ({role})</h3>
          <input
            placeholder="Name"
            value={newStore.name}
            onChange={(e) => setNewStore((s) => ({ ...s, name: e.target.value }))}
          />
          <input
            placeholder="Email"
            value={newStore.email}
            onChange={(e) => setNewStore((s) => ({ ...s, email: e.target.value }))}
          />
          <input
            placeholder="Address"
            value={newStore.address}
            onChange={(e) => setNewStore((s) => ({ ...s, address: e.target.value }))}
          />

          {/* ✅ Only admins need to choose ownerId */}
          {role === "admin" && (
            <input
              placeholder="Owner ID"
              value={newStore.ownerId}
              onChange={(e) =>
                setNewStore((s) => ({ ...s, ownerId: e.target.value }))
              }
            />
          )}

          <button type="submit">Add</button>
        </form>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {stores.map((st) => {
            const avg = st.averageRating
              ? Number(st.averageRating).toFixed(2)
              : "N/A";
            const myRating = st.Ratings?.find((r) => r.User?.id === userId);

            return (
              <div
                key={st.id}
                style={{
                  padding: 12,
                  border: "1px solid #eee",
                  borderRadius: 12,
                  marginBottom: 12,
                }}
              >
                <div style={{ fontWeight: 700 }}>{st.name}</div>
                <div>
                  {st.email} — {st.address}
                </div>
                <div>
                  Average rating: {avg} ({st.Ratings?.length || 0})
                </div>

                {/* Show all ratings */}
                {st.Ratings && st.Ratings.length > 0 && (
                  <div style={{ marginTop: 8 }}>
                    <h4>Ratings:</h4>
                    <ul>
                      {st.Ratings.map((r) => (
                        <li key={r.id}>
                          ⭐ {r.rating} – {r.comment || "No comment"} by{" "}
                          {r.User?.name || "Unknown"}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Show my rating if exists */}
                {myRating && (
                  <p style={{ marginTop: 4, color: "green" }}>
                    ✅ You rated: ⭐ {myRating.rating} –{" "}
                    {myRating.comment || "No comment"}
                  </p>
                )}

                {/* ✅ Rating form for user & owner */}
                {(role === "user" || role === "owner") && (
                  <div style={{ marginTop: 12 }}>
                    <h4>
                      {myRating ? "Update your rating:" : "Rate this store:"}
                    </h4>
                    <select
                      value={userRating[st.id]?.rating || ""}
                      onChange={(e) =>
                        setUserRating((prev) => ({
                          ...prev,
                          [st.id]: { ...prev[st.id], rating: e.target.value },
                        }))
                      }
                    >
                      <option value="">Select rating</option>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                    <input
                      placeholder="Comment"
                      value={userRating[st.id]?.comment || ""}
                      onChange={(e) =>
                        setUserRating((prev) => ({
                          ...prev,
                          [st.id]: { ...prev[st.id], comment: e.target.value },
                        }))
                      }
                      style={{ marginLeft: 8 }}
                    />
                    <button
                      type="button"
                      onClick={() => rate(st.id)}
                      style={{ marginLeft: 8 }}
                    >
                      Submit
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
