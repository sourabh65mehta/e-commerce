import mongoose from "mongoose";
import { db_name } from "../constants.js";

const connectDb = async ()=>{
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGO_DB_URL,{
            dbName:db_name
        })
        console.log(`✅mongodb connected! DB Host:${connectionInstance.connection.host}`)
    } catch (error) {

        console.error("❌mongoDB not connected", error.message)
        process.exit(1)
    }
}

export default connectDb;