import { useState, useEffect, useContext, useRef } from "react";
import Loader from "../../components/Loader/Loader";
import axios from "../../axios/axios";
import Carousel from "react-elastic-carousel";
import "./MyCourse.css";
import UserContext from "../../context/authContext";
import SingleCourse from "./SingleCourse";

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
  const [showCreateCourse, setShowCreateCourse] = useState(false);
  const { userDetails } = useContext(UserContext);
  const [courseName, setCourseName] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [video, setVideo] = useState("");
  const [goals, setGoals] = useState("");
  const [concept, setConcept] = useState("");
  const modalRef = useRef(null);

  console.log(showCreateCourse);

  const createCourse = async () => {
    const goalsData = goals.split(",").map((goal, idx) => ({
      key: (idx + 1).toString(),
      goal: goal.trim(),
    }));

    const conceptData = concept.split(",").map((concept, idx) => ({
      key: (idx + 1).toString(),
      concept: concept.trim(),
    }));

    const postData = {
      course_name: courseName,
      course_description: courseDescription,
      video: video,
      goals: goalsData,
      slug: "new-course",
      concepts: conceptData,
      author: user.user_id,
    };
    console.log(postData);

    try {
      const config = {
        headers: { Authorization: `Bearer ${userDetails.access}` },
      };
      const { data } = await axios.post(
        "/teacher/createCourse",
        postData,
        config
      );
      console.log(data);
      getCourses();
      setShowCreateCourse(false);
    } catch (err) {
      console.log(err.message);
    }
  };

  console.log(modalRef);

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
      console.log(data);
      setAllCourses(data);
      localStorage.setItem("enrolled-courses", JSON.stringify(data));
    } catch (err) {
      console.log(err.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect(() => {
  //   const handler = (e) => {
  //     if (!modalRef.current?.contains(e.target)) {
  //       setShowCreateCourse(false);
  //     }
  //   };
  //   document.addEventListener("click", handler);
  //   return () => document.removeEventListener("click", handler);
  // });

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

      <button
        className="create-course-btn"
        onClick={() => setShowCreateCourse(true)}
      >
        Create New Course
      </button>

      {showCreateCourse && (
        <div className="course-modal-wrapper">
          <div className="course-modal" ref={modalRef}>
            <label>
              <p>Course Name</p>
              <input
                type="text"
                value={courseName}
                name="course_name"
                onChange={(e) => setCourseName(e.target.value)}
                placeholder="course name"
              />
            </label>

            <label>
              <p>Course Description</p>
              <textarea
                name="course-description"
                value={courseDescription}
                onChange={(e) => setCourseDescription(e.target.value)}
                placeholder="enter course description"
              />
            </label>

            <label>
              <p>Course Introduction Video</p>
              <input
                name="video"
                type="text"
                value={video}
                onChange={(e) => setVideo(e.target.value)}
                placeholder="paste intro video link"
              />
            </label>

            <label>
              <p>Course Goals</p>
              <input
                name="goals"
                type="text"
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                placeholder="Enter course goals comma seperated"
              />
            </label>

            <label>
              <p>Course Concepts</p>
              <input
                name="concepts"
                type="text"
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
                placeholder="Enter course concepts comma seperated"
              />
            </label>

            <div className="modal-btn">
              <button onClick={createCourse}>Create Course</button>
              <button onClick={() => setShowCreateCourse(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="course-cards">
        <Carousel breakPoints={breakPoints}>
          {allCourses?.map((course) => (
            <SingleCourse
              key={course?.id}
              getCourses={getCourses}
              user={user}
              {...course}
              prevVideo={course?.video}
              prevGoals={course?.goals}
              prevConcept={course?.concepts}
            />
          ))}
        </Carousel>
      </div>
    </div>
  );
};

export default MyCourse;
