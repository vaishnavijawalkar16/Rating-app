import React, { useEffect, useState } from "react";
import API from "../api";

export default function AdminDashboard() {
  const [counts, setCounts] = useState({});
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [uForm, setUForm] = useState({ name: "", email: "", address: "", password: "", role: "USER" });
  const [sForm, setSForm] = useState({ name: "", email: "", address: "", owner_id: null });

  const fetchCounts = async () => {
    try {
      const res = await API.get("/admin/dashboard");
      setCounts(res.data);
    } catch (e) { console.error(e); }
  };

  const fetchUsers = async (params = {}) => {
    const res = await API.get("/admin/users", { params: { q: params.q || "", sort: params.sort || "name", order: params.order || "asc", page:1, limit:100 }});
    setUsers(res.data.data || []);
  };

  const fetchStores = async (params = {}) => {
    const res = await API.get("/admin/stores", { params: { q: params.q || "", sort: params.sort || "name", order: params.order || "asc", page:1, limit:100 }});
    setStores(res.data.data || []);
  };

  useEffect(()=>{ fetchCounts(); fetchUsers(); fetchStores(); }, []);

  const addUser = async () => {
    try {
      await API.post("/admin/add-user", uForm);
      alert("User added");
      setUForm({ name: "", email: "", address: "", password: "", role: "USER" });
      fetchUsers();
    } catch (e) { alert(e.response?.data?.error || "Failed to add user"); }
  };

  const addStore = async () => {
    try {
      await API.post("/admin/add-store", sForm);
      alert("Store added");
      setSForm({ name: "", email: "", address: "", owner_id: null });
      fetchStores();
    } catch (e) { alert(e.response?.data?.error || "Failed to add store"); }
  };

  return (
    <div>
      <h4>Admin Dashboard</h4>

      <div className="row">
        <div className="col-md-4">
          <div className="card p-3 mb-3">
            <h6>Stats</h6>
            <div>Total Users: {counts.total_users}</div>
            <div>Total Stores: {counts.total_stores}</div>
            <div>Total Ratings: {counts.total_ratings}</div>
            <button className="btn btn-sm btn-secondary mt-2" onClick={fetchCounts}>Refresh</button>
          </div>

          <div className="card p-3 mb-3">
            <h6>Add User</h6>
            <input className="form-control mb-1" placeholder="Name" value={uForm.name} onChange={e=>setUForm({...uForm,name:e.target.value})} />
            <input className="form-control mb-1" placeholder="Email" value={uForm.email} onChange={e=>setUForm({...uForm,email:e.target.value})} />
            <input className="form-control mb-1" placeholder="Address" value={uForm.address} onChange={e=>setUForm({...uForm,address:e.target.value})} />
            <input className="form-control mb-1" placeholder="Password" type="password" value={uForm.password} onChange={e=>setUForm({...uForm,password:e.target.value})} />
            <select className="form-select mb-1" value={uForm.role} onChange={e=>setUForm({...uForm,role:e.target.value})}>
              <option value="USER">USER</option>
              <option value="OWNER">OWNER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
            <button className="btn btn-success" onClick={addUser}>Create User</button>
          </div>

          <div className="card p-3 mb-3">
            <h6>Add Store</h6>
            <input className="form-control mb-1" placeholder="Store Name" value={sForm.name} onChange={e=>setSForm({...sForm,name:e.target.value})}/>
            <input className="form-control mb-1" placeholder="Email" value={sForm.email} onChange={e=>setSForm({...sForm,email:e.target.value})}/>
            <input className="form-control mb-1" placeholder="Address" value={sForm.address} onChange={e=>setSForm({...sForm,address:e.target.value})}/>
            <input className="form-control mb-1" placeholder="Owner ID (optional)" value={sForm.owner_id || ""} onChange={e=>setSForm({...sForm,owner_id: e.target.value? Number(e.target.value): null })}/>
            <button className="btn btn-primary" onClick={addStore}>Add Store</button>
          </div>
        </div>

        <div className="col-md-8">
          <div className="card p-3 mb-3">
            <h6>Users</h6>
            <div className="mb-2">
              <button className="btn btn-sm btn-outline-primary me-2" onClick={()=>fetchUsers()}>Refresh Users</button>
            </div>
            <table className="table table-sm">
              <thead><tr><th>Name</th><th>Email</th><th>Address</th><th>Role</th></tr></thead>
              <tbody>
                {users.map(u => <tr key={u.id}><td>{u.name}</td><td>{u.email}</td><td>{u.address}</td><td>{u.role}</td></tr>)}
              </tbody>
            </table>
          </div>

          <div className="card p-3">
            <h6>Stores</h6>
            <div className="mb-2"><button className="btn btn-sm btn-outline-primary" onClick={()=>fetchStores()}>Refresh Stores</button></div>
            <table className="table table-sm">
              <thead><tr><th>Name</th><th>Address</th><th>Avg Rating</th></tr></thead>
              <tbody>
                {stores.map(s => <tr key={s.id}><td>{s.name}</td><td>{s.address}</td><td>{Number(s.avg_rating).toFixed(2)}</td></tr>)}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}
