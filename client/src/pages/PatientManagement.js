
import axios from 'axios';
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import React, { useState, useEffect } from "react";

const PatientManagement = ({ clinicEmail }) => {
  const [patientData, setPatientData] = useState({ name: '', phoneNumber: '', address: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [doctorId, setDoctorId] = useState('');
  const params = useParams();
  const [doctors, setDoctors] = useState([]);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const addPatient = async () => {
    try {
      await axios.post('/api/v1/doctor/patients/add', { clinicEmail, patientData });
      alert('Patient added successfully!');
      setPatientData({ name: '', phoneNumber: '', address: '' }); // Reset form
    } catch (error) {
      alert('Failed to add patient');
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

  const searchPatients = async () => {
    try {
      const response = await axios.get('/api/v1/doctor/patients/search', {
        params: { clinicEmail, searchTerm },
      });
      setSearchResults(response.data.data);
    } catch (error) {
      alert('Failed to search patients');
    }
  };

  useEffect(() => {
    getUserData();  
    //eslint-disable-next-line
  }, []);


  return (
    <div>
      <h2>Patient Management</h2>
      <div>
      <h4>
              Dr.{doctors.firstName} {doctors.lastName}
            </h4>
            <h4>Fees : {doctors.clinicemail}</h4>
        <h3>Add Patient</h3>
        <input
          value={patientData.name}
          onChange={(e) => setPatientData({ ...patientData, name: e.target.value })}
          placeholder="Name"
        />
        <input
          value={patientData.phoneNumber}
          onChange={(e) => setPatientData({ ...patientData, phoneNumber: e.target.value })}
          placeholder="Phone Number"
        />
        <input
          value={patientData.address}
          onChange={(e) => setPatientData({ ...patientData, address: e.target.value })}
          placeholder="Address"
        />
        <button onClick={addPatient}>Add Patient</button>
      </div>
      <div>
        <h3>Search Patient</h3>
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by Name"
        />
        <button onClick={searchPatients}>Search</button>
        {searchResults.map((patient) => (
          <div key={patient._id}>
            <p>{patient.name}</p>
            <p>{patient.phoneNumber}</p>
            <p>{patient.address}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientManagement;
