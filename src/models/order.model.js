import mongoose from "mongoose";
import { Product } from "./product.model";
import { User } from "./user.model";

const orderSchema = new mongoose.Schema({
items:[{
    productId:{
    type:  mongoose.Schema.Types.ObjectId,
    ref:"Product"
    },
    quantity:{
        type:Number,
        min:1,
        default:1
    },
    price:{
      type:Number,
      min:0
    }
}],

address: {
    type:String,
    required:true,

},
status:{
    type:String,
    enum:["pending","shipped","Out for delivery","delivered"],
    default:"pending"
},
totalAmount:{
    type:Number,
    required:true,
    
},
useremail:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
}

},{timestamps:true})


export const Order = mongoose.model("Order",orderSchema)