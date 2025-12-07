import { useEffect,useState } from "react";
import API from "../services/api";

export default function UserDashboard(){
  const [stores,setStores]=useState([]);

  useEffect(()=>{
    API.get("/user/stores").then(res=>setStores(res.data));
  },[]);

  const rateStore = async (id, rating) => {
    await API.post("/user/rate",{store_id:id, rating});
    alert("Rated");
  };

  return (
    <div className="container mt-5">
      <h2>Stores</h2>
      {stores.map(store=>(
        <div key={store.id} className="card p-3 mb-2">
          <h5>{store.name}</h5>
          <p>{store.address}</p>
          <p>Rating: {store.rating || "No rating"}</p>
          <input type="number" min="1" max="5" 
            onBlur={e=>rateStore(store.id, e.target.value)} />
        </div>
      ))}
    </div>
  );
}
