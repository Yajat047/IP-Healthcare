import express from "express"
import {postAppointment,getAllAppointments,updateAppointmentStatus,deleteAppointment,getBookedSlots} from "../controllers/appoinment.controllers.js";
import {isAdminAuthenticated, isPatientAuthenticated, isDoctorAuthenticated} from "../middlewares/auth.middleware.js";

const router=express.Router();

router.post("/post", isPatientAuthenticated ,postAppointment);
router.get("/getall", isAdminAuthenticated, getAllAppointments);
router.put("/update/:id", isAdminAuthenticated, updateAppointmentStatus);
router.delete("/delete/:id", isAdminAuthenticated, deleteAppointment);
router.get("/booked-slots/:doctorId/:date", getBookedSlots);

export default router;