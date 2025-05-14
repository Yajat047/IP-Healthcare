import { asyncHandler } from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js";
import ErrorHandler from "../middlewares/error.middlewares.js";
import { generateToken } from "../utils/jwtToken.js";
import { resModel } from "../utils/response.js";
import validator from "validator";
import path from "path";
import fs from "fs";

const validateStringField = (field, value) => {
  if (!value || (typeof value === "string" && value.trim() === "")) {
    throw new ErrorHandler(`${field} is required`, 400);
  }
};

const validateEmailField = (email) => {
  if (!validator.isEmail(email)) {
    throw new ErrorHandler("Invalid email format", 400);
  }
};

const validateDateField = (dob) => {
  if (!dob) {
    throw new ErrorHandler("Date of Birth is required", 400);
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dob)) {
    throw new ErrorHandler("Date must be in YYYY-MM-DD format", 400);
  }

  const date = new Date(dob);
  if (isNaN(date.getTime())) {
    throw new ErrorHandler("Invalid date", 400);
  }

  if (date > new Date()) {
    throw new ErrorHandler("Date of birth cannot be in the future", 400);
  }
};

const validateFields = (fields) => {
  for (const [key, value] of Object.entries(fields)) {
    if (key === 'nic') continue; // Skip NIC validation as it's optional
    if (!value && key !== 'nic') {
      throw new ErrorHandler(`${key} is required`, 400);
    }

    switch (key) {
      case "email":
        validateEmailField(value);
        break;
      case "dob":
        validateDateField(value);
        break;
      case "phone":
        if (!/^\d{10}$/.test(value)) {
          throw new ErrorHandler("Phone Number must contain exactly 10 digits", 400);
        }
        break;
      default:
        if (key !== 'nic') {
          validateStringField(key, value);
        }
        break;
    }
  }
};


/*:::::::::::::::::::::::::::::::::::::::::::::::PATIENT-REGISTRATION:::::::::::::::::::::::::::::::::::::::::::::::::::::::*/

export const registerPatient = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, email, phone, nic, dob, gender, password } =
    req.body;
  
    validateFields({
      firstName,
      lastName,
      email,
      phone,
      nic,
      dob,
      gender,
      password,
    });

  const isRegistered = await User.findOne({ $or: [{ email: email }, {phone: phone}] });
  if (isRegistered) {
    return next(new ErrorHandler("User already Registered!", 400));
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    password,
    role: "Patient",
  });

  const payload=await User.findById(user._id).select("-password -refreshToken")
  generateToken(payload, "User Registered!", 201, res);
});

/*:::::::::::::::::::::::::::::::::::::::::::::::ADMIN-REGISTRATION:::::::::::::::::::::::::::::::::::::::::::::::::::::::*/

export const registerAdmin=asyncHandler(async (req,res,next)=>{
  const { firstName, lastName, email, phone, nic, dob, gender, password } = req.body;
  
    validateFields({
      firstName,
      lastName,
      email,
      phone,
      nic,
      dob,
      gender,
      password,
    });

  const isRegistered = await User.findOne({ $or: [{ email: email }, { phone: phone }] });
  if (isRegistered) {
    return next(new ErrorHandler("Admin already Registered!", 400));
  }

  const admin = await User.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    password,
    role: "Admin",
  });

  const payload=await User.findById(admin._id).select("-password -refreshToken")
  generateToken(payload, "Admin Registered!", 201, res);
})

/*:::::::::::::::::::::::::::::::::::::::::::::::DOCTOR-REGISTRATION:::::::::::::::::::::::::::::::::::::::::::::::::::::::*/

export const registerDoctor = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new ErrorHandler("Doctor Avatar Required!", 400));
  }

  const { firstName, lastName, email, phone, nic, dob, gender, doctorDepartment, password } =
    req.body;

  validateFields({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    doctorDepartment,
    password,
  });

  const isRegistered = await User.findOne({ $or: [{ email: email }, { phone: phone }] });
  if (isRegistered) {
    return next(new ErrorHandler("Doctor already Registered!", 400));
  }

  const doc = await User.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    password,
    doctorDepartment,
    role: "Doctor",
    avatar: {
      url: `/uploads/${req.file.filename}`,
    },
  });

  const payload = await User.findById(doc._id).select(
    "-password -refreshToken"
  );
  generateToken(payload, "Doctor Registered!", 201, res);
});

/*::::::::::::::::::::::::::::::::::::::::::::::: GET USER-DATA :::::::::::::::::::::::::::::::::::::::::::::::::::::::*/

export const getAllDoctors = asyncHandler(async (req, res, next) => {
  const doctors = await User.find({ role: "Doctor" });
  res.status(200).json({
    success: true,
    doctors,
  });
});

export const getUserDetails = asyncHandler(async (req, res, next) => {
  const user = await User.find({ role: "Patient" })
  res.status(200).json({
    success: true,
    user,
  });
});

/*::::::::::::::::::::::::::::::::::::::::::::::: USER-LOGIN :::::::::::::::::::::::::::::::::::::::::::::::::::::::*/

export const userLogin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please enter email and password", 400));
  }

  // Find user without checking role first
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  // Remove sensitive data before sending response
  user.password = undefined;
  user.refreshToken = undefined;

  // Use the generateToken utility to handle token generation and cookie setting
  generateToken(user, "Login successful", 200, res);
});

