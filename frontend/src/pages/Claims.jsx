import React, { useEffect, useState } from "react";
import api from "../api";

const statusOptions = ["pending", "approved", "rejected"];

export default function Claims() {
  const [claims, setClaims] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState("");
  const [itemId, setItemId] = useState("");
  const [user, setUser] = useState(null);
  const limit = 10;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser({ id: payload.id, role: payload.role || "user" });
      } catch (e) {
        localStorage.removeItem("token");
        setUser(null);
      }
    }
  }, []);

  const loadClaims = async () => {
    try {
      const res = await api.get("/claims", {
        params: {
          page,
          limit,
          status: status || undefined,
          itemId: itemId || undefined,
        },
      });
      setClaims(res.data.claims);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error("Error loading claims:", error);
    }
  };

  useEffect(() => {
    loadClaims();
  }, [page, status, itemId]);

  const editMessage = async (claim) => {
    const message = window.prompt("Update your claim note:", claim.message || "");
    if (message === null) return;
    try {
      await api.put(`/claims/${claim._id}`, { message });
      loadClaims();
    } catch (error) {
      alert(error.response?.data?.message || "Error updating claim");
    }
  };

  const approve = async (id) => {
    try {
      await api.patch(`/claims/${id}/approve`);
      loadClaims();
    } catch (error) {
      alert(error.response?.data?.message || "Error approving claim");
    }
  };

  const reject = async (id) => {
    try {
      await api.patch(`/claims/${id}/reject`);
      loadClaims();
    } catch (error) {
      alert(error.response?.data?.message || "Error rejecting claim");
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this claim?")) return;
    try {
      await api.delete(`/claims/${id}`);
      loadClaims();
    } catch (error) {
      alert(error.response?.data?.message || "Error deleting claim");
    }
  };

  const isAdmin = user?.role === "admin";

  return (
    <div className="min-h-screen pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12 space-y-10">
        <div className="rounded-3xl bg-gradient-to-r from-emerald-500 via-cyan-500 to-sky-500 text-white shadow-2xl p-8 md:p-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="space-y-3 max-w-2xl">
              <p className="text-sm uppercase tracking-[0.2em] font-semibold text-white/80">Claims</p>
              <h1 className="text-3xl md:text-4xl font-bold leading-tight">Manage item claims</h1>
              <p className="text-white/85 text-lg">Track your submitted claims and view their status. Admins can approve or reject.</p>
            </div>
          </div>
        </div>

        <div className="card space-y-4">
          <div className="flex flex-wrap gap-3 items-end">
            <div className="min-w-[160px]">
              <label className="text-xs font-semibold text-slate-500 block mb-1">Status</label>
              <select value={status} onChange={(e) => { setPage(1); setStatus(e.target.value); }} className="input-field">
                <option value="">All</option>
                {statusOptions.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="flex-1 min-w-[220px]">
              <label className="text-xs font-semibold text-slate-500 block mb-1">Filter by Item ID</label>
              <input
                value={itemId}
                onChange={(e) => { setPage(1); setItemId(e.target.value); }}
                placeholder="Optional"
                className="input-field"
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200">
            <p className="text-sm text-slate-600">View claims you submitted. Admins see all claims.</p>
          </div>
        </div>

        {claims.length === 0 ? (
          <div className="card text-center py-12">
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No claims</h3>
            <p className="text-slate-500">Submit a claim from a found item card.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {claims.map((c) => (
              <div key={c._id} className="card hover:shadow-xl transition-shadow duration-200">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{c.item?.name || "Item"}</h3>
                    <p className="text-sm text-slate-600">{c.item?.location} · {c.item?.category}</p>
                  </div>
                  <span
                    className={`pill ${
                      c.status === "approved"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : c.status === "rejected"
                        ? "bg-rose-50 text-rose-700 border-rose-200"
                        : "bg-slate-100 text-slate-700 border-slate-200"
                    }`}
                  >
                    {c.status}
                  </span>
                </div>
                {c.message && <p className="text-sm text-slate-700 mt-2">{c.message}</p>}
                <div className="text-xs text-slate-500 mt-2">
                  {c.claimer?.username} · {new Date(c.createdAt).toLocaleDateString()}
                </div>
                <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-200">
                  {user && c.claimer?._id?.toString() === user.id && c.status === "pending" && (
                    <button
                      onClick={() => editMessage(c)}
                      className="px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors"
                    >
                      Edit
                    </button>
                  )}
                  {user && c.claimer?._id?.toString() === user.id && (
                    <button
                      onClick={() => remove(c._id)}
                      className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors"
                    >
                      Delete
                    </button>
                  )}
                  {isAdmin && c.status !== "approved" && (
                    <button
                      onClick={() => approve(c._id)}
                      className="px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors"
                    >
                      Approve
                    </button>
                  )}
                  {isAdmin && c.status !== "rejected" && (
                    <button
                      onClick={() => reject(c._id)}
                      className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors"
                    >
                      Reject
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 pt-4">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="btn-secondary disabled:opacity-40 disabled:cursor-not-allowed text-sm px-4 py-2"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-sm text-slate-600">Page {page} of {totalPages}</span>
            <button
              disabled={page === totalPages || totalPages === 0}
              onClick={() => setPage(page + 1)}
              className="btn-secondary disabled:opacity-40 disabled:cursor-not-allowed text-sm px-4 py-2"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

