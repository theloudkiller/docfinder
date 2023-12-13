import React, { useEffect, useState } from "react";
import Layout from "./../../components/Layout";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Col, Form, Input, Row, TimePicker, message } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../../redux/features/alertSlice";
import moment from "moment";
import { InputNumber,Button,List,Card } from "antd";



const Profile = () => {
  const { user } = useSelector((state) => state.user);
  const [doctor, setDoctor] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const [displayedSlots, setDisplayedSlots] = useState(null);
  const [form] = Form.useForm();

  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("11:00");
  const [interval, setInterval] = useState(30);
  const [previewSlots, setPreviewSlots] = useState([]);

  useEffect(() => {
    if (form) {
      setStartTime(form.getFieldValue("startTime") || moment());
      setEndTime(form.getFieldValue("endTime") || moment().add(1, "hours"));
    }
  }, [form]);

  const handleViewSlots = () => {
    const startMoment = moment(startTime, "HH:mm");
    const endMoment = moment(endTime, "HH:mm");
    const slots = [];

    while (startMoment.isBefore(endMoment)) {
      slots.push({
        key: slots.length + 1,
        start: startMoment.format("HH:mm"),
        end: startMoment.add(interval, "minutes").format("HH:mm"),
      });
    }

    setPreviewSlots(slots);
  };


  const handleFinish = async (values) => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/doctor/updateProfile",
        {
          ...values,
          userId: user._id,
         
          timeSlots: previewSlots.map((slot) => ({
            startTime: moment(slot.start, "HH:mm").format("HH:mm"),
            endTime: moment(slot.end, "HH:mm").format("HH:mm"),
          })),
          availableSlots: {
            startTime: moment(values.startTime).format("HH:mm"),
            endTime: moment(values.endTime).format("HH:mm"),
            interval: values.interval,
          },
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
        navigate("/");
      } else {
        message.error(res.data.success);
      }
    } catch (error) {
      dispatch(hideLoading());
      message.error("Somthing Went Wrrong ");
    }
  };
  // update doc ==========

  //getDOc Details
  const getDoctorInfo = async () => {
    try {
      const res = await axios.post(
        "/api/v1/doctor/getDoctorInfo",
        { userId: params.id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        setDoctor(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDoctorInfo();
    //eslint-disable-next-line
  }, []);
  return (
    <Layout>
      <h1>Manage Profile</h1>
      {doctor && (
        <Form
          layout="vertical"
          onFinish={handleFinish}
          className="m-3"
          initialValues={{
            ...doctor,
            startTime: moment(doctor.availableSlots?.startTime, "HH:mm") || moment(),
            endTime: moment(doctor.availableSlots?.endTime, "HH:mm") || moment().add(1, "hours"),
            interval: doctor.availableSlots?.interval || 30,
            timings: [
              moment(doctor.timings[0], "HH:mm"),
              moment(doctor.timings[1], "HH:mm"),
            ],

            
          }}
        >
          <h4 className="">Personal Details : </h4>
          <Row gutter={20}>
            <Col xs={24} md={24} lg={8}>
              <Form.Item
                label="First Name"
                name="firstName"
                required
                rules={[{ required: true }]}
              >
                <Input type="text" placeholder="your first name" />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
              <Form.Item
                label="Last Name"
                name="lastName"
                required
                rules={[{ required: true }]}
              >
                <Input type="text" placeholder="your last name" />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
              <Form.Item
                label="Phone No"
                name="phone"
                required
                rules={[{ required: true }]}
              >
                <Input type="text" placeholder="your contact no" />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
              <Form.Item
                label="Email"
                name="email"
                required
                rules={[{ required: true }]}
              >
                <Input type="email" placeholder="your email address" />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
              <Form.Item label="Website" name="website">
                <Input type="text" placeholder="your website" />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
              <Form.Item
                label="Address"
                name="address"
                required
                rules={[{ required: true }]}
              >
                <Input type="text" placeholder="your clinic address" />
              </Form.Item>
            </Col>
          </Row>
          <h4>Professional Details :</h4>
          <Row gutter={20}>
            <Col xs={24} md={24} lg={8}>
              <Form.Item
                label="Specialization"
                name="specialization"
                required
                rules={[{ required: true }]}
              >
                <Input type="text" placeholder="your specialization" />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
              <Form.Item
                label="Experience"
                name="experience"
                required
                rules={[{ required: true }]}
              >
                <Input type="text" placeholder="your experience" />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
              <Form.Item
                label="Fees Per Cunsaltation"
                name="feesPerCunsaltation"
                required
                rules={[{ required: true }]}
              >
                <Input type="text" placeholder="your contact no" />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
          
            
            </Col>
            <h4>Set Available Time Slots:</h4>
          <Row gutter={20}>
          <div>
      <h4>Set Time Range:</h4>
      <Input
        type="time"
      
        defaultValue={startTime}
        onChange={(e) => setStartTime(e.target.value)}
      />
      <Input
        type="time"
     
        defaultValue={endTime}
        onChange={(e) => setEndTime(e.target.value)}
      />
      <InputNumber
        min={1}
        value={interval}
        onChange={(value) => setInterval(value)}
      />
      <Button type="primary" onClick={handleViewSlots}>
        View Slots
      </Button>

      {previewSlots.length > 0 && (
        <div>
          <h4>Preview Slots:</h4>
          <Row gutter={16}>
            {previewSlots.map((slot) => (
              <Col key={slot.key} xs={24} sm={12} md={8} lg={6} xl={4}>
                <Card title={`Slot ${slot.key}`} style={{ marginBottom: 16 }}>
                  <p><strong>Start Time:</strong> {slot.start}</p>
                  <p><strong>End Time:</strong> {slot.end}</p>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}
    </div>
          
          </Row>
          
            <Col xs={24} md={24} lg={8}></Col>
            <Col xs={24} md={24} lg={8}>

              <button className="btn btn-primary form-btn" type="submit">
                Update
              </button>
            </Col>
          </Row>
        </Form>
      )}
    </Layout>
  );
};

export default Profile; 