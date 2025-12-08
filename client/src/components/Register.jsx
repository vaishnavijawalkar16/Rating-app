import React, { useState } from "react";
import API from "../api";

function validateName(name) {
  return name && name.length >= 20 && name.length <= 60;
}
function validatePassword(p) {
  if (!p) return false;
  if (p.length < 8 || p.length > 16) return false;
  if (!/[A-Z]/.test(p)) return false;
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(p)) return false;
  return true;
}
function validateEmail(e) {
  return /^\S+@\S+\.\S+$/.test(e);
}

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", address: "", password: "" });
  const [errors, setErrors] = useState({});

  const onChange = (k, v) => {
    setForm({ ...form, [k]: v });
  };

  const submit = async () => {
    const err = {};
    if (!validateName(form.name)) err.name = "Name must be 20-60 chars";
    if (!validateEmail(form.email)) err.email = "Invalid email";
    if (!validatePassword(form.password)) err.password = "Password must be 8-16, include uppercase and special char";
    if (form.address && form.address.length > 400) err.address = "Address max 400 chars";

    setErrors(err);
    if (Object.keys(err).length) return;

    try {
      await API.post("/auth/register", form);
      alert("Registered. Please login.");
      setForm({ name: "", email: "", address: "", password: "" });
    } catch (e) {
      alert(e.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="card p-3">
      <h5>Register (Normal User)</h5>
      <input className="form-control mb-1" placeholder="Full Name (20-60 chars)" value={form.name} onChange={e=>onChange("name", e.target.value)} />
      {errors.name && <small className="text-danger">{errors.name}</small>}
      <input className="form-control mb-1" placeholder="Email" value={form.email} onChange={e=>onChange("email", e.target.value)} />
      {errors.email && <small className="text-danger">{errors.email}</small>}
      <input className="form-control mb-1" placeholder="Address (max 400 chars)" value={form.address} onChange={e=>onChange("address", e.target.value)} />
      {errors.address && <small className="text-danger">{errors.address}</small>}
      <input className="form-control mb-2" placeholder="Password" type="password" value={form.password} onChange={e=>onChange("password", e.target.value)} />
      {errors.password && <small className="text-danger">{errors.password}</small>}
      <button className="btn btn-success" onClick={submit}>Register</button>
    </div>
  );
}
