import React, { useEffect, useState } from "react";
import API from "../api";

export default function OwnerDashboard() {
  const [stores, setStores] = useState([]);
  const [raters, setRaters] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);

  const fetchStores = async () => {
    try {
      const res = await API.get("/owner/stores");
      setStores(res.data.data || []);
    } catch (e) { console.error(e); }
  };

  useEffect(()=>{ fetchStores(); }, []);

  const viewRaters = async (store) => {
    try {
      const res = await API.get(`/owner/store/${store.id}/raters`);
      setRaters(res.data.data || []);
      setSelectedStore(store);
    } catch (e) { alert(e.response?.data?.error || "Failed"); }
  };

  return (
    <div>
      <h4>Store Owner Dashboard</h4>
      <div className="mb-2">
        <button className="btn btn-sm btn-secondary me-2" onClick={fetchStores}>Refresh</button>
        <button className="btn btn-sm btn-warning" onClick={async()=>{ const old = prompt("Old password"); const nw = prompt("New password"); if (old && nw) { try { await API.post("/auth/update-password",{ oldPassword: old, newPassword: nw }); alert("Password updated"); } catch (e) { alert(e.response?.data?.error || "Failed"); } }}}>Change Password</button>
      </div>

      <div className="row">
        <div className="col-md-6">
          <h6>Your Stores</h6>
          <table className="table table-sm">
            <thead><tr><th>Name</th><th>Avg Rating</th><th>Action</th></tr></thead>
            <tbody>
              {stores.map(s => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{Number(s.avg_rating).toFixed(2)}</td>
                  <td><button className="btn btn-sm btn-info" onClick={()=>viewRaters(s)}>View Raters</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="col-md-6">
          <h6>Raters {selectedStore ? `for ${selectedStore.name}` : ""}</h6>
          <table className="table table-sm">
            <thead><tr><th>User</th><th>Email</th><th>Rating</th><th>Date</th></tr></thead>
            <tbody>
              {raters.map(r => (
                <tr key={r.id}><td>{r.name}</td><td>{r.email}</td><td>{r.rating}</td><td>{new Date(r.created_at).toLocaleString()}</td></tr>
              ))}
              {raters.length===0 && <tr><td colSpan="4">No raters yet</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