/*::::::::::::::::::::::::::::::::::::::::::::::: USER-LOGOUT :::::::::::::::::::::::::::::::::::::::::::::::::::::::*/

// Logout function for dashboard admin
export const logoutAdmin = asyncHandler(async (req, res, next) => {
  res
    .status(200)
    .cookie("adminToken", "", {
      httpOnly: true,
      expiresIn: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Admin Logged Out Successfully.",
    });
});

// Logout function for frontend patient
export const logoutPatient = asyncHandler(async (req, res, next) => {
  res
    .status(200)
    .cookie("patientToken", "", {
      httpOnly: true,
      expiresIn: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Patient Logged Out Successfully.",
    });
});

// Logout function for frontend patient
export const logoutDoctor = asyncHandler(async (req, res, next) => {
  res
    .status(200)
    .cookie("doctorToken", "", {
      httpOnly: true,
      expiresIn: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Doctor Logged Out Successfully.",
    });
});


/*::::::::::::::::::::::::::::::::::::::::::::::: ADMIN-CONTROLS :::::::::::::::::::::::::::::::::::::::::::::::::::::::*/

export const getAllAdmins=asyncHandler(async (req, res)=>{
  try {
    const admins = await User.find({role: "Admin"});
    res.status(200).json(resModel(true, "Admins retrieved successfully.", admins));
  } catch (error) {
    res.status(404).json(resModel(false, "Failed to fetch admins.", null));
  }
})

export const getAdminById=asyncHandler(async (req, res)=>{
  try {
    const admin = await User.findOne({ role: "Admin", _id: req.params.id });
    if (!admin) {
      return res.status(404).json(resModel(false, "Admin with this id doesn't exist", null));
    }
    res.status(200).json(resModel(true, "Admin retrieved successfully.", admin));
  } catch (error) {
    res.status(400).json(resModel(true, "Failed to fetch admin.", null));
  }
})

// async function createAdmin(req, res) {
//   try {
//     // Hash the password
//     const hashedPassword = await bcrypt.hash(req.body.passWord, 10);

//     const lastAdmin = await Admin.findOne().sort({ adminId: -1 });
//     const lastAdminId = lastAdmin ? lastAdmin.adminId : 0;

//     const admin = new Admin({
//       ...req.body,
//       passWord: hashedPassword,
//       adminId: lastAdminId + 1,
//     });
//     await admin.save();
//     res.json(resModel("SUCCESS", "Admin created successfully.", admin));
//   } catch (error) {
//     res.json(resModel("ERROR", "Failed to create admin.", error));
//   }
// }

export const updateAdmin=asyncHandler(async (req, res)=>{
  try {
    // Hash the password if it's included in the request body
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    const updatedAdmin = await User.findOneAndUpdate(
      { _id: req.params.id, role: "Admin" },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedAdmin) {
      return res.status(404).json(resModel(false, "Admin not found.", null));
    }
    res.status(200).json(resModel(true, "Admin updated successfully.", updatedAdmin));
  } catch (error) {
    res.status(400).json(resModel(false, "Failed to update admin.", error));
  }
})

export const deleteAdmin=asyncHandler(async (req, res)=>{
  try {
    const deletedAdmin = await User.findOneAndDelete({
      _id: req.params.id,
      role: "Admin"
    });
    if (!deletedAdmin) {
      return res.status(404).json(resModel(false, "Admin not found.", null));
    }
    res.status(200).json(resModel(true, "Admin deleted successfully.", deletedAdmin));
  } catch (error) {
    res.status(400).json(resModel(false, "Failed to delete admin.", error));
  }
})

export const updateDoctor = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const {
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    doctorDepartment,
  } = req.body;

  const doctor = await User.findById(id);

  if (!doctor) {
    return next(new ErrorHandler("Doctor not found", 404));
  }

  if (req.file) {
    // Delete old avatar file if exists
    if (doctor.avatar && doctor.avatar.url) {
      const oldFilePath = path.join(process.cwd(), 'public', doctor.avatar.url);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    doctor.avatar = {
      url: `/uploads/${req.file.filename}`,
    };
  }

  doctor.firstName = firstName || doctor.firstName;
  doctor.lastName = lastName || doctor.lastName;
  doctor.email = email || doctor.email;
  doctor.phone = phone || doctor.phone;
  doctor.nic = nic || doctor.nic;
  doctor.dob = dob || doctor.dob;
  doctor.gender = gender || doctor.gender;
  doctor.doctorDepartment = doctorDepartment || doctor.doctorDepartment;

  await doctor.save();

  res.status(200).json(resModel(true, "Doctor updated successfully", doctor));
});

export const deleteDoctor = asyncHandler(async (req, res) => {
  try {
    const deletedDoctor = await User.findOneAndDelete({
      _id: req.params.id,
      role: "Doctor",
    });
    if (!deletedDoctor) {
      return res.status(404).json(resModel(false, "Doctor not found.", null));
    }
    res
      .status(200)
      .json(resModel(true, "Doctor deleted successfully.", deletedDoctor));
  } catch (error) {
    res.status(400).json(resModel(false, "Failed to delete Doctor", error));
  }
});