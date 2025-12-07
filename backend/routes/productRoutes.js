import express from "express";
import LostFoundItem from "../models/product.js";
import upload from "../middleware/upload.js";
import { verifyToken, isAdmin } from "../middleware/auth.js";

const router = express.Router();

router.post("/", verifyToken, upload.single("image"), async (req, res) => {
  try {
    const { name, category, description, location, itemType } = req.body;

    if (!name || !category || !description || !location || !itemType) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!["lost", "found"].includes(itemType)) {
      return res.status(400).json({ message: "itemType must be 'lost' or 'found'" });
    }

    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const item = await LostFoundItem.create({
      name,
      category,
      description,
      location,
      itemType,
      image: imagePath,
      postedBy: req.user._id,
    });

    await item.populate("postedBy", "username email");
    res.status(201).json(item);
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
      itemType,
    } = req.query;

    page = Number(page);
    limit = Number(limit);

    const query = { isRemoved: false };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    if (category) query.category = category;
    if (itemType) query.itemType = itemType;

    const sort = { [sortBy]: sortOrder === "asc" ? 1 : -1 };
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      LostFoundItem.find(query)
        .populate("postedBy", "username email")
        .sort(sort)
        .skip(skip)
        .limit(limit),
      LostFoundItem.countDocuments(query),
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

router.get("/flagged", verifyToken, isAdmin, async (req, res) => {
  try {
    const items = await LostFoundItem.find({ isFlagged: true, isRemoved: false })
      .populate("postedBy", "username email")
      .sort({ createdAt: -1 });

    res.json({ items });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const item = await LostFoundItem.findById(req.params.id).populate(
      "postedBy",
      "username email"
    );
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.put("/:id", verifyToken, upload.single("image"), async (req, res) => {
  try {
    const item = await LostFoundItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });

    if (item.postedBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { name, category, description, location, itemType } = req.body;

    if (name) item.name = name;
    if (category) item.category = category;
    if (description) item.description = description;
    if (location) item.location = location;
    if (itemType) item.itemType = itemType;
    if (req.file) item.image = `/uploads/${req.file.filename}`;

    await item.save();
    await item.populate("postedBy", "username email");
    res.json(item);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.patch("/:id/flag", verifyToken, async (req, res) => {
  try {
    const item = await LostFoundItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });

    item.isFlagged = true;
    await item.save();
    res.json(item);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.patch("/:id/unflag", verifyToken, isAdmin, async (req, res) => {
  try {
    const item = await LostFoundItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });

    item.isFlagged = false;
    await item.save();
    res.json(item);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.patch("/:id/remove", verifyToken, isAdmin, async (req, res) => {
  try {
    const item = await LostFoundItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });

    item.isRemoved = true;
    await item.save();
    res.json(item);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.patch("/:id/restore", verifyToken, isAdmin, async (req, res) => {
  try {
    const item = await LostFoundItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });

    item.isRemoved = false;
    await item.save();
    res.json(item);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const item = await LostFoundItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });

    if (item.postedBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    await LostFoundItem.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

export default router;
