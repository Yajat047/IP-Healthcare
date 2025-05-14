import { asyncHandler } from "../utils/asyncHandler.js";
import ErrorHandler from "../middlewares/error.middlewares.js";
import { Appointment } from "../models/appoinment.model.js";
import { User } from "../models/user.model.js";

const postAppointment = asyncHandler(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    dob,
    gender,
    appointment_date,
    department,
    doctor_firstName,
    doctor_lastName,
    hasVisited,
    address,
  } = req.body;

  // Validate required fields
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !dob ||
    !gender ||
    !appointment_date ||
    !department ||
    !doctor_firstName ||
    !doctor_lastName ||
    !address
  ) {
    return next(new ErrorHandler("Please fill all required fields", 400));
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return next(new ErrorHandler("Please enter a valid email address", 400));
  }

  // Validate phone number
  if (!/^\d{10}$/.test(phone)) {
    return next(new ErrorHandler("Phone number must be exactly 10 digits", 400));
  }

  // Validate dates
  const dobDate = new Date(dob);
  const appointmentDateTime = new Date(appointment_date);
  const currentDate = new Date();

  if (dobDate >= currentDate) {
    return next(new ErrorHandler("Date of birth must be in the past", 400));
  }

  if (appointmentDateTime <= currentDate) {
    return next(new ErrorHandler("Appointment date must be in the future", 400));
  }

  // Find the doctor
  const isConflict = await User.find({
    firstName: doctor_firstName,
    lastName: doctor_lastName,
    role: "Doctor",
    doctorDepartment: department,
  });

  if (isConflict.length === 0) {
    return next(new ErrorHandler("Doctor not found", 404));
  }

  if (isConflict.length > 1) {
    return next(
      new ErrorHandler(
        "Doctors Conflict! Please Contact Through Email Or Phone!",
        400
      )
    );
  }

  const doctorId = isConflict[0]._id;
  const patientId = req.user._id;

  const appointment = await Appointment.create({
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: email.trim().toLowerCase(),
    phone,
    dob,
    gender,
    appointment_date,
    department,
    doctor: {
      firstName: doctor_firstName,
      lastName: doctor_lastName,
    },
    hasVisited,
    address: address.trim(),
    doctorId,
    patientId,
  });

  res.status(200).json({
    success: true,
    message: "Appointment booked successfully!",
    appointment,
  });
});

const getAllAppointments = asyncHandler(async (req, res, next) => {
  const appointments = await Appointment.find();
  res.status(200).json({
    success: true,
    appointments,
  });
});

const updateAppointmentStatus = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  let appointment = await Appointment.findById(id);
  if (!appointment) {
    return next(new ErrorHandler("Appointment not found!", 404));
  }
  appointment = await Appointment.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    message: "Appointment Status Updated!",
  });
});

const deleteAppointment = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const appointment = await Appointment.findById(id);
  if (!appointment) {
    return next(new ErrorHandler("Appointment Not Found!", 404));
  }
  await appointment.deleteOne();
  res.status(200).json({
    success: true,
    message: "Appointment Deleted!",
  });
});

export {
  postAppointment,
  getAllAppointments,
  updateAppointmentStatus,
  deleteAppointment,
};
