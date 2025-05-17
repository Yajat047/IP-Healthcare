import mongoose from "mongoose";
import validator from "validator";

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
            validate: {
                validator: validator.isEmail,
                message: "Please provide a valid email address"
            }
        },
        phone:{
            type:String,
            required:true,
            validate: {
                validator: function(v) {
                    return /^\d{10}$/.test(v);
                },
                message: "Phone number must be exactly 10 digits"
            }
        },
        message:{
            type:String,
            required:true,
            minLength: [10, "Message Must Contain At least 10 Characters!"]
        },
    }
);

export const Message=mongoose.model("Message", msgSchema);