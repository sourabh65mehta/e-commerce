import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    userId: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    items:[{
        productId: {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Product",
            
        },
        quantity: {
           type:Number,
           min:1,
           default:1
        }
        } ],

    totalcartprice:{
        type:Number,
        min:0,
    }


},{timestamps:true})

export const Cart = mongoose.model("Cart",cartSchema);