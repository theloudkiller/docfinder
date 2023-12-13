import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useParams } from "react-router-dom";
import axios from "axios";
import { DatePicker, message, TimePicker,Table } from "antd";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import AppointmentSearch from "./AppointmentSearch";

const BookingPage = () => {
  const { user } = useSelector((state) => state.user);
  const params = useParams();
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointment] = useState([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState();
  const [isAvailable, setIsAvailable] = useState(false);
  const dispatch = useDispatch();

  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [bookingDate, setBookingDate] = useState("");
  const [timings, setTimings] = useState([]);
  const [doctorId, setDoctorId] = useState('');

  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  

  // login user data
  const getUserDatass = async () => {
    try {
      const res = await axios.post(
        "/api/v1/doctor/getDoctorById",
        { doctorId: params.doctorId },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (res.data.success) {
        const fetchedDoctorId = res.data.data._id.$oid; // Assuming _id is a nested property
        setDoctors(res.data.data);
        setDoctorId(fetchedDoctorId);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getUserData = async () => {
    try {
      const res = await axios.post(
        "/api/v1/doctor/getDoctorById",
        { doctorId: params.doctorId },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (res.data.success) {
        const fetchedDoctorId = res.data.data._id; // Assuming _id is a nested property
        console.log("Fetched Doctor ID:", fetchedDoctorId);
        setDoctors(res.data.data);
        setDoctorId(fetchedDoctorId);
      }
    } catch (error) {
      console.error("Error fetching doctor data:", error);
    }
  };

  

  const getAppointments = async () => {
    try {
      const res = await axios.get("/api/v1/user/user-appointmentsss", 
     
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setAppointment(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  // =============== booking func
  const handleBookingss = async () => {
    try {
      if (!date || !selectedTimeSlot) {
        return message.error("Date and Time Slot are required");
      }
      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/user/book-appointment",
        {
          doctorId: params.doctorId,
          userId: user._id,
          doctorInfo: doctors,
          userInfo: user,
          date,
          timings: selectedTimeSlot,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        message.success(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
    }
  };

  const handleDateChange = async (dateString) => {
    console.log("Selected Date:", dateString);
    setBookingDate(dateString); // Update the bookingDate state with the selected date
    setSelectedTimeSlot(null);
  
    // Fetch available time slots for the selected date
    await fetchAvailableTimeSlots(dateString);
  };

  const fetchAvailableTimeSlots = async (selectedDate) => {
    // Implement the logic to fetch time slots for the given date
    // For example, you might need to make an API call here
    try {
      const response = await axios.get(`/api/v1/doctor/available-time-slots?doctorId=${doctorId}&date=${selectedDate}`);
      if (response.data.success) {
        setAvailableTimeSlots(response.data.timeSlots);
      } else {
        setAvailableTimeSlots([]); // Reset if no time slots are available for the selected date
      }
    } catch (error) {
      console.error("Error fetching available time slots:", error);
      setAvailableTimeSlots([]);
    }
  };
  

  const handleBooking = async () => {
    try {
      if (!selectedTimeSlot || !bookingDate) {
        return message.error(" Time Slot, and Booking Date are required");
      }
      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/user/book-appointment",
        {
          doctorId: params.doctorId,
          userId: user._id,
          doctorInfo: doctors,
          userInfo: user,
          bookingDate,  // Include the new parameter
          timings: selectedTimeSlot,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        message.success(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
    }
  };

  const updateAvailableTimeSlots = (bookedTimeSlots) => {
    // Filter out the booked time slots
    const filteredTimeSlots = availableTimeSlots.filter(
      (slot) => !bookedTimeSlots.includes(slot.startTime)
    );

    // Update the state with the filtered time slots
    setAvailableTimeSlots(filteredTimeSlots);
  };

  const columns = [
    {
      title: "Date & Time",
      dataIndex: "bookingDate",
      render: (text, record) => (
        <span>
          {moment(record.date).format("DD-MM-YYYY")}
        </span>
      ),
    },
    {
      title: "Time",
      dataIndex: "timings",
      render: (timings) => (
        <span>
          {timings
            ? `${moment(timings.startTime, "HH:mm").format("HH:mm")} - ${moment(
                timings.endTime,
                "HH:mm"
              ).format("HH:mm")}`
            : "-"}
        </span>
      ),
    },
  
  ];


  useEffect(() => {
    getUserData();  
    //eslint-disable-next-line
  }, []);


  //testing 

  useEffect(() => {
    const fetchTimeSlots = async () => {
      // Fetch available time slots from the doctor's data
      try {
        const res = await axios.post(
          "/api/v1/doctor/getDoctorById",
          { doctorId: params.doctorId },
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
        if (res.data.success) {
          const fetchedTimeSlots = res.data.data.timeSlots || [];
          setAvailableTimeSlots(fetchedTimeSlots);
        }
      } catch (error) {
        console.error("Error fetching doctor data:", error);
      }
    };

    fetchTimeSlots();
  }, [params.doctorId]);


  useEffect(() => {
    console.log("Doctor ID:", doctorId);
  }, [doctorId]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await getAppointments(params.doctorId,params.timings);
        
        if (res.data.success) {
          setAppointment(res.data.data);
          const timings = res.data.data.map(appointment => appointment.timings);
          setTimings(timings);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchAppointments();
  }, [params.doctorId,params.timings]);

  const filteredTimeSlots = availableTimeSlots.filter(
    (slot) => !timings.includes(slot.startTime)
  );


   useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await getAppointments(params.doctorId, params.timings);

        if (res.data.success) {
          setAppointment(res.data.data);
          const bookedTimeSlots = res.data.data.map((appointment) => appointment.timings.startTime);
          setTimings(bookedTimeSlots);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchAppointments();
  }, [params.doctorId, params.timings]);
  

  return (
    <Layout>
      <h3>Booking Page</h3>
      <div className="container m-2">
        {doctors && (
          <div>
            <h4>
              Dr.{doctors.firstName} {doctors.lastName}
            </h4>
            <h4>Fees : {doctors.feesPerCunsaltation}</h4>

            <div>
      {/* Your other components */}
      {doctorId && (
                <AppointmentSearch
                  doctorId={doctorId}
                  updateAvailableTimeSlots={updateAvailableTimeSlots}
                />
              )}
    </div>
            
            {doctors.timeSlots ? (
              <div>
                <h4>Available Time Slots:</h4>
                <ul>
                  {availableTimeSlots.map((timeSlot, index) => (
                    <li
                      key={index}
                      style={{
                        cursor: "pointer",
                        textDecoration:
                          selectedTimeSlot === timeSlot ? "underline" : "none",
                      }}
                      onClick={() => setSelectedTimeSlot(timeSlot)}
                    >
                      {timeSlot.startTime} - {timeSlot.endTime}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p>No time slots available</p>
            )}
           
            <div className="d-flex flex-column w-50">

<DatePicker
  aria-required={"true"}
  className="m-2"
  format="DD-MM-YYYY"
  value={bookingDate ? moment(bookingDate, "DD-MM-YYYY") : null}
  onChange={(dateString) => {
    console.log("Selected Date:", dateString);
    setBookingDate(dateString); // Update the bookingDate state with the selected date
    setSelectedTimeSlot(null);
  }}
/>
          

            <h1>Appoinmtnets Lists</h1>
      




              <button className="btn btn-dark mt-2" onClick={handleBooking}>
                Book Now
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BookingPage;