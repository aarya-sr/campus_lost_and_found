import mongoose from "mongoose";

const claimSchema = new mongoose.Schema(
  {
    item: { type: mongoose.Schema.Types.ObjectId, ref: "LostFoundItem", required: true },
    claimer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  },
  { timestamps: true }
);

export default mongoose.model("Claim", claimSchema);

