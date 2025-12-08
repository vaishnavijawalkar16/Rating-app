import React from "react";

export default function NavbarAuth({ auth, logout }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <a className="navbar-brand" href="/">StoreRatings</a>
        <div>
          {auth && auth.token ? (
            <>
              <span className="me-3">Hello, {localStorage.getItem("name") || "User"}</span>
              <span className="me-3">Role: {localStorage.getItem("role")}</span>
              <button className="btn btn-outline-secondary btn-sm" onClick={logout}>Logout</button>
            </>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
