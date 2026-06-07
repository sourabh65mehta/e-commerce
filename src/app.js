import express from "express";
import cookieParser from "cookie-parser";


const app = express();

app.use(cookieParser())

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))

import { router } from "./routes/user.routes.js"
import { errorMiddleware } from "./middlewares/error.middleware.js";

app.use("/api/v1/auth", router);

// Error middleware should be at the very end
app.use(errorMiddleware);

export default app;