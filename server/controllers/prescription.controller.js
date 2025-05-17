import Prescription from '../models/prescription.model.js';
import { Appointment } from '../models/appoinment.model.js';

// Create a new prescription
export const createPrescription = async (req, res) => {
    try {
        const { appointmentId, medications, instructions, diagnosis } = req.body;
        
        // Get appointment details
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        const prescription = new Prescription({
            appointmentId,
            doctorId: appointment.doctorId,
            patientId: appointment.patientId,
            medications,
            instructions,
            diagnosis
        });

        await prescription.save();
        res.status(201).json(prescription);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update prescription
export const updatePrescription = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const { medications, instructions, diagnosis } = req.body;

        const prescription = await Prescription.findOne({ appointmentId });
        if (!prescription) {
            return res.status(404).json({ message: 'Prescription not found' });
        }

        // Update prescription fields
        prescription.medications = medications;
        prescription.instructions = instructions;
        prescription.diagnosis = diagnosis;

        await prescription.save();
        res.status(200).json(prescription);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete prescription
export const deletePrescription = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const prescription = await Prescription.findOne({ appointmentId });
        
        if (!prescription) {
            return res.status(404).json({ message: 'Prescription not found' });
        }

        await Prescription.deleteOne({ appointmentId });
        res.status(200).json({ message: 'Prescription deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get prescription by appointment ID
export const getPrescriptionByAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const prescription = await Prescription.findOne({ appointmentId })
            .populate('doctorId', 'name')
            .populate('patientId', 'name');
        
        if (!prescription) {
            return res.status(404).json({ message: 'Prescription not found' });
        }
        
        res.status(200).json(prescription);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all prescriptions for a patient
export const getPatientPrescriptions = async (req, res) => {
    try {
        const { patientId } = req.params;
        const prescriptions = await Prescription.find({ patientId })
            .populate('doctorId', 'name')
            .populate('appointmentId', 'date time')
            .sort({ createdAt: -1 });
        
        res.status(200).json(prescriptions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all prescriptions by a doctor
export const getDoctorPrescriptions = async (req, res) => {
    try {
        const { doctorId } = req.params;
        const prescriptions = await Prescription.find({ doctorId })
            .populate('patientId', 'name')
            .populate('appointmentId', 'date time')
            .sort({ createdAt: -1 });
        
        res.status(200).json(prescriptions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 