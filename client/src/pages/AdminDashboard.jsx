import { useEffect,useState } from "react";
import API from "../services/api";

export default function AdminDashboard(){
  const [data,setData]=useState({});

  useEffect(()=>{
    API.get("/admin/dashboard").then(res=>setData(res.data));
  },[]);

  return (
    <div className="container mt-5">
      <h2>Admin Dashboard</h2>
      <div className="row">
        <div className="col-md-4">Users: {data.users}</div>
        <div className="col-md-4">Stores: {data.stores}</div>
        <div className="col-md-4">Ratings: {data.ratings}</div>
      </div>
    </div>
  );
}
