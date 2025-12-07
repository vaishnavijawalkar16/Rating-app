import { useEffect,useState } from "react";
import API from "../services/api";

export default function OwnerDashboard(){
  const [ratings,setRatings]=useState([]);

  useEffect(()=>{
    API.get("/owner/dashboard").then(res=>setRatings(res.data));
  },[]);

  return (
    <div className="container mt-5">
      <h2>My Store Ratings</h2>
      {ratings.map((r,i)=>(
        <div key={i} className="card p-2 mb-2">
          User: {r.name} | Rating: {r.rating}
        </div>
      ))}
    </div>
  );
}
