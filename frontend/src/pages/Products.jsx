import React, { useEffect, useState } from "react";
import api from "../api";

const emptyForm = { name: "", category: "", price: "", inStock: true };

function Products() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const limit = 5;

  const loadProducts = async () => {
    const res = await api.get("/products", {
      params: {
        page,
        limit,
        search,
        sortBy,
        sortOrder,
        category: category || undefined,
        minPrice: minPrice || undefined,
        maxPrice: maxPrice || undefined,
      },
    });
    setItems(res.data.items);
    setTotalPages(res.data.totalPages);
  };

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line
  }, [page, search, sortBy, sortOrder, category, minPrice, maxPrice]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, price: Number(form.price) };

    if (editingId) {
      await api.put(`/products/${editingId}`, payload);      // UPDATE 1
    } else {
      await api.post("/products", payload);                  // CREATE 1
    }

    setForm(emptyForm);
    setEditingId(null);
    loadProducts();
  };

  const startEdit = (p) => {
    setEditingId(p._id);
    setForm({
      name: p.name,
      category: p.category,
      price: p.price,
      inStock: p.inStock,
    });
  };

  const deleteOne = async (id) => {
    await api.delete(`/products/${id}`);                     // DELETE 1
    loadProducts();
  };

  const toggleStock = async (id) => {
    await api.patch(`/products/${id}/toggle-stock`);         // UPDATE 2
    loadProducts();
  };

  return (
    <div className="products-page">
      <h1>Products</h1>

      {/* Controls: search / filter / sort */}
      <div className="toolbar">
        <input
          placeholder="Search name"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />
        <input
          placeholder="Category filter"
          value={category}
          onChange={(e) => {
            setPage(1);
            setCategory(e.target.value);
          }}
        />
        <input
          type="number"
          placeholder="Min price"
          value={minPrice}
          onChange={(e) => {
            setPage(1);
            setMinPrice(e.target.value);
          }}
        />
        <input
          type="number"
          placeholder="Max price"
          value={maxPrice}
          onChange={(e) => {
            setPage(1);
            setMaxPrice(e.target.value);
          }}
        />
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="createdAt">Newest</option>
          <option value="name">Name</option>
          <option value="price">Price</option>
        </select>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="desc">Desc</option>
          <option value="asc">Asc</option>
        </select>
      </div>

      {/* Form: create / update */}
      <form className="card" onSubmit={handleSubmit}>
        <h2>{editingId ? "Edit Product" : "Add Product"}</h2>
        <input
          required
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />
        <input
          type="number"
          required
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />
        <label>
          <input
            type="checkbox"
            checked={form.inStock}
            onChange={(e) =>
              setForm({ ...form, inStock: e.target.checked })
            }
          />
          In stock
        </label>
        <button type="submit">
          {editingId ? "Update" : "Create"}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setForm(emptyForm);
            }}
          >
            Cancel
          </button>
        )}
      </form>

      {/* Table: read */}
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((p) => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td>{p.category}</td>
              <td>₹{p.price}</td>
              <td>
                <button onClick={() => toggleStock(p._id)}>
                  {p.inStock ? "In stock" : "Out"}
                </button>
              </td>
              <td>
                <button onClick={() => startEdit(p)}>Edit</button>
                <button onClick={() => deleteOne(p._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Prev
        </button>
        <span>
          {page} / {totalPages}
        </span>
        <button
          disabled={page === totalPages || totalPages === 0}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Products;
