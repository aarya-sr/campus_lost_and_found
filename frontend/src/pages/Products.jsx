import React, { useEffect, useState } from "react";
import api from "../api";

const categories = ["electronics", "ID cards", "clothing", "books", "accessories", "other"];

const emptyForm = {
  name: "",
  category: "",
  description: "",
  location: "",
  itemType: "lost",
  image: null,
};

function Products({ startWithForm = false }) {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [category, setCategory] = useState("");
  const [itemType, setItemType] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [user, setUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const limit = 12;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser({ id: payload.id, role: payload.role || "user" });
      } catch (e) {
        console.error("Error parsing token", e);
      }
    }
  }, []);

  useEffect(() => {
    if (startWithForm) {
      setShowForm(true);
    }
  }, [startWithForm]);

  const loadProducts = async () => {
    try {
      const res = await api.get("/products", {
        params: {
          page,
          limit,
          search,
          sortBy,
          sortOrder,
          category: category || undefined,
          itemType: itemType || undefined,
        },
      });
      setItems(res.data.items);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [page, search, sortBy, sortOrder, category, itemType]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!localStorage.getItem("token")) {
      alert("Please login to post items");
      return;
    }

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("category", form.category);
    formData.append("description", form.description);
    formData.append("location", form.location);
    formData.append("itemType", form.itemType);
    if (form.image) {
      formData.append("image", form.image);
    }

    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/products", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setForm(emptyForm);
      setImagePreview(null);
      setEditingId(null);
      setShowForm(false);
      loadProducts();
    } catch (error) {
      alert(error.response?.data?.message || "Error saving item");
    }
  };

  const startEdit = (item) => {
    setEditingId(item._id);
    setForm({
      name: item.name,
      category: item.category,
      description: item.description,
      location: item.location,
      itemType: item.itemType,
      image: null,
    });
    setImagePreview(item.image ? `http://localhost:5001${item.image}` : null);
    setShowForm(true);
  };

  const deleteOne = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await api.delete(`/products/${id}`);
      loadProducts();
    } catch (error) {
      alert(error.response?.data?.message || "Error deleting item");
    }
  };

  const flagItem = async (id) => {
    try {
      await api.patch(`/products/${id}/flag`);
      loadProducts();
    } catch (error) {
      alert(error.response?.data?.message || "Error flagging item");
    }
  };

  const removeItem = async (id) => {
    if (!window.confirm("Are you sure you want to remove this item?")) return;
    try {
      await api.patch(`/products/${id}/remove`);
      loadProducts();
    } catch (error) {
      alert(error.response?.data?.message || "Error removing item");
    }
  };

  const isAdmin = user?.role === "admin";

  return (
    <div className="min-h-screen pb-16">
      <div className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12 space-y-10">
          <div className="rounded-3xl bg-gradient-to-r from-emerald-500 via-cyan-500 to-sky-500 text-white shadow-2xl p-8 md:p-12">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              <div className="space-y-3 max-w-2xl">
                <p className="text-sm uppercase tracking-[0.2em] font-semibold text-white/80">
                  Campus Lost & Found
                </p>
                <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                  Reunite people with their belongings faster.
                </h1>
                <p className="text-white/85 text-lg">
                  Browse reported items, flag what you’ve seen, or post a new lost/found report.
                  Everything is community-powered and moderated.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setShowForm(true)}
                    className="btn-secondary bg-white text-emerald-700 border-emerald-100 hover:bg-emerald-50"
                  >
                    Report an item
                  </button>
                  <button
                    onClick={() => setShowForm(false)}
                    className="btn-primary bg-emerald-700 hover:bg-emerald-600"
                  >
                    Browse board
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="card text-slate-900 shadow-lg shadow-emerald-100">
                  <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">Active posts</p>
                  <p className="text-3xl font-bold mt-1">{items.length || "—"}</p>
                </div>
                <div className="card text-slate-900 shadow-lg shadow-emerald-100">
                  <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">Categories</p>
                  <p className="text-3xl font-bold mt-1">{categories.length}</p>
                </div>
                <div className="card col-span-2 text-slate-900 shadow-lg shadow-emerald-100">
                  <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">Tips</p>
                  <p className="text-sm text-slate-600 mt-1">
                    Start with a clear title, location, and when you last saw the item. Upload a photo if you can.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="card space-y-4">
            <div className="flex flex-wrap gap-3">
              <div className="flex-1 min-w-[200px]">
                <label className="text-xs font-semibold text-slate-500 block mb-1">Search items</label>
                <input
                  type="text"
                  placeholder="Search by name, keyword, or location"
                  value={search}
                  onChange={(e) => {
                    setPage(1);
                    setSearch(e.target.value);
                  }}
                  className="input-field"
                />
              </div>
              <div className="min-w-[150px]">
                <label className="text-xs font-semibold text-slate-500 block mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => {
                    setPage(1);
                    setCategory(e.target.value);
                  }}
                  className="input-field"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div className="min-w-[140px]">
                <label className="text-xs font-semibold text-slate-500 block mb-1">Type</label>
                <select
                  value={itemType}
                  onChange={(e) => {
                    setPage(1);
                    setItemType(e.target.value);
                  }}
                  className="input-field"
                >
                  <option value="">All Types</option>
                  <option value="lost">Lost</option>
                  <option value="found">Found</option>
                </select>
              </div>
              <div className="min-w-[150px]">
                <label className="text-xs font-semibold text-slate-500 block mb-1">Sort by</label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="input-field">
                  <option value="createdAt">Date</option>
                  <option value="itemType">Type</option>
                  <option value="name">Name</option>
                </select>
              </div>
              <div className="min-w-[120px]">
                <label className="text-xs font-semibold text-slate-500 block mb-1">Order</label>
                <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="input-field">
                  <option value="desc">Newest</option>
                  <option value="asc">Oldest</option>
                </select>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200">
              <p className="text-sm text-slate-600">
                Browse community posts or add yours. Keep details concise and respectful.
              </p>
              {user && (
                <button
                  onClick={() => {
                    setShowForm(!showForm);
                    if (showForm) {
                      setEditingId(null);
                      setForm(emptyForm);
                      setImagePreview(null);
                    }
                  }}
                  className="btn-primary"
                >
                  {showForm ? "Close form" : editingId ? "Cancel edit" : "Report item"}
                </button>
              )}
            </div>
          </div>

          {showForm && user && (
            <div className="card space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">Report</p>
                  <h2 className="text-xl font-bold text-slate-900">
                    {editingId ? "Edit your report" : "Share a lost or found item"}
                  </h2>
                  <p className="text-sm text-slate-500">
                    Include where you last saw it and any unique details to speed up the match.
                  </p>
                </div>
                <span className="pill bg-emerald-50 text-emerald-700 border-emerald-100">Step 1 of 1</span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Item Name *</label>
                    <input
                      required
                      placeholder="AirPods, hoodie, ID card..."
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Category *</label>
                    <select
                      required
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="input-field"
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Description *</label>
                  <textarea
                    required
                    placeholder="Color, identifying marks, brand, attachments, etc."
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="input-field min-h-[110px]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Location *</label>
                    <input
                      required
                      placeholder="Library, cafeteria, building name..."
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Type *</label>
                    <select
                      required
                      value={form.itemType}
                      onChange={(e) => setForm({ ...form, itemType: e.target.value })}
                      className="input-field"
                    >
                      <option value="lost">Lost</option>
                      <option value="found">Found</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Image (Optional)</label>
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={handleImageChange}
                    className="input-field"
                  />
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="mt-3 rounded-xl max-w-md max-h-56 object-cover border border-slate-200 shadow-sm"
                    />
                  )}
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <button type="submit" className="btn-primary">
                    {editingId ? "Update report" : "Post report"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setForm(emptyForm);
                      setImagePreview(null);
                      setShowForm(false);
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {items.length === 0 ? (
            <div className="card text-center py-12">
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No items found</h3>
              <p className="text-slate-500 mb-4">Try another search or clear filters.</p>
              {user && (
                <button onClick={() => setShowForm(true)} className="btn-primary">
                  Post the first report
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {items.map((item) => (
                <div key={item._id} className="card hover:shadow-xl transition-shadow duration-200">
                  {item.image ? (
                    <div className="relative overflow-hidden rounded-xl -m-6 mb-4">
                      <img
                        src={`http://localhost:5001${item.image}`}
                        alt={item.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-3 right-3">
                        <span
                          className={`pill ${
                            item.itemType === "lost"
                              ? "bg-rose-50 text-rose-700 border-rose-200"
                              : "bg-emerald-50 text-emerald-700 border-emerald-200"
                          }`}
                        >
                          {item.itemType === "lost" ? "Lost" : "Found"}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="relative overflow-hidden rounded-xl -m-6 mb-4 bg-slate-100 h-48 flex items-center justify-center border-b border-slate-200">
                      <span className="text-4xl opacity-40">📦</span>
                      <div className="absolute top-3 right-3">
                        <span className="pill bg-slate-900 text-white border-slate-900/30">
                          {item.itemType === "lost" ? "Lost" : "Found"}
                        </span>
                      </div>
                    </div>
                  )}

                  <h3 className="text-lg font-semibold text-slate-900 mb-1">{item.name}</h3>
                  <p className="text-sm text-slate-600 mb-3 line-clamp-2 leading-relaxed">{item.description}</p>

                  <div className="space-y-1.5 mb-4 text-sm">
                    <div className="text-slate-700">
                      <span className="mr-2">📍</span> {item.location}
                    </div>
                    <div className="text-slate-700">
                      <span className="mr-2">🏷️</span> {item.category}
                    </div>
                    <div className="text-slate-500 text-xs">
                      {item.postedBy?.username || "Unknown"} · {new Date(item.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  {item.isFlagged && (
                    <div className="mb-3 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700">
                      ⚠️ Flagged for review
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-200">
                    {!isAdmin && (
                      <button
                        onClick={() => flagItem(item._id)}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 border border-slate-200 rounded-lg hover:bg-slate-200 transition-colors"
                      >
                        Flag
                      </button>
                    )}
                    {isAdmin && (
                      <button
                        onClick={() => removeItem(item._id)}
                        className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors"
                      >
                        Remove
                      </button>
                    )}
                    {(item.postedBy?._id?.toString() === user?.id || item.postedBy?.toString() === user?.id) && (
                      <>
                        <button
                          onClick={() => startEdit(item)}
                          className="px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteOne(item._id)}
                          className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors"
                        >
                          Delete
                        </button>
                      </>
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
              <span className="px-4 py-2 text-sm text-slate-600">
                Page {page} of {totalPages}
              </span>
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
    </div>
  );
}

export default Products;
