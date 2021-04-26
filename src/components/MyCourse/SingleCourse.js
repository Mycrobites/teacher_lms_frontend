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
    user,
    author_name,
    totallesson,
  } = props;
  const history = useHistory();

  const [showDelete, setShowDelete] = useState(false);

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
    </div>
  );
};

export default SingleCourse;
