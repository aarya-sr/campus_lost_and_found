const express = require("express");
const Product = require("../models/product");
const router = express.Router();


router.post("/", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});


router.post("/bulk", async (req, res) => {
  try {
    const products = await Product.insertMany(req.body.products || []);
    res.status(201).json(products);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});


router.get("/", async (req, res) => {
  try {
    let {
      page = 1,
      limit = 10,
      search = "",
      sortBy = "createdAt",
      sortOrder = "desc",
      category,
      minPrice,
      maxPrice,
      inStock,
    } = req.query;

    page = Number(page);
    limit = Number(limit);

    const query = {};

    if (search) {
      query.name = { $regex: search, $options: "i" }; // search by name
    }
    if (category) query.category = category;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (inStock === "true" || inStock === "false") {
      query.inStock = inStock === "true";
    }

    const sort = { [sortBy]: sortOrder === "asc" ? 1 : -1 };
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Product.find(query).sort(sort).skip(skip).limit(limit),
      Product.countDocuments(query),
    ]);

    res.json({
      items,
      page,
      totalPages: Math.ceil(total / limit),
      total,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Not found" });
    res.json(product);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});



router.put("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) return res.status(404).json({ message: "Not found" });
    res.json(product);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.patch("/:id/toggle-stock", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Not found" });
    product.inStock = !product.inStock;
    await product.save();
    res.json(product);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});



router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});


router.delete("/", async (req, res) => {
  try {
    const { ids } = req.body; 
    const result = await Product.deleteMany({ _id: { $in: ids } });
    res.json({ deletedCount: result.deletedCount });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

module.exports = router;
