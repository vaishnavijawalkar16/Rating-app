import React, { useState, useEffect } from "react";
import Login from "./Components/Login";
import Register from "./Components/Register";
import AdminDashboard from "./Components/AdminDashboard";
import UserDashboard from "./Components/UserDashboard";
import OwnerDashboard from "./Components/OwnerDashboard";
import NavbarAuth from "./Components/NavbarAuth";
import API from "./api";

function App() {
  const [auth, setAuth] = useState({
    token: localStorage.getItem("token"),
    role: localStorage.getItem("role"),
    name: localStorage.getItem("name"),
    userId: localStorage.getItem("userId"),
  });
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    setAuth({
      token: localStorage.getItem("token"),
      role: localStorage.getItem("role"),
      name: localStorage.getItem("name"),
      userId: localStorage.getItem("userId"),
    });

    // check if this user is owner of any store
    const checkOwner = async () => {
      try {
        const res = await API.get("/owner/stores");
        if (res.data.data && res.data.data.length > 0) setIsOwner(true);
      } catch (e) {
        setIsOwner(false);
      }
    };

    if (auth.token) checkOwner();
  }, [auth.token]);

  const logout = () => {
    localStorage.clear();
    setAuth({ token: null, role: null, name: null });
    setIsOwner(false);
    window.location.reload();
  };

  if (!auth.token) {
    return (
      <div>
        <NavbarAuth auth={auth} />
        <div className="container mt-4">
          <h3>Welcome — Please login or register</h3>
          <div className="row">
            <div className="col-md-6">
              <Login onAuth={() => window.location.reload()} />
            </div>
            <div className="col-md-6">
              <Register />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <NavbarAuth auth={auth} logout={logout} />
      <div className="container mt-4">
        {auth.role === "ADMIN" && <AdminDashboard />}
        {auth.role === "USER" && <UserDashboard />}
        {auth.role === "OWNER" && (
          <>
            <UserDashboard /> {/* normal store browsing and rating */}
            <OwnerDashboard /> {/* their own stores + raters */}
          </>
        )}
        {auth.role === "USER" && isOwner && (
          <>
            <OwnerDashboard /> {/* if user is owner too */}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
