import mongoose from "mongoose";
import validator from "validator";

const appointmentSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First Name Is Required!"],
    minLength: [3, "First Name Must Contain At Least 3 Characters!"],
  },
  lastName: {
    type: String,
    required: [true, "Last Name Is Required!"],
    minLength: [3, "Last Name Must Contain At Least 3 Characters!"],
  },
  email: {
    type: String,
    required: [true, "Email Is Required!"],
    validate: [validator.isEmail, "Provide A Valid Email!"],
  },
  phone: {
    type: String,
    required: [true, "Phone Is Required!"],
    minLength: [10, "Phone Number Must Contain Exact 10 Digits!"],
    maxLength: [10, "Phone Number Must Contain Exact 10 Digits!"],
  },
  nic: {
    type: String,
    required: false,
    validate: {
      validator: function(v) {
        return !v || (v.length === 12 && /^\d+$/.test(v));
      },
      message: "Aadhar number must be exactly 12 digits"
    }
  },
  dob: {
    type: Date,
    required: [true, "Date of Birth Is Required!"],
    validate: {
      validator: function(v) {
        return v && v <= new Date();
      },
      message: "Date of birth must be in the past"
    }
  },
  gender: {
    type: String,
    required: [true, "Gender Is Required!"],
    enum: ["Male", "Female", "Other"],
  },
  appointment_date: {
    type: Date,
    required: [true, "Appointment Date Is Required!"],
    validate: {
      validator: function(v) {
        return v && v >= new Date();
      },
      message: "Appointment date must be in the future"
    }
  },
  appointment_time: {
    type: String,
    required: [true, "Appointment Time Is Required!"],
  },
  department: {
    type: String,
    required: [true, "Department Name Is Required!"],
  },
  doctor: {
    firstName: {
      type: String,
      required: [true, "Doctor Name Is Required!"],
    },
    lastName: {
      type: String,
      required: [true, "Doctor Name Is Required!"],
    },
  },
  hasVisited: {
    type: Boolean,
    default: false,
  },
  address: {
    type: String,
    required: [true, "Address Is Required!"],
  },
  doctorId: {
    type: mongoose.Schema.ObjectId,
    required: [true, "Doctor Id Is Invalid!"],
  },
  patientId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Patient Id Is Required!"],
  },
  status: {
    type: String,
    enum: ["Pending", "Accepted", "Rejected"],
    default: "Pending",
  },
});

// Add compound index for doctor, date, and time to prevent double bookings
appointmentSchema.index({ doctorId: 1, appointment_date: 1, appointment_time: 1 }, { unique: true });

export const Appointment = mongoose.model("Appointment", appointmentSchema);
