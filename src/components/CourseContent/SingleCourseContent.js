import { useState } from "react";
import CourseContentModal from "../CourseContentModal/CourseContentModal";
import SingleLessonContent from "./SingleLessonContent";
import Loader from "../Loader/Loader";
import axios from "../../axios/axios";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import { AiOutlineAppstoreAdd } from "react-icons/ai";
import { AiOutlineDelete } from "react-icons/ai";
import { MdEdit } from "react-icons/md";
import "./UniqueCourse.css";

const SingleCourseContent = ({
  user,
  lesson,
  index,
  id,
  course_id,
  fetchLessonContent,
}) => {
  const [showContent, setShowContent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showNewContent, setShowNewContent] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [lessonName, setLessonName] = useState(lesson?.lesson_name);
  const [lessonDescription, setLessonDescription] = useState(
    lesson?.description
  );
  const [lessonNumber, setLessonNumber] = useState(lesson?.lesson_no);

  const handleDelete = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.access}` },
      };
      setLoading(true);
      await axios.delete(`/teacher/editLesson/${id}`, config);
      setShowDelete(false);
      fetchLessonContent();
    } catch (err) {
      console.log(err.message);
    }
    setLoading(false);
  };

  const editLesson = async () => {
    if (!course_id || !lessonName || !lessonDescription || !lessonNumber) {
      return alert("Please enter all the fields!");
    }

    const postData = {
      course: course_id,
      name: lessonName,
      desp: lessonDescription,
      lessonno: lessonNumber,
    };

    try {
      const config = {
        headers: { Authorization: `Bearer ${user.access}` },
      };
      setLoading(true);
      await axios.put(`/teacher/editLesson/${id}`, postData, config);
      setShowEdit(false);
      fetchLessonContent();
      setLoading(false);
    } catch (err) {
      console.log(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="single-course-content">
      {loading && (
        <div className="course-loader">
          <Loader />
        </div>
      )}

      <div onClick={() => setShowContent(!showContent)} className="lesson_name">
        <div>
          <h5>
            Lesson {lesson?.lesson_no} : {lesson?.lesson_name}
          </h5>
          <p>{lesson?.description}</p>
        </div>

        <div className="single-course-btn">
          <button>
            {!showContent ? <ExpandMoreIcon /> : <ExpandLessIcon />}
          </button>
          <button
            disabled={id === "null"}
            onClick={() => setShowNewContent(true)}
          >
            <AiOutlineAppstoreAdd />
          </button>
          <button disabled={id === "null"} onClick={() => setShowDelete(true)}>
            <AiOutlineDelete />
          </button>
          <button disabled={id === "null"} onClick={() => setShowEdit(true)}>
            <MdEdit />
          </button>
        </div>

        {showDelete && (
          <div className="delete-modal-wrapper">
            <div className="delete-modal">
              <p>Are you sure you want to delete your course ?</p>
              <div className="lesson-delete-modal-button">
                <button onClick={() => setShowDelete(false)}>Cancel</button>
                <button onClick={handleDelete}>Proceed and Delete</button>
              </div>
            </div>
          </div>
        )}

        {showEdit && (
          <div className="course-modal-wrapper ">
            <div className="course-modal lesson-modal">
              <label>
                <p>Lesson Name</p>
                <input
                  type="text"
                  value={lessonName}
                  onChange={(e) => setLessonName(e.target.value)}
                  placeholder="Lesson name"
                />
              </label>
              <br />
              <label>
                <p>Lesson Description</p>
                <textarea
                  name="Lesson-description"
                  value={lessonDescription}
                  onChange={(e) => setLessonDescription(e.target.value)}
                  placeholder="Enter lesson description"
                />
              </label>
              <br />
              <label>
                <p>Lesson Number</p>
                <input
                  name="lesson_no"
                  type="number"
                  value={lessonNumber}
                  onChange={(e) => setLessonNumber(e.target.value)}
                  placeholder="Enter lesson number"
                />
              </label>
              <br />
              <div className="edit-modal-btn">
                <button onClick={editLesson}>Apply</button>
                <button onClick={() => setShowEdit(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {showContent && (
        <div className="lesson_content">
          {lesson?.contents?.map((content, idx) => (
            <SingleLessonContent
              key={idx}
              index={idx}
              id={content?.content_id}
              lessonId={lesson?.lesson_id}
              singleContent={content}
              user={user}
              lesson_no={lesson.lesson_no}
              fetchLessonContent={fetchLessonContent}
            />
          ))}
        </div>
      )}

      {showNewContent && (
        <CourseContentModal
          id={id}
          user={user}
          fetchLessonContent={fetchLessonContent}
          setShowNewContent={setShowNewContent}
        />
      )}
    </div>
  );
};

export default SingleCourseContent;
