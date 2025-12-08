import React, { useState } from "react";
import API from "../api";

export default function Login({ onAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async () => {
    try {
      const res = await API.post("/auth/login", { email, password });
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role);
        localStorage.setItem("name", res.data.name);
        localStorage.setItem("userId", res.data.userId);
        alert("Login successful");
        if (onAuth) onAuth();
        else window.location.reload();
      }
    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="card p-3">
      <h5>Login</h5>
      <input className="form-control mb-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input className="form-control mb-2" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button className="btn btn-primary" onClick={submit}>Login</button>
    </div>
  );
}
