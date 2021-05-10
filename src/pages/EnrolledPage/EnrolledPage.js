import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import UserContext from "../../context/authContext";
import axios from "../../axios/axios";
import EnrolledStudent from "../../components/EnrolledStudents/EnrolledStudent";
import "./EnrolledPage.css";

const EnrolledPage = () => {
  const { id } = useParams();
  const [enrolledStudents, setEnrolledStudents] = useState(null);
  const { userDetails } = useContext(UserContext);

  const fetchEnrolledStudent = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${userDetails.access}` },
      };
      const { data } = await axios.get(
        `/teacher/getEnrolledStudents/${userDetails.username}/${id}`,
        config
      );
      setEnrolledStudents(data.response);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    fetchEnrolledStudent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!enrolledStudents) {
    return (
      <div className="loading-div">
        <Loader />
      </div>
    );
  }

  return (
    <div className="enrolled-page">
      <EnrolledStudent students={enrolledStudents} />
    </div>
  );
};

export default EnrolledPage;
