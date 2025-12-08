import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Home() {
  const [stores, setStores] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/user/stores")
      .then(res => setStores(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Welcome to Store Ratings</h1>

      <div className="mb-4">
        <button className="btn btn-primary me-2" onClick={() => navigate("/login")}>
          Login
        </button>
        <button className="btn btn-success" onClick={() => navigate("/register")}>
          Register
        </button>
      </div>

      <h3>All Stores</h3>
      {stores.length === 0 ? (
        <p>No stores registered yet.</p>
      ) : (
        <div className="row">
          {stores.map(store => (
            <div key={store.id} className="col-md-4 mb-3">
              <div className="card p-3">
                <h5>{store.name}</h5>
                <p>{store.address}</p>
                <p>Average Rating: {store.rating || "No ratings yet"}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
