import mongoose from "mongoose";


const msgSchema=new mongoose.Schema(
    {
        firstName:{
            type:String,
            required:true,
            minLength: [3, "First Name must contain at least 3 characters!"]
        },
        lastName:{
            type:String,
            required:true,
            minLength: [3, "Last Name must contain at least 3 characters!"]
        },
        email:{
            type:String,
            required:true,
            //minLength: [validator.isEmail, "Please Provide A Valid Email!"]
        },
        phone:{
            type:String,
            required:true,
            minLength: [10, "Phone Number Must Contain Exact 10 Digits!"],
            maxLength: [10, "Phone Number Must Contain Exact 10 Digits!"],
        },
        message:{
            type:String,
            required:true,
            minLength: [10, "Message Must Contain At least 10 Characters!"]
        },
    }
);

export const Message=mongoose.model("Message", msgSchema);