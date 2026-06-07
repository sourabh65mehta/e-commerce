import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    image:{
        type:String,
        

    },
    price:{
       type:Number,
       min:0,
    },
    stock:{
        type:Number,
        min:0,
    },
    description:{
        type:String,
    },
    category:{
        type:String,
    }

},{timestamps:true})
export const Product = mongoose.model("Product",productSchema)
