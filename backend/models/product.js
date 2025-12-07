// import mongoose from "mongoose";
// const productSchema = mongoose.Schema(
//     {
//         name:{
//             type:String,
//             required:true
//         },
//         price:{
//             type:Number,
//             required:true
//         },
//         image:{
//             type:String,
//             required:true
//         }
//     },{
//         timestamps:true //createdAt,updatedAt
//     }
// );

// const Product = mongoose.model('Product',productSchema);

// export default Product;





import mongoose from "mongoose";

const lostFoundItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    itemType: { type: String, enum: ["lost", "found"], required: true },
    image: { type: String },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    isFlagged: { type: Boolean, default: false },
    isRemoved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("LostFoundItem", lostFoundItemSchema);
