import { useState, useEffect, useRef } from "react";
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
  fetchLessonContent,
}) => {
  const clickRef = useRef(null);
  const [showLessonEdit, setShowLessonEdit] = useState(false);
  // console.log(singleContent);

  const deleteLessonContent = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.access}` },
      };
      const { data } = await axios.delete(
        `/api/editLessonContent/${id}`,
        config
      );
      fetchLessonContent();
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
          <div>{singleContent?.media_type}</div>
        </div>
      </div>
      <div className="single-lesson-icons">
        <button>{toggleIcon()}</button>
        <button onClick={deleteLessonContent}>
          <AiOutlineDelete />
        </button>
        <button onClick={() => setShowLessonEdit(true)}>
          <MdEdit />
        </button>
      </div>
      {showLessonEdit && (
        <SingleLessonEdit
          setShowLessonEdit={setShowLessonEdit}
          mediaType={singleContent?.media_type}
          user={user}
          id={id}
        />
      )}
    </div>
  );
};

export default SingleLessonContent;
