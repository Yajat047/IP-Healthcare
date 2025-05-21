import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";
import validator from "validator";

//zod schema for user validation
const userZodSchema = z.object({
  firstName: z
    .string()
    .min(3, "First Name must contain at least 3 characters!"),

  lastName: z.string().min(3, "Last Name must contain at least 3 characters!"),

  email: z.string().email("Please provide a valid email address!"),
  
  phone: z.string().length(10, "Phone Number must contain exactly 10 digits!"),
  
  nic: z.string().length(12, "Aadhar Number must contain exactly 12 digits!").optional().nullable(),
  
  dob: z.string().refine((date) => {
    if (!date) return false;
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) return false;
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime()) && parsedDate < new Date();
  }, "Please provide a valid date in YYYY-MM-DD format and it must be in the past"),
  
  gender: z.enum(
    ["Male", "Female", "Other"],
    "Gender must be either 'Male', 'Female' or 'Other'"
  ),
  
  password: z.string().min(8, "Password must contain at least 8 characters!"),
  
  role: z.enum(
    ["Admin", "Patient", "Doctor"],
    "Role must be 'Admin', 'Patient', or 'Doctor'"
  ),
  
  doctorDepartment: z.string().optional(),
  
  avatar: z
    .object({
      url: z.string(),
    })
    .optional(),
});

// Function to validate each field using zod
const validateField = (field, value) => {
  const result = userZodSchema.shape[field].safeParse(value);
  return result.success;
};

// User Schema definition
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First Name is required!"],
    minLength: [3, "First Name must contain at least 3 characters!"],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, "Last Name is required!"],
    minLength: [3, "Last Name must contain at least 3 characters!"],
    trim: true
  },
  email: {
    type: String,
    required: [true, "Email is required!"],
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: "Please provide a valid email address!"
    }
  },
  phone: {
    type: String,
    required: [true, "Phone Number is required!"],
    unique: true,
    validate: {
      validator: (value) => /^\d{10}$/.test(value),
      message: "Phone Number must contain exactly 10 digits!"
    }
  },
  nic: {
    type: String,
    required: false,
    validate: {
      validator: function(value) {
        if (!value) return true; // Allow empty/null values
        return /^\d{12}$/.test(value);
      },
      message: "Aadhar Number must contain exactly 12 digits!"
    }
  },
  dob: {
    type: String,
    required: [true, "Date of Birth is required!"],
    validate: {
      validator: function(value) {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(value)) return false;
        const date = new Date(value);
        return !isNaN(date.getTime()) && date < new Date();
      },
      message: "Please provide a valid date in YYYY-MM-DD format and it must be in the past"
    }
  },
  gender: {
    type: String,
    required: [true, "Gender is required!"],
    enum: ["Male", "Female", "Other"],
    trim: true
  },
  password: {
    type: String,
    required: [true, "Password is required!"],
    minLength: [8, "Password must contain at least 8 characters!"],
    select: false
  },
  refreshToken: {
    type: String
  },
  role: {
    type: String,
    required: true,
    enum: ["Admin", "Patient", "Doctor"],
    trim: true
  },
  doctorDepartment: {
    type: String,
    trim: true,
    required: function() {
      return this.role === "Doctor";
    }
  },
  avatar: {
    type: {
      url: String
    },
    required: function() {
      return this.role === "Doctor";
    }
  },
  // Add doctor working hours fields
  startTime: {
    type: String,
    required: function() { return this.role === "Doctor"; },
    default: "09:00"
  },
  endTime: {
    type: String,
    required: function() { return this.role === "Doctor"; },
    default: "17:00"
  },
  workingDays: {
    type: Object,
    required: function() { return this.role === "Doctor"; },
    default: {
      Monday: true,
      Tuesday: true,
      Wednesday: true,
      Thursday: true,
      Friday: true,
      Saturday: false,
      Sunday: false
    }
  }
});

// Middleware to hash the password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare entered password with hashed password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to generate JWT
userSchema.methods.generateJWT = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

export const User = mongoose.model("User", userSchema);
