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

const MyCourse = ({ user }) => {
  const [allCourses, setAllCourses] = useState(null);
  const [showCreateCourse, setShowCreateCourse] = useState(false);
  const [courseName, setCourseName] = useState("");
  const [courseImage, setCourseImage] = useState(null);
  const [courseDescription, setCourseDescription] = useState("");
  const [video, setVideo] = useState("");
  const [goals, setGoals] = useState("");
  const [concept, setConcept] = useState("");
  const [loading, setLoading] = useState(false);
  const { userDetails } = useContext(UserContext);
  const modalRef = useRef(null);

  const createCourse = async () => {
    if (
      !courseName ||
      !courseDescription ||
      !video ||
      !goals ||
      !concept ||
      !courseImage
    ) {
      return alert("Please enter all the fields!");
    }

    let formData = new FormData();
    formData.append("course_name", courseName);
    formData.append("course_description", courseDescription);
    formData.append("video", video);
    formData.append("goals", goals);
    formData.append("slug", "new-course");
    formData.append("concepts", concept);
    formData.append("author", user.user_id);
    formData.append("image", courseImage);

    const postData = {
      title: courseName,
      description: courseDescription,
      course: [],
    };
    try {
      const config = {
        headers: { Authorization: `Bearer ${userDetails.access}` },
      };
      setLoading(true);
      const res = await axios.post("/teacher/createCourse", formData, config);
      postData.course.push(res.data.id);
      await axios.post(`/api/create-group`, postData, config);
      getCourses();
      setShowCreateCourse(false);
    } catch (err) {
      console.log(err.message);
    }
    setLoading(false);
  };

  const getCourses = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${userDetails.access}` },
      };
      const { data } = await axios.get(
        `/teacher/getMyCourses/${user.username}`,
        config
      );
      setAllCourses(data);
    } catch (err) {
      console.log(err.message);
    }
  };

  const objectToString = (object, params) => {
    let stringArray = [];
    object.forEach((obj) => {
      stringArray.push(params === "goals" ? obj.goals : obj.concepts);
    });
    return stringArray.join();
  };

  useEffect(() => {
    getCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!allCourses) {
    return (
      <div className="loading-div">
        <Loader />
      </div>
    );
  }

  return (
    <div className="Enrolled-courses">
      {loading && (
        <div className="course-loader">
          <Loader />
        </div>
      )}
      <div className="mycourse-title">
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
      </div>

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
                placeholder="Enter course description"
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
              <p>Course Image</p>
              <input
                type="file"
                name="profile pic"
                accept="image/*"
                onChange={(e) => setCourseImage(e.target.files[0])}
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

            <div className="add-modal-button">
              <button onClick={createCourse}>Create Course</button>
              <button onClick={() => setShowCreateCourse(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {allCourses?.length === 0 && (
        <p
          style={{
            textAlign: "center",
            marginTop: 200,
            fontWeight: 600,
            color: "rgba(0,0,0,0.5)",
          }}
        >
          You haven't created any Course
        </p>
      )}

      {allCourses.length > 0 && (
        <div className="course-cards">
          <Carousel breakPoints={breakPoints}>
            {allCourses?.map((course) => (
              <SingleCourse
                key={course?.id}
                getCourses={getCourses}
                user={user}
                {...course}
                prevVideo={course?.video}
                prevGoals={objectToString(course?.goals, "goals")}
                prevConcept={objectToString(course?.concepts, "concepts")}
              />
            ))}
          </Carousel>
        </div>
      )}
    </div>
  );
};

export default MyCourse;
