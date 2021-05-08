import React, { useState, useEffect, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "../../axios/axios";
import CourseContent from "../../components/CourseContent/CourseContent";
import Loader from "../../components/Loader/Loader";
import UserContext from "../../context/authContext";
import "./CourseEditPage.css";

const CourseEditPage = () => {
  const { id } = useParams();

  const [lessonsData, setLessonsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userDetails } = useContext(UserContext);
  const history = useHistory();
  const fetchLessonContent = async () => {
    // setLoading(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${userDetails.access}` },
      };
      const { data } = await axios.get(`/teacher/getCourse/${id}`, config);
      setLessonsData(data.course_details);
      setLoading(false);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    fetchLessonContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {loading ? (
        <div className="loading-div">
          <Loader />
        </div>
      ) : (
        <div className="course-edit-page">
          <div className="course-btn">
            <button
              className="back-btn"
              onClick={() => history.push("/course")}
            >
              Back to Course
            </button>
            <button
              className="enroll-btn"
              onClick={() => history.push(`/enrolledstudent/${id}`)}
            >
              Enrolled Students
            </button>
          </div>
          <CourseContent
            lessons={lessonsData?.lessons}
            user={userDetails}
            id={id}
            fetchLessonContent={fetchLessonContent}
          />
        </div>
      )}
    </>
  );
};

export default CourseEditPage;
