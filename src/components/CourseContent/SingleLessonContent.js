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
import "./UniqueCourse.css";

const SingleLessonContent = ({
  singleContent,
  user,
  id,
  index,
  lessonId,
  courseIndex,
  fetchLessonContent,
}) => {
  const clickRef = useRef(null);
  const [showLessonEdit, setShowLessonEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const deleteLessonContent = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.access}` },
      };
      const { data } = await axios.delete(
        `/teacher/editLessonContent/${id}`,
        config
      );
      fetchLessonContent();
      setShowDelete(false);
      console.log(data);
    } catch (err) {
      console.log(err.message);
    }
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
      <div className="lesson-left">
        <div className="label">
          <div>
            {courseIndex}.{index + 1} {singleContent?.media_type.toUpperCase()}
          </div>
          <div>{singleContent?.text}</div>
          <div>{singleContent?.quiz_name}</div>
          <div>{singleContent?.assignment_name}</div>
          <div>{singleContent?.descripion}</div>
          <div>{singleContent?.text_content}</div>
        </div>
      </div>
      <div className="single-lesson-icons">
        <button>{toggleIcon()}</button>
        <button onClick={() => setShowDelete(true)}>
          <AiOutlineDelete />
        </button>
        <button onClick={() => setShowLessonEdit(true)}>
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
          description={singleContent?.descripion}
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
