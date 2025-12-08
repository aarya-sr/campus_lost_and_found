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

function Products() {
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
  const limit = 10;

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
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-100 mb-2">
            Lost & Found
          </h1>
          <p className="text-gray-500 text-sm">
            Help reunite lost items with their owners
          </p>
        </div>

        <div className="mb-6 card">
          <div className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => {
                  setPage(1);
                  setSearch(e.target.value);
                }}
                className="input-field"
              />
            </div>
            <select
              value={category}
              onChange={(e) => {
                setPage(1);
                setCategory(e.target.value);
              }}
              className="input-field min-w-[150px]"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <select
              value={itemType}
              onChange={(e) => {
                setPage(1);
                setItemType(e.target.value);
              }}
              className="input-field min-w-[130px]"
            >
              <option value="">All Types</option>
              <option value="lost">Lost</option>
              <option value="found">Found</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field min-w-[150px]"
            >
              <option value="createdAt">Date</option>
              <option value="itemType">Type</option>
              <option value="name">Name</option>
            </select>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="input-field min-w-[100px]"
            >
              <option value="desc">Desc</option>
              <option value="asc">Asc</option>
            </select>
          </div>
        </div>

        {user && (
          <div className="mb-6">
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
              {showForm ? "Cancel" : editingId ? "Cancel Edit" : "+ Post Item"}
            </button>
          </div>
        )}

        {showForm && user && (
          <div className="mb-8 card">
            <h2 className="text-lg font-medium text-gray-200 mb-6">
              {editingId ? "Edit Item" : "Post Item"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Item Name *
                  </label>
                  <input
                    required
                    placeholder="Item name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Category *
                  </label>
                  <select
                    required
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="input-field"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  placeholder="Description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="input-field min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Location *
                  </label>
                  <input
                    required
                    placeholder="Location"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Type *
                  </label>
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
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Image (Optional)
                </label>
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
                    className="mt-3 rounded-lg max-w-xs max-h-48 object-cover border border-gray-800"
                  />
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary">
                  {editingId ? "Update" : "Post"}
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
          <div className="text-center py-16">
            <h3 className="text-lg font-medium text-gray-400 mb-2">No items found</h3>
            <p className="text-gray-600 text-sm">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {items.map((item) => (
              <div key={item._id} className="card hover:border-gray-700 transition-colors">
                {item.image && (
                  <div className="relative overflow-hidden rounded-lg mb-4 -m-6 mt-0">
                    <img
                      src={`http://localhost:5001${item.image}`}
                      alt={item.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <span
                        className={`px-2.5 py-1 rounded text-xs font-medium backdrop-blur-sm ${
                          item.itemType === "lost"
                            ? "bg-gray-900/80 text-gray-300 border border-gray-700"
                            : "bg-gray-900/80 text-gray-300 border border-gray-700"
                        }`}
                      >
                        {item.itemType.toUpperCase()}
                      </span>
                    </div>
                  </div>
                )}
                {!item.image && (
                  <div className="relative overflow-hidden rounded-lg mb-4 -m-6 mt-0 bg-gray-800/50 h-48 flex items-center justify-center border-b border-gray-800">
                    <span className="text-4xl opacity-30">📦</span>
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 rounded text-xs font-medium bg-gray-900/80 text-gray-300 border border-gray-700 backdrop-blur-sm">
                        {item.itemType.toUpperCase()}
                      </span>
                    </div>
                  </div>
                )}

                <h3 className="text-lg font-semibold text-gray-100 mb-2">{item.name}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">{item.description}</p>

                <div className="space-y-1.5 mb-4 text-sm">
                  <div className="text-gray-500">
                    <span className="text-gray-400">📍</span> {item.location}
                  </div>
                  <div className="text-gray-500">
                    <span className="text-gray-400">🏷️</span> {item.category}
                  </div>
                  <div className="text-gray-600 text-xs">
                    {item.postedBy?.username || "Unknown"} · {new Date(item.createdAt).toLocaleDateString()}
                  </div>
                </div>

                {item.isFlagged && (
                  <div className="mb-3 px-3 py-2 bg-gray-800/50 border border-yellow-900/30 rounded text-xs text-yellow-400/80">
                    ⚠️ Flagged for review
                  </div>
                )}

                <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-800">
                  {!isAdmin && (
                    <button
                      onClick={() => flagItem(item._id)}
                      className="px-3 py-1.5 text-xs font-medium text-gray-400 bg-gray-800 border border-gray-700 rounded hover:bg-gray-700 hover:text-gray-300 transition-colors"
                    >
                      Flag
                    </button>
                  )}
                  {isAdmin && (
                    <button
                      onClick={() => removeItem(item._id)}
                      className="px-3 py-1.5 text-xs font-medium text-gray-300 bg-gray-800 border border-red-900/50 rounded hover:bg-gray-700 transition-colors"
                    >
                      Remove
                    </button>
                  )}
                  {(item.postedBy?._id?.toString() === user?.id ||
                    item.postedBy?.toString() === user?.id) && (
                    <>
                      <button
                        onClick={() => startEdit(item)}
                        className="px-3 py-1.5 text-xs font-medium text-gray-400 bg-gray-800 border border-gray-700 rounded hover:bg-gray-700 hover:text-gray-300 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteOne(item._id)}
                        className="px-3 py-1.5 text-xs font-medium text-gray-400 bg-gray-800 border border-gray-700 rounded hover:bg-gray-700 hover:text-gray-300 transition-colors"
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
          <div className="flex justify-center items-center gap-3 mt-8">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="btn-secondary disabled:opacity-30 disabled:cursor-not-allowed text-sm px-4 py-2"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-sm text-gray-400">
              {page} / {totalPages}
            </span>
            <button
              disabled={page === totalPages || totalPages === 0}
              onClick={() => setPage(page + 1)}
              className="btn-secondary disabled:opacity-30 disabled:cursor-not-allowed text-sm px-4 py-2"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;
