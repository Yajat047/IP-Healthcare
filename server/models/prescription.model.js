import mongoose from 'mongoose';

const prescriptionSchema = new mongoose.Schema({
    appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
        required: true
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    medications: [{
        name: {
            type: String,
            required: true
        },
        dosage: {
            type: String,
            required: true
        },
        frequency: {
            type: String,
            required: true
        },
        duration: {
            type: String,
            required: true
        }
    }],
    instructions: {
        type: String,
        required: true
    },
    diagnosis: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Prescription = mongoose.model('Prescription', prescriptionSchema);

export default Prescription; 