import { useState } from "react";
import API from "../services/api";

export default function Register(){
  const [data,setData]=useState({});

  const register = async () => {
    await API.post("/auth/register", data);
    alert("Registered Successfully");
  };

  return (
    <div className="container col-4 mt-5">
      <h3>Register</h3>
      <input className="form-control mb-2" placeholder="Name" onChange={e=>setData({...data,name:e.target.value})}/>
      <input className="form-control mb-2" placeholder="Email" onChange={e=>setData({...data,email:e.target.value})}/>
      <input className="form-control mb-2" placeholder="Address" onChange={e=>setData({...data,address:e.target.value})}/>
      <input className="form-control mb-2" placeholder="Password" type="password" onChange={e=>setData({...data,password:e.target.value})}/>
      <button className="btn btn-primary w-100" onClick={register}>Register</button>
    </div>
  );
}
