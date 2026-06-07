import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";

export const errorMiddleware = (err, req, res, next) => {
    console.error(err);

    let error = err;

    // Convert standard Mongoose validation or cast errors into ApiError format
    if (err instanceof mongoose.Error.ValidationError) {
        error = new ApiError(400, "Validation Error: " + err.message, null, err.stack);
    } else if (err instanceof mongoose.Error.CastError) {
        error = new ApiError(400, "Invalid ID Format: " + err.message, null, err.stack);
    } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        error = new ApiError(404, "Document Not Found: " + err.message, null, err.stack);
    } else if (!(error instanceof ApiError)) {
        const statusCode = error.statusCode || 500;
        const message = error.message || "Internal Server Error";
        error = new ApiError(statusCode, message, null, err.stack);
    }

    const response = {
        success: false,
        statusCode: error.statusCode,
        message: error.message,
        errors: error.errors || [],
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined
    };

    return res.status(error.statusCode || 500).json(response);
};


