// import { useContext } from "react";
import { Avatar } from "@material-ui/core";
import { useHistory } from "react-router-dom";

const SingleCourse = (props) => {
  const {
    id,
    image,
    course_name,
    course_description,
    author_profile_pic,
    // author,
    author_name,
    totallesson,
  } = props;
  const history = useHistory();

  return (
    <div className="single-course-card">
      <div className="single-course-image">
        <img src={image} alt={course_name} />
      </div>
      <h2 className="single-course-title">{course_name}</h2>
      <div className="single-course-author">
        <div>
          <Avatar src={author_profile_pic} />
        </div>
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
      </div>
    </div>
  );
};

export default SingleCourse;
