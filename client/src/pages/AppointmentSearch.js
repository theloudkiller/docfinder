import React, { useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const AppointmentSearch = ({ doctorId: initialDoctorId, updateAvailableTimeSlots }) => {
  const [doctorId, setDoctorId] = useState(initialDoctorId || '');
  const [bookingDate, setBookingDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);

  const handleSearch = async () => {
    try {
      const formattedDate = bookingDate.toISOString().split('T')[0];
      const response = await axios.get(`/api/v1/user/appointments?doctorId=${doctorId}&bookingDate=${formattedDate}`);
      setAppointments(response.data);

      // Pass the booked timings to the callback
      updateAvailableTimeSlots(response.data.map(appointment => appointment.timings.startTime));
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  return (
    <div>
      <div>
      <DatePicker selected={bookingDate} onChange={(date) => setBookingDate(date)} />
        <label>Select the date </label></div>
        <div>
        <input type="text" value={doctorId} onChange={(e) => setDoctorId(e.target.value)} />
      </div>
      <div>
        <label>Booking Date:</label>
        <DatePicker selected={bookingDate} onChange={(date) => setBookingDate(date)} />
      </div>
      <div>
        <button onClick={handleSearch}>Search</button>
      </div>
      <div>
        <h2>Appointments</h2>
        {appointments.map((appointment) => (
          <div key={appointment._id.$oid}>
            <p>Start Time: {appointment.timings.startTime}</p>
            <p>End Time: {appointment.timings.endTime}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppointmentSearch;