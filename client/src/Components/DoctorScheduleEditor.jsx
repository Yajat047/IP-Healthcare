import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const DoctorScheduleEditor = ({ doctor, onUpdate }) => {
  const [startTime, setStartTime] = useState(doctor.startTime || "09:00");
  const [endTime, setEndTime] = useState(doctor.endTime || "17:00");
  const [workingDays, setWorkingDays] = useState(doctor.workingDays || {
    Monday: true,
    Tuesday: true,
    Wednesday: true,
    Thursday: true,
    Friday: true,
    Saturday: false,
    Sunday: false
  });

  const handleWorkingDayChange = (day) => {
    setWorkingDays(prev => ({
      ...prev,
      [day]: !prev[day]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Time validation
    if (new Date(`2000-01-01T${startTime}`) >= new Date(`2000-01-01T${endTime}`)) {
      toast.error("End time must be after start time");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:8000/api/v1/users/doctors/${doctor._id}/schedule`,
        {
          startTime,
          endTime,
          workingDays
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      toast.success("Schedule updated successfully");
      if (onUpdate) {
        onUpdate(response.data.doctor);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update schedule");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Edit Schedule</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">Start Time</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-2">End Time</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>

        <div>
          <label className="block mb-2">Working Days</label>
          <div className="grid grid-cols-7 gap-2">
            {Object.keys(workingDays).map((day) => (
              <div key={day} className="flex items-center">
                <input
                  type="checkbox"
                  id={day}
                  checked={workingDays[day]}
                  onChange={() => handleWorkingDayChange(day)}
                  className="mr-2"
                />
                <label htmlFor={day}>{day.slice(0, 3)}</label>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          Update Schedule
        </button>
      </form>
    </div>
  );
};

export default DoctorScheduleEditor; 