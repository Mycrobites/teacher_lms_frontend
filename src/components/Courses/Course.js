const Course = ({ course_name, image, author_name, course_description }) => {
  return (
    <div className="Course">
      <div className="course-image">
        <img src={image} alt={course_name} />
      </div>
      <div className="course-content">
        <h2>{course_name}</h2>
        <div className="instructor">
          <h3>by {author_name}</h3>
        </div>
        <div className="course-description">
          <p>{course_description}</p>
        </div>
      </div>
    </div>
  );
};

export default Course;
