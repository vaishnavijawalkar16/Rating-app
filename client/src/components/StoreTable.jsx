import React, { useState } from "react";

export default function StoreTable({ data, onRate, onViewRaters, onRefresh }) {
  // data: array of stores with id,name,address,avg_rating,my_rating
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("name");
  const [order, setOrder] = useState("asc");

  const applySort = (field) => {
    if (sort === field) setOrder(order === "asc" ? "desc" : "asc");
    else { setSort(field); setOrder("asc"); }
    if (onRefresh) onRefresh({ q, sort: field, order: order === "asc" ? "desc" : "asc" });
  };

  return (
    <div className="card p-3">
      <div className="d-flex mb-2">
        <input className="form-control me-2" placeholder="Search name or address" value={q} onChange={e=>setQ(e.target.value)} />
        <button className="btn btn-outline-primary me-2" onClick={()=>onRefresh({ q, sort, order })}>Search</button>
        <button className="btn btn-secondary" onClick={()=>{ setQ(""); onRefresh({ q: "", sort, order }); }}>Clear</button>
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th style={{cursor:"pointer"}} onClick={()=>applySort("name")}>Name {sort==="name" && (order==="asc"?"▲":"▼")}</th>
            <th style={{cursor:"pointer"}} onClick={()=>applySort("address")}>Address {sort==="address" && (order==="asc"?"▲":"▼")}</th>
            <th style={{cursor:"pointer"}} onClick={()=>applySort("avg_rating")}>Avg Rating {sort==="avg_rating" && (order==="asc"?"▲":"▼")}</th>
            <th>Your Rating</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && <tr><td colSpan="5">No stores found</td></tr>}
          {data.map(s => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.address}</td>
              <td>{Number(s.avg_rating).toFixed(2)}</td>
              <td>{s.my_rating || "-"}</td>
              <td>
                <button className="btn btn-sm btn-primary me-2" onClick={()=>onRate(s)}>Rate</button>
                {onViewRaters && <button className="btn btn-sm btn-info" onClick={()=>onViewRaters(s)}>View Raters</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
