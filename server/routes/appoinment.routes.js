import express from "express"
import {postAppointment,getAllAppointments,updateAppointmentStatus,deleteAppointment} from "../controllers/appoinment.controllers.js";
import {isAdminAuthenticated, isPatientAuthenticated, isDoctorAuthenticated} from "../middlewares/auth.middleware.js";

const router=express.Router();

router.post("/post", isPatientAuthenticated ,postAppointment);
router.get("/getall", getAllAppointments);
router.put("/update/:id", updateAppointmentStatus);
router.delete("/delete/:id", isDoctorAuthenticated, deleteAppointment);

export default router;