import express from 'express';
import { createPrescription, getPrescriptionByAppointment, getPatientPrescriptions, getDoctorPrescriptions, updatePrescription, deletePrescription } from '../controllers/prescription.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Create prescription (doctor only)
router.post('/', verifyToken, createPrescription);

// Update prescription (doctor only)
router.put('/appointment/:appointmentId', verifyToken, updatePrescription);

// Delete prescription (doctor only)
router.delete('/appointment/:appointmentId', verifyToken, deletePrescription);

// Get prescription by appointment ID
router.get('/appointment/:appointmentId', verifyToken, getPrescriptionByAppointment);

// Get all prescriptions for a patient
router.get('/patient/:patientId', verifyToken, getPatientPrescriptions);

// Get all prescriptions by a doctor
router.get('/doctor/:doctorId', verifyToken, getDoctorPrescriptions);

export default router; 