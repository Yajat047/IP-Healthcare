import { Message } from "../models/msg.model.js";
import ErrorHandler from "../middlewares/error.middlewares.js";
import {asyncHandler} from "../utils/asyncHandler.js"
export const sendMessage=asyncHandler(async (req, res, next)=>{
    const {firstName, lastName, email, phone, message} =req.body;

    if(!firstName|| !lastName|| !email|| !phone|| !message)
        {
            return next(new ErrorHandler("Please Fill the Full Form", 400));
        }

    await Message.create({firstName, lastName, email, phone, message});
        res.status(200).json({
            success:true,
            message: "Message sent successfully!"
        });
})

export const getAllMessages = asyncHandler(async (req, res, next) => {
  const messages = await Message.find();
  res.status(200).json({
    success: true,
    messages,
  });
});