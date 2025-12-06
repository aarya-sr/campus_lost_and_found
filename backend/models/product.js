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





const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String },
    price: { type: Number, required: true },
    inStock: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
