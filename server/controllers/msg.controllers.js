import { Message } from "../models/msg.model.js";
import ErrorHandler from "../middlewares/error.middlewares.js";
import {asyncHandler} from "../utils/asyncHandler.js"

export const sendMessage=asyncHandler(async (req, res, next)=>{
    const {firstName, lastName, email, phone, message} =req.body;

    if(!firstName|| !lastName|| !email|| !phone|| !message) {
        return next(new ErrorHandler("Please Fill the Full Form", 400));
    }

    // Convert phone to string if it's a number
    const phoneStr = phone.toString();

    try {
        await Message.create({
            firstName,
            lastName,
            email,
            phone: phoneStr,
            message
        });
        
        res.status(200).json({
            success: true,
            message: "Message sent successfully!"
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return next(new ErrorHandler(error.message, 400));
        }
        return next(new ErrorHandler("Error sending message. Please try again.", 500));
    }
});

export const getAllMessages = asyncHandler(async (req, res, next) => {
    try {
        const messages = await Message.find();
        res.status(200).json({
            success: true,
            messages,
        });
    } catch (error) {
        return next(new ErrorHandler("Error fetching messages", 500));
    }
});