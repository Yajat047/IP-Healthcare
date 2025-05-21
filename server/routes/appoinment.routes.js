import express from "express"
import {postAppointment,getAllAppointments,updateAppointmentStatus,deleteAppointment,getBookedSlots,getMyAppointments,getDoctorWorkingHours} from "../controllers/appoinment.controllers.js";
import {isAdminAuthenticated, isPatientAuthenticated, isDoctorAuthenticated} from "../middlewares/auth.middleware.js";

const router=express.Router();

router.post("/post", isPatientAuthenticated ,postAppointment);
router.get("/getall", isAdminAuthenticated, getAllAppointments);
router.put("/update/:id", isDoctorAuthenticated, updateAppointmentStatus);
router.delete("/delete/:id", isAdminAuthenticated, deleteAppointment);
router.get("/booked-slots/:doctorId/:date", getBookedSlots);
router.get("/my", isPatientAuthenticated, getMyAppointments);
router.get("/doctor", isDoctorAuthenticated, async (req, res, next) => {
  try {
    const doctorId = req.user._id;
    const { Appointment } = await import("../models/appoinment.model.js");
    const appointments = await Appointment.find({ doctorId });
    res.status(200).json({ success: true, appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
router.get("/doctor-working-hours/:doctorId", getDoctorWorkingHours);

export default router;