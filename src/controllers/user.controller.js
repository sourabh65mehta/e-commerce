import {AsyncHandler} from "./../utils/AsyncHandler.js";
import { User } from "../models/user.model.js";
import { loginUserSchema, registerSchema } from "../validators/auth.validator.js";
import z from "zod"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessandRefreshToken = async function(userId) {
    const user  = await User.findById(userId);    

    const accessToken =  user.generateAccessToken();
    const refreshToken =  user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({validateBeforeSave:false})

    return {accessToken,refreshToken}
}

const registerUser = AsyncHandler(async (req, res) => {
    const result = registerSchema.safeParse(req.body)

    if (!result.success) {
        throw new ApiError(400, result.error.errors[0]?.message || "Invalid input data")
    }

    const { username, email, password } = req.body;
    const existingUser = await User.findOne({
        $or: [
            { email },
            { username }
        ]
    })
    if (existingUser) {
        throw new ApiError(409, "User already exists")
    }
    
    const createuser = await User.create({
        username,
        email,
        password
    })

    const { accessToken, refreshToken } = await generateAccessandRefreshToken(createuser._id)

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    }

    return res
        .status(201)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(201, "User registered successfully", {
            user: {
                id: createuser._id,
                username: createuser.username,
                email: createuser.email,
                role: createuser.role
            },
            accessToken,
            refreshToken
        }))
})

const loginUser = AsyncHandler(async (req, res) => {
    const result = loginUserSchema.safeParse(req.body)
    if (!result.success) {
        throw new ApiError(400, result.error.errors[0]?.message || "Invalid email or password")
    }
    const { email, password } = result.data

    const loginnedUser = await User.findOne({ email })
    if (!loginnedUser) {
        throw new ApiError(401, "Invalid email or password")
    }
    const passwordcheck = await loginnedUser.IspasswordCorrect(password)
    if (!passwordcheck) {
        throw new ApiError(401, "Invalid email or password")
    }

    const { accessToken, refreshToken } = await generateAccessandRefreshToken(loginnedUser._id)

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, "User logged in successfully", {
            user: {
                id: loginnedUser._id,
                username: loginnedUser.username,
                email: loginnedUser.email,
                role: loginnedUser.role
            },
            accessToken,
            refreshToken
        }))
})

const getLoggedinUser = AsyncHandler(async (req, res) => {
    return res.status(200).json(
        new ApiResponse(200, "User profile retrieved successfully", {
            user: req.user
        })
    )
})

export { registerUser, loginUser, getLoggedinUser }