import React, { useEffect, useState } from "react";
import API from "../api";

export default function DashboardAdmin() {
  const [users, setUsers] = useState([]);
  const [q, setQ] = useState({ name: "", email: "", role: "" });

  const load = async () => {
    const params = new URLSearchParams();
    if (q.name) params.set("name", q.name);
    if (q.email) params.set("email", q.email);
    if (q.role) params.set("role", q.role);
    const { data } = await API.get(`/users?${params.toString()}`);
    setUsers(data);
  };

  useEffect(() => { load(); /*eslint-disable*/ }, []);

  return (
    <>
      <h2>Admin — Users</h2>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input placeholder="Name" value={q.name} onChange={(e)=>setQ(s=>({...s,name:e.target.value}))}/>
        <input placeholder="Email" value={q.email} onChange={(e)=>setQ(s=>({...s,email:e.target.value}))}/>
        <select value={q.role} onChange={(e)=>setQ(s=>({...s,role:e.target.value}))}>
          <option value="">Any role</option>
          <option value="user">User</option>
          <option value="owner">Owner</option>
          <option value="admin">Admin</option>
        </select>
        <button onClick={load}>Filter</button>
      </div>

      <div>
        {users.map(u=>(
          <div key={u.id} style={{ padding: 12, border: "1px solid #eee", borderRadius: 12, marginBottom: 12 }}>
            <div style={{ fontWeight: 700 }}>{u.name} — {u.role}</div>
            <div>{u.email} {u.address ? `• ${u.address}` : ""}</div>
            {u.ownedStore && <div>Owns store: {u.ownedStore.name}</div>}
          </div>
        ))}
      </div>
    </>
  );
}
