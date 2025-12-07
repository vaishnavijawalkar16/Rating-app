import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const navigate = useNavigate();

  const login = async () => {
    const res = await API.post("/auth/login",{email,password});
    localStorage.setItem("token",res.data.token);

    if(res.data.role==="ADMIN") navigate("/admin");
    if(res.data.role==="USER") navigate("/user");
    if(res.data.role==="OWNER") navigate("/owner");
  };

  return (
    <div className="container mt-5 col-4">
      <h3>Login</h3>
      <input className="form-control mb-2" onChange={e=>setEmail(e.target.value)} placeholder="Email" />
      <input className="form-control mb-2" onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" />
      <button className="btn btn-success w-100" onClick={login}>Login</button>
    </div>
  );
}
