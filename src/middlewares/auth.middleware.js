import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";

export const verifyJWT = AsyncHandler(async (req, res, next) => {
    try {
        const token = 
            req.cookies?.accessToken || 
            req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "Unauthorized access: Token not provided");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id).select("-password");

        if (!user) {
            throw new ApiError(401, "Invalid Access Token");
        }

        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Access Token");
    }
});

export const isAdmin = (req, res, next) => {
    if (!req.user) {
        throw new ApiError(401, "Unauthorized access: Authentication required");
    }

    if (req.user.role !== "admin") {
        throw new ApiError(403, "Forbidden: Admin privileges required");
    }

    next();
};
