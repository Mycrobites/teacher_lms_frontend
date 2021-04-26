import { useState, useEffect, useContext } from "react";
import Loader from "../Loader/Loader";
import axios from "../../axios/axios";
import Carousel from "react-elastic-carousel";
import UserContext from "../../context/authContext";
import SingleCourse from "./SingleCourse";
import "./MyCourse.css";

const breakPoints = [
  { width: 1, itemsToShow: 1 },
  { width: 500, itemsToShow: 2 },
  { width: 900, itemsToShow: 3 },
  { width: 1100, itemsToShow: 4 },
];

const getEnrolledCoursesFromLocalStorage = () => {
  const enrolledCourses = localStorage.getItem("enrolled-courses");
  if (enrolledCourses) {
    return JSON.parse(enrolledCourses);
  } else {
    return null;
  }
};

const MyCourse = ({ user }) => {
  const [allCourses, setAllCourses] = useState(
    getEnrolledCoursesFromLocalStorage
  );
  const [isLoading, setIsLoading] = useState(false);
  const { userDetails } = useContext(UserContext);

  useEffect(() => {
    let isUnmounted = false;
    const getCourses = async () => {
      try {
        if (!allCourses) setIsLoading(true);
        const config = {
          headers: { Authorization: `Bearer ${userDetails.access}` },
        };
        const { data } = await axios.get(
          `/teacher/getMyCourses/${user.username}`,
          config
        );
        if (!isUnmounted) {
          setAllCourses(data);
          localStorage.setItem("enrolled-courses", JSON.stringify(data));
        }
      } catch (err) {
        console.log(err.message);
      }
      setIsLoading(false);
    };
    getCourses();

    return () => {
      isUnmounted = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return (
      <div className="loading-div">
        <Loader />
      </div>
    );
  }

  return (
    <div className="Enrolled-courses">
      <div className="title">
        <h1>Welcome! {user.first_name}</h1>
        <h4 style={{ color: "gray" }}>Here are All Your Courses</h4>
      </div>

      <div className="course-cards">
        <Carousel breakPoints={breakPoints}>
          {allCourses?.map((course) => (
            <SingleCourse key={course?.id} {...course} />
          ))}
        </Carousel>
      </div>
    </div>
  );
};

export default MyCourse;
