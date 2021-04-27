import { Avatar } from "@material-ui/core";
import { useHistory } from "react-router-dom";
// import { useContext } from "react";
import axios from "../../axios/axios";
import { useState } from "react";

const SingleCourse = (props) => {
  const {
    id,
    image,
    course_name,
    course_description,
    author_profile_pic,
    // author,
    getCourses,
    prevVideo,
    prevGoals,
    prevConcept,
    user,
    author_name,
    totallesson,
  } = props;
  const history = useHistory();

  const [showDelete, setShowDelete] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [courseName, setCourseName] = useState(course_name);
  const [courseDescription, setCourseDescription] = useState(
    course_description
  );
  const [video, setVideo] = useState(prevVideo);
  const [goals, setGoals] = useState(prevGoals);
  const [concept, setConcept] = useState(prevConcept);

  const handleDelete = async () => {
    setShowDelete(false);
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.access}` },
      };
      await axios.delete(`/teacher/editCourse/${id}`, config);
      getCourses();
    } catch (err) {
      console.log(err.message);
    }
  };

  const editCourse = async () => {
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
        headers: { Authorization: `Bearer ${user.access}` },
      };
      const { data } = await axios.put(
        `/teacher/editCourse/${id}`,
        postData,
        config
      );
      console.log(data);
      getCourses();
      setShowEdit(false);
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div className="single-course-card">
      <div className="single-course-image">
        <img src={image} alt={course_name} />
      </div>
      <h2 className="single-course-title">{course_name}</h2>
      <div className="single-course-author">
        <Avatar src={author_profile_pic} />
        <h2>{author_name}</h2>
      </div>
      <p style={{ fontSize: "14px" }}>{course_description}</p>
      <p style={{ fontSize: "14px" }}>Total Lesson : {totallesson}</p>
      <div className="lessons">
        <button
          className="enrollment-course-btn"
          onClick={() => history.push(`/courseedit/${id}`)}
        >
          View
        </button>
        <button
          className="enrollment-course-btn"
          onClick={() => setShowEdit(true)}
        >
          Edit
        </button>
        <button
          className="enrollment-course-btn delete-btn"
          onClick={() => setShowDelete(true)}
        >
          Delete
        </button>
      </div>

      {showDelete && (
        <div className="course-modal-wrapper">
          <div className="delete-modal">
            <p>Are you sure you want to delete your course ?</p>
            <div className="delete-modal-btn">
              <button onClick={() => setShowDelete(false)}>Cancel</button>
              <button onClick={handleDelete}>Proceed and Delete</button>
            </div>
          </div>
        </div>
      )}

      {showEdit && (
        <div className="course-modal-wrapper">
          <div className="course-modal">
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
              <button onClick={editCourse}>Edit Course</button>
              <button onClick={() => setShowEdit(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleCourse;
