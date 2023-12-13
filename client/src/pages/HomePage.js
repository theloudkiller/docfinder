import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "./../components/Layout";
import { Row ,Select} from "antd";
import DoctorList from "../components/DoctorList";
import ClinicList from "../components/ClinicList";



const { Option } = Select;

const HomePage = () => {
  const [doctors, setDoctors] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [districts, setDistricts] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedClinicEmail, setSelectedClinicEmail] = useState("");



  

  const fetchStates = async () => {
    try {
      const response = await axios.get("/api/v1/user/getStates", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      if (response.data.success) {
        setStates(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchStates();
  }, []);

  const getUserData = async () => {
    try {
      const res = await axios.get("/api/v1/user/getAllDoctors", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      if (res.data.success) {
        setDoctors(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getUserDatass = async () => {
    try {
      const res = await axios.get("/api/v1/user/getAllClinic", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      if (res.data.success) {
        setClinics(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleClinicSelect = (clinicEmail) => {
    setSelectedClinicEmail(clinicEmail);
  };

  const fetchDistricts = async (stateName) => {
    try {
      const response = await axios.get(`/api/v1/user/getDistricts/${stateName}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      if (response.data.success) {
        setDistricts(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };


  useEffect(() => {
    fetchStates();
    getUserData();
    getUserDatass();
  }, []);

  useEffect(() => {
    if (selectedDistrict) {
      // Fetch clinics based on the selected district
      const fetchClinics = async () => {
        try {
          const response = await axios.get(`/api/v1/user/getClinicsByDistrict/${selectedDistrict}`, {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          });
  
          if (response.data.success) {
            setClinics(response.data.data);
          }
        } catch (error) {
          console.error(error);
        }
      };
  
      fetchClinics();
    }
  }, [selectedDistrict]);

  const handleStateChange = (value) => {
    setSelectedState(value);
    fetchDistricts(value);
   
  };


 
  return (
    <Layout>
      <h1 className="text-center">Home Page</h1>
      <Select
        style={{ width: 200 }}
        placeholder="Select a state"
        onChange={handleStateChange}
      >
        {states.map((state) => (
          <Option key={state.statename} value={state.statename}>
            {state.statename}
          </Option>
        ))}
      </Select>
      {districts.length > 0 && (
        <Select
          style={{ width: 200, marginLeft: 16 }}
          placeholder="Select a district"
          onChange={(value) => setSelectedDistrict(value)}
        >
          {districts.map((district) => (
            <Option key={district} value={district}>
              {district}
            </Option>
          ))}
        </Select>
      )}
     <Row>
        {clinics &&
          clinics.map((clinic) => (
            <ClinicList
              key={clinic.id}
              clinic={clinic}
              onClinicSelect={handleClinicSelect}
            />
          ))}
      </Row>
      <Row>
        {doctors &&
          doctors
            .filter((doctor) => doctor.clinicemail === selectedClinicEmail)
            .map((doctor) => <DoctorList key={doctor.id} doctor={doctor} />)}
      </Row>
    </Layout>
  );
};

export default HomePage;