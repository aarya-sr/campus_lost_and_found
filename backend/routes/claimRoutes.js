import express from "express";
import Claim from "../models/claim.js";
import LostFoundItem from "../models/product.js";
import { verifyToken, isAdmin } from "../middleware/auth.js";

const router = express.Router();

router.post("/", verifyToken, async (req, res) => {
  try {
    const { itemId, message } = req.body;
    if (!itemId) {
      return res.status(400).json({ message: "itemId is required" });
    }

    const item = await LostFoundItem.findById(itemId);
    if (!item || item.isRemoved) {
      return res.status(404).json({ message: "Item not found" });
    }

    const existing = await Claim.findOne({ item: itemId, claimer: req.user._id, status: "pending" });
    if (existing) {
      return res.status(400).json({ message: "A pending claim already exists for this item" });
    }

    const claim = await Claim.create({ item: itemId, claimer: req.user._id, message });
    await claim.populate([
      { path: "item", select: "name category location itemType" },
      { path: "claimer", select: "username email" },
    ]);
    res.status(201).json(claim);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.get("/", verifyToken, async (req, res) => {
  try {
    let { page = 1, limit = 10, status, itemId } = req.query;
    page = Number(page);
    limit = Number(limit);

    const query = {};
    if (status) query.status = status;
    if (itemId) query.item = itemId;
    if (req.user.role !== "admin") query.claimer = req.user._id;

    const skip = (page - 1) * limit;
    const [claims, total] = await Promise.all([
      Claim.find(query)
        .populate([
          { path: "item", select: "name category location itemType" },
          { path: "claimer", select: "username email" },
        ])
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Claim.countDocuments(query),
    ]);

    res.json({ claims, page, totalPages: Math.ceil(total / limit), total });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get("/:id", verifyToken, async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id).populate([
      { path: "item", select: "name category location itemType" },
      { path: "claimer", select: "username email" },
    ]);
    if (!claim) return res.status(404).json({ message: "Not found" });
    if (req.user.role !== "admin" && claim.claimer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }
    res.json(claim);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.put("/:id", verifyToken, async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id);
    if (!claim) return res.status(404).json({ message: "Not found" });

    const isOwner = claim.claimer.toString() === req.user._id.toString();
    const isAdminUser = req.user.role === "admin";

    if (!isOwner && !isAdminUser) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { message, status } = req.body;

    if (isOwner && claim.status !== "pending" && message !== undefined) {
      return res.status(400).json({ message: "Only pending claims can be edited by owner" });
    }

    if (message !== undefined) claim.message = message;
    if (status !== undefined) {
      if (!isAdminUser) return res.status(403).json({ message: "Only admin can change status" });
      claim.status = status;
    }

    await claim.save();
    await claim.populate([
      { path: "item", select: "name category location itemType" },
      { path: "claimer", select: "username email" },
    ]);
    res.json(claim);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.patch("/:id/approve", verifyToken, isAdmin, async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id);
    if (!claim) return res.status(404).json({ message: "Not found" });
    claim.status = "approved";
    await claim.save();
    res.json(claim);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.patch("/:id/reject", verifyToken, isAdmin, async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id);
    if (!claim) return res.status(404).json({ message: "Not found" });
    claim.status = "rejected";
    await claim.save();
    res.json(claim);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id);
    if (!claim) return res.status(404).json({ message: "Not found" });
    const isOwner = claim.claimer.toString() === req.user._id.toString();
    const isAdminUser = req.user.role === "admin";
    if (!isOwner && !isAdminUser) {
      return res.status(403).json({ message: "Not authorized" });
    }
    await Claim.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

export default router;

