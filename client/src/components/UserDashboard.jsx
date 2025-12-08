import React, { useEffect, useState } from "react";
import API from "../api";
import StoreTable from "../Components/StoreTable";

export default function UserDashboard() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const fetchStores = async (params = {}) => {
    setLoading(true);
    try {
      const res = await API.get("/user/stores", {
        params: {
          q: params.q || "",
          sort: params.sort || "name",
          order: params.order || "asc",
          page: 1,
          limit: 50,
        },
      });
      setStores(res.data.data || []);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to fetch stores");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const doRate = async (store, ratingValue) => {
    try {
      await API.post("/user/rate", {
        store_id: store.id,
        rating: ratingValue,
      });
      alert("Rating saved");
      fetchStores();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to save rating");
    }
  };

  const handleRate = async (store) => {
    const r = parseInt(
      prompt(`Enter rating for ${store.name} (1-5)`, store.my_rating || "5")
    );
    if (!r || r < 1 || r > 5) {
      alert("Invalid rating");
      return;
    }
    await doRate(store, r);
  };

  const handlePasswordUpdate = async () => {
    if (!oldPassword || !newPassword) {
      alert("Both fields are required");
      return;
    }

    try {
      await API.post("/auth/update-password", {
        oldPassword,
        newPassword,
      });

      alert("Password updated successfully !");
      setOldPassword("");
      setNewPassword("");
      setShowModal(false); 
    } catch (e) {
      alert(e.response?.data?.error || "Failed to update password");
    }
  };

  return (
    <div>
      <h4>User Dashboard</h4>

      <div className="mb-2">
        <button
          className="btn btn-sm btn-outline-secondary me-2"
          onClick={() => fetchStores()}
        >
          Refresh
        </button>

        <button
          className="btn btn-sm btn-warning"
          onClick={() => setShowModal(true)}
        >
          Change Password
        </button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <StoreTable data={stores} onRate={handleRate} onRefresh={fetchStores} />
      )}

      {showModal && (
        <div
          className="modal d-block"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Change Password</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>

              <div className="modal-body">
                <input
                  type="password"
                  className="form-control mb-2"
                  placeholder="Enter old password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />

                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button
                  className="btn btn-warning"
                  onClick={handlePasswordUpdate}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
