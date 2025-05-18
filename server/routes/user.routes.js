import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
  userLogin,
  registerPatient,
  registerAdmin,
  registerDoctor,
  getAllDoctors,
  getUserDetails,
  logoutAdmin,
  logoutPatient,
  logoutDoctor,
  getAllAdmins,
  getAdminById,
  deleteAdmin,
  updateAdmin,
  updateDoctor,
  deleteDoctor,
  getDoctorByName
} from "../controllers/user.controllers.js";
import {
  isAdminAuthenticated,
  isPatientAuthenticated,
  isDoctorAuthenticated,
} from "../middlewares/auth.middleware.js";

const router = Router();

/*_____________________________________LOGIN ROUTE______________________________________*/
router.route("/login").post(userLogin);

/*______________________________PATIENT ROUTES_________________________________________*/
router
  .route("/patient/register")
  .post(upload.fields([{ name: "avatar", maxCount: 1 }]), registerPatient);
router.get("/patient/profile", isPatientAuthenticated, getUserDetails);
router.get("/patient/logout", logoutPatient);

/*______________________________ADMIN ROUTES___________________________________________*/
router.post("/admin/register",isAdminAuthenticated, registerAdmin);
router.get("/admin/profile",isAdminAuthenticated, getUserDetails);
router.get("/admin/logout", logoutAdmin);

// Get all admins
router.get("/admin/",isAdminAuthenticated, getAllAdmins);
// Get admin by ID
router.get("/admin/:id",isAdminAuthenticated, getAdminById);
// Create admin
router.post("/admin/add",isAdminAuthenticated, registerAdmin);
// Update admin
router.put("/admin/:id", isAdminAuthenticated, updateAdmin);
// Delete admin
router.delete("/admin/:id", isAdminAuthenticated, deleteAdmin);

/*______________________________DOCTOR ROUTES___________________________________________*/
router.get("/doctors", getAllDoctors);
router.get("/doctors/:firstName/:lastName", getDoctorByName);
router
  .route("/doctor/register")
  .post(upload.single("avatar"), registerDoctor);
router.get("/doctor/profile", isDoctorAuthenticated || isAdminAuthenticated, getUserDetails);
router.get("/doctor/logout", logoutDoctor);

// Update doctor
router
  .route("/doctor/:id")
  .put(upload.single("avatar"), updateDoctor);
//Delete doctor
router.delete("/doctor/:id", isAdminAuthenticated, deleteDoctor);

export default router;
