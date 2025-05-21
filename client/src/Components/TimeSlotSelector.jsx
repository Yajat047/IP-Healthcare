import React, { useEffect } from 'react';
import axios from 'axios';

const TimeSlotSelector = ({ doctor, selectedDate, onTimeSelect, selectedSlot, bookedSlots, setBookedSlots, availableSlots, setAvailableSlots, workingHours }) => {
  // Fetch booked slots when doctor, selectedDate, or workingHours change
  useEffect(() => {
    const fetchBookedSlots = async () => {
      if (doctor && selectedDate && workingHours) {
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
      }
    };
    fetchBookedSlots();
    // eslint-disable-next-line
  }, [doctor, selectedDate, workingHours]);

  // Generate slots whenever bookedSlots, doctor, selectedDate, or workingHours change
  useEffect(() => {
    if (doctor && selectedDate && workingHours) {
      generateTimeSlots();
    }
    // eslint-disable-next-line
  }, [bookedSlots, doctor, selectedDate, workingHours]);

  const generateTimeSlots = () => {
    if (!doctor || !selectedDate) return;

    // Debug: Log workingHours to verify what is being received
    console.log('workingHours in TimeSlotSelector:', workingHours);

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

    // Prefer workingHours from backend, fallback to doctor object
    const startTimeStr = workingHours?.startTime || doctor.startTime || defaultStartTime;
    const endTimeStr = workingHours?.endTime || doctor.endTime || defaultEndTime;
    const workingDays = workingHours?.workingDays || doctor.workingDays || defaultWorkingDays;

    if (!workingHours?.startTime || !workingHours?.endTime) {
      console.warn('Using default start/end time because workingHours is missing or incomplete:', workingHours);
    }

    // Parse time string (handles 12-hour and 24-hour)
    function parseTimeString(timeStr) {
      if (!timeStr) return null;
      // Try 12-hour with AM/PM
      let date = new Date('2000-01-01 ' + timeStr);
      if (!isNaN(date.getTime())) return date;
      // Fallback: parse as 24-hour (e.g. '13:00')
      const [h, m] = timeStr.split(":");
      return new Date(2000, 0, 1, Number(h), Number(m));
    }

    const startTime = parseTimeString(startTimeStr) || new Date(2000, 0, 1, 9, 0);
    const endTime = parseTimeString(endTimeStr) || new Date(2000, 0, 1, 17, 0);

    const dayOfWeek = new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long' });

    // Check if the selected day is a working day
    if (!workingDays[dayOfWeek]) {
      setAvailableSlots([]);
      return;
    }

    // Generate 15-minute slots between startTime and endTime (end exclusive)
    let currentTime = new Date(startTime);
    while (currentTime < endTime) {
      const timeString = currentTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      slots.push(timeString);
      currentTime = new Date(currentTime.getTime() + 15 * 60000); // add 15 minutes
    }

    setAvailableSlots(slots);
  };

  const isSlotBooked = (slot) => {
    // Only check if the slot is in the bookedSlots array from the backend
    return bookedSlots.includes(slot);
  };

  const handleSelectSlot = (slot) => {
    // Only allow selection if the slot is not booked
    if (!isSlotBooked(slot)) {
      // Only update the selected slot in UI, do NOT trigger booking or close modal
      if (typeof onTimeSelect === 'function') {
        onTimeSelect(slot);
      }
    }
  };

  if (!doctor || !selectedDate) {
    return null;
  }

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Available Time Slots</h3>
      <p className="text-sm text-gray-600 mb-3">
        {/* <strong>IMPORTANT:</strong> Selecting a slot does NOT book it. You must click the "Confirm Appointment" button below to complete your booking. */}
      </p>
      {availableSlots.length === 0 ? (
        <p className="text-red-500">No available slots for this day</p>
      ) : (
        <div className="grid grid-cols-4 gap-2">
          {availableSlots.map((slot) => {
            const isBooked = isSlotBooked(slot);
            const isSelected = selectedSlot === slot;
            
            return (
              <div key={slot} className="border rounded p-2">
                <div className="font-medium">{slot}</div>
                
                {isBooked ? (
                  <div className="bg-red-100 text-red-800 text-xs py-1 px-2 rounded mt-1 text-center">
                    Booked
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSelectSlot(slot)}
                    className={`w-full mt-1 py-1 px-2 rounded text-xs ${
                      isSelected 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                    }`}
                  >
                    {isSelected ? 'Selected' : 'Select'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
      
      {selectedSlot && (
        <div className="mt-4 p-3 bg-blue-50 rounded border-2 border-blue-200">
          <p className="font-medium">You selected: {selectedSlot}</p>
          <p className="text-sm text-gray-600 font-bold">Your time slot has NOT been booked yet! You must click "Confirm Appointment" below to complete your booking.</p>
        </div>
      )}
    </div>
  );
};

export default TimeSlotSelector;