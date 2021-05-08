import { useState, useRef } from "react";
import SingleLessonEdit from "./SingleLessonEdit";
import { VscFilePdf } from "react-icons/vsc";
import { AiOutlineFileText } from "react-icons/ai";
import { BiTask } from "react-icons/bi";
import { MdAssignment } from "react-icons/md";
import { IoIosPlayCircle } from "react-icons/io";
import { FaHandMiddleFinger } from "react-icons/fa";
import { AiOutlineDelete } from "react-icons/ai";
import { MdEdit } from "react-icons/md";
import axios from "../../axios/axios";
// import parse from "html-react-parser";
import Loader from "../Loader/Loader";
import "./UniqueCourse.css";

const SingleLessonContent = ({
  singleContent,
  user,
  id,
  index,
  lessonId,
  lesson_no,
  fetchLessonContent,
}) => {
  const clickRef = useRef(null);
  const [showLessonEdit, setShowLessonEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [loading, setLoading] = useState(false);

  const deleteLessonContent = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.access}` },
      };
      setLoading(true);
      await axios.delete(`/teacher/editLessonContent/${id}`, config);
      fetchLessonContent();
      setShowDelete(false);
    } catch (err) {
      console.log(err.message);
    }
    setLoading(false);
  };

  const toggleIcon = () => {
    switch (singleContent?.media_type) {
      case "text":
        return <AiOutlineFileText />;
      case "quiz":
        return <MdAssignment />;
      case "video":
        return <IoIosPlayCircle />;
      case "homework":
        return <BiTask />;
      case "pdf":
        return <VscFilePdf />;
      case "assignment":
        return <MdAssignment />;
      default:
        return <FaHandMiddleFinger />;
    }
  };

  return (
    <div ref={clickRef} className="single-lesson-content">
      {loading && (
        <div className="loading-div">
          <Loader />
        </div>
      )}
      <div className="lesson-left">
        <div className="label">
          <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
            {lesson_no}.{index + 1} {singleContent?.media_type.toUpperCase()}
          </div>
          <div>{singleContent?.text}</div>
          <div>{singleContent?.quiz_name}</div>
          <div>{singleContent?.assignment_name}</div>
          <div>{singleContent?.description}</div>
          <div>{singleContent?.text_content}</div>
        </div>
      </div>
      <div className="single-lesson-icons">
        <button>{toggleIcon()}</button>
        <button
          disabled={lessonId === "null"}
          onClick={() => setShowDelete(true)}
        >
          <AiOutlineDelete />
        </button>
        <button
          disabled={lessonId === "null"}
          onClick={() => setShowLessonEdit(true)}
        >
          <MdEdit />
        </button>
      </div>
      {showDelete && (
        <div className="delete-modal-wrapper">
          <div className="delete-modal">
            <p>Are you sure you want to delete your course ?</p>
            <div className="lesson-delete-modal-button">
              <button onClick={() => setShowDelete(false)}>Cancel</button>
              <button onClick={deleteLessonContent}>Proceed and Delete</button>
            </div>
          </div>
        </div>
      )}
      {showLessonEdit && (
        <SingleLessonEdit
          setShowLessonEdit={setShowLessonEdit}
          mediaType={singleContent?.media_type}
          description={singleContent?.description}
          text_content={singleContent?.text}
          url={singleContent?.link}
          user={user}
          id={id}
          fetchLessonContent={fetchLessonContent}
        />
      )}
    </div>
  );
};

export default SingleLessonContent;
