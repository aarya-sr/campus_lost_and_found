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
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-3">
            Campus Lost & Found
          </h1>
          <p className="text-xl text-gray-600">
            Help reunite lost items with their owners
          </p>
        </div>

        <div className="mb-8 card">
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder="Search by name, description, or location..."
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
              <option value="createdAt">Date Posted</option>
              <option value="itemType">Item Type</option>
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
          <div className="mb-6 text-center">
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
              {showForm ? "Cancel" : editingId ? "Cancel Edit" : "+ Post New Item"}
            </button>
          </div>
        )}

        {showForm && user && (
          <div className="mb-8 card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingId ? "Edit Item" : "Post Lost/Found Item"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Item Name *
                  </label>
                  <input
                    required
                    placeholder="e.g., iPhone 13, Blue Backpack"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  placeholder="Describe the item in detail..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="input-field min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    required
                    placeholder="e.g., Library, Cafeteria, Building A"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Item Type *
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                    className="mt-3 rounded-xl max-w-xs max-h-48 object-cover border-2 border-gray-200"
                  />
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary">
                  {editingId ? "Update Item" : "Post Item"}
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
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">No items found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {items.map((item) => (
              <div key={item._id} className="card group hover:scale-[1.02] transition-transform">
                {item.image && (
                  <div className="relative overflow-hidden rounded-xl mb-4 -m-6 mt-0">
                    <img
                      src={`http://localhost:5001${item.image}`}
                      alt={item.name}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          item.itemType === "lost"
                            ? "bg-red-500 text-white"
                            : "bg-green-500 text-white"
                        }`}
                      >
                        {item.itemType.toUpperCase()}
                      </span>
                    </div>
                  </div>
                )}
                {!item.image && (
                  <div className="relative overflow-hidden rounded-xl mb-4 -m-6 mt-0 bg-gradient-to-br from-indigo-100 to-purple-100 h-48 flex items-center justify-center">
                    <span className="text-6xl">📦</span>
                    <div className="absolute top-3 right-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          item.itemType === "lost"
                            ? "bg-red-500 text-white"
                            : "bg-green-500 text-white"
                        }`}
                      >
                        {item.itemType.toUpperCase()}
                      </span>
                    </div>
                  </div>
                )}

                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.name}</h3>
                <p className="text-gray-600 mb-3 line-clamp-2">{item.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-semibold mr-2">📍</span>
                    {item.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-semibold mr-2">🏷️</span>
                    {item.category}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="font-semibold mr-2">👤</span>
                    {item.postedBy?.username || "Unknown"}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="font-semibold mr-2">📅</span>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </div>
                </div>

                {item.isFlagged && (
                  <div className="mb-3 px-3 py-2 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
                    <p className="text-yellow-700 text-xs font-semibold">⚠️ Flagged for review</p>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                  {!isAdmin && (
                    <button
                      onClick={() => flagItem(item._id)}
                      className="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Flag
                    </button>
                  )}
                  {isAdmin && (
                    <button
                      onClick={() => removeItem(item._id)}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Remove
                    </button>
                  )}
                  {(item.postedBy?._id?.toString() === user?.id ||
                    item.postedBy?.toString() === user?.id) && (
                    <>
                      <button
                        onClick={() => startEdit(item)}
                        className="px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteOne(item._id)}
                        className="px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
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
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-6 py-2 bg-white border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <span className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page === totalPages || totalPages === 0}
              onClick={() => setPage(page + 1)}
              className="px-6 py-2 bg-white border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
