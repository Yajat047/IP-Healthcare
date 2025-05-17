import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FileText } from 'lucide-react';

const PrescriptionView = ({ appointmentId }) => {
  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrescription = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8000/api/v1/prescriptions/appointment/${appointmentId}`,
          { withCredentials: true }
        );
        setPrescription(data);
        setLoading(false);
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to fetch prescription');
        setLoading(false);
      }
    };

    if (appointmentId) {
      fetchPrescription();
    }
  }, [appointmentId]);

  if (loading) {
    return <div>Loading prescription...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!prescription) {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mt-4">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="text-blue-500" size={24} />
        <h2 className="text-xl font-semibold">Prescription</h2>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-gray-700">Diagnosis</h3>
          <p className="text-gray-600">{prescription.diagnosis}</p>
        </div>

        <div>
          <h3 className="font-semibold text-gray-700 mb-2">Medications</h3>
          <div className="space-y-3">
            {prescription.medications.map((med, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium">Name:</span> {med.name}
                  </div>
                  <div>
                    <span className="font-medium">Dosage:</span> {med.dosage}
                  </div>
                  <div>
                    <span className="font-medium">Frequency:</span> {med.frequency}
                  </div>
                  <div>
                    <span className="font-medium">Duration:</span> {med.duration}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-gray-700">Instructions</h3>
          <p className="text-gray-600">{prescription.instructions}</p>
        </div>

        <div className="text-sm text-gray-500 mt-4">
          Prescribed on: {new Date(prescription.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default PrescriptionView; 