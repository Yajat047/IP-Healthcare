import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TimeSlotSelector = ({ doctor, selectedDate, onTimeSelect }) => {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);

  useEffect(() => {
    if (doctor && selectedDate) {
      generateTimeSlots();
      fetchBookedSlots();
    }
  }, [doctor, selectedDate]);

  const fetchBookedSlots = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/appoinments/booked-slots/${doctor._id}/${selectedDate}`,
        { withCredentials: true }
      );
      setBookedSlots(response.data.bookedSlots || []);
    } catch (error) {
      console.error("Failed to fetch booked slots:", error);
      setBookedSlots([]);
    }
  };

  const generateTimeSlots = () => {
    if (!doctor || !selectedDate) return;

    const slots = [];
    const defaultStartTime = "09:00";
    const defaultEndTime = "17:00";
    const defaultWorkingDays = {
      Monday: true,
      Tuesday: true,
      Wednesday: true,
      Thursday: true,
      Friday: true,
      Saturday: false,
      Sunday: false
    };

    const startTime = doctor.startTime || defaultStartTime;
    const endTime = doctor.endTime || defaultEndTime;
    const workingDays = doctor.workingDays || defaultWorkingDays;

    const dayOfWeek = new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long' });

    // Check if the selected day is a working day
    if (!workingDays[dayOfWeek]) {
      setAvailableSlots([]);
      return;
    }

    // Generate 15-minute slots
    let currentTime = new Date(`2000-01-01T${startTime}`);
    const endDateTime = new Date(`2000-01-01T${endTime}`);

    while (currentTime < endDateTime) {
      const timeString = currentTime.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
      slots.push(timeString);
      currentTime.setMinutes(currentTime.getMinutes() + 15);
    }

    setAvailableSlots(slots);
  };

  const handleSlotSelect = (slot) => {
    if (!isSlotBooked(slot)) {
      setSelectedSlot(slot);
      onTimeSelect(slot);
    }
  };

  const isSlotBooked = (slot) => {
    return bookedSlots.includes(slot);
  };

  if (!doctor || !selectedDate) {
    return null;
  }

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Available Time Slots</h3>
      {availableSlots.length === 0 ? (
        <p className="text-red-500">No available slots for this day</p>
      ) : (
        <div className="grid grid-cols-4 gap-2">
          {availableSlots.map((slot) => (
            <button
              key={slot}
              onClick={() => handleSlotSelect(slot)}
              disabled={isSlotBooked(slot)}
              className={`p-2 rounded ${
                selectedSlot === slot
                  ? 'bg-blue-500 text-white'
                  : isSlotBooked(slot)
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {slot}
              {isSlotBooked(slot) && <span className="text-xs block">Booked</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TimeSlotSelector; 