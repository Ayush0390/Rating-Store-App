import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function Register() {
  const [form, setForm] = useState({
    name: "", email: "", password: "", address: "", role: "user",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  // Simple validations
  const validate = () => {
    if (form.name.trim().length < 3) { alert("Name must be at least 3 characters"); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { alert("Invalid email"); return false; }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}/.test(form.password)) {
      alert("Password must be 6+ chars with upper, lower, number");
      return false;
    }
    return true;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await API.post("/auth/register", form);
      alert("Registered. Please login.");
      navigate("/");
    } catch (err) {
      alert(err?.response?.data?.message || "Register failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2>Register</h2>
      <form onSubmit={onSubmit}>
        <input name="name" placeholder="Name" onChange={handleChange} />
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} />
        <input name="address" placeholder="Address" onChange={handleChange} />
        <select name="role" onChange={handleChange} value={form.role}>
          <option value="user">User</option>
          <option value="owner">Owner</option>
          <option value="admin">Admin</option>
        </select>
        <button disabled={loading}>{loading ? "..." : "Create account"}</button>
      </form>
    </>
  );
}
