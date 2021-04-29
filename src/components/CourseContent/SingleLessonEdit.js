import { useEffect, useRef, useState } from "react";
import axios from "../../axios/axios";
import "./SingleLessonEdit.css";

const ScheduleClass = ({ setShowLessonEdit, mediaType, user, id }) => {
  const [textContent, setTextContent] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [quizName, setQuizName] = useState("");
  const [duration, setDuration] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const modalRef = useRef(null);

  const editLesson = async (postData) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.access}` },
      };
      const { data } = await axios.patch(
        `/api/editLessonContent/${id}`,
        postData,
        config
      );
      console.log(data);
    } catch (err) {
      console.log(err.message);
    }
  };

  const editCourseContent = () => {
    if (mediaType === "video") {
      const videoData = {
        media_type: mediaType,
        lesson: id,
        link: videoUrl,
        link_desc: videoDescription,
      };
      console.log(videoData);
      editLesson(videoData);
    } else if (mediaType === "text" || mediaType === "homework") {
      const textData = {
        media_type: mediaType,
        lesson: id,
        text_content: textContent,
      };
      console.log(textData);
      editLesson(textData);
    } else if (mediaType === "pdf") {
      let formData = new FormData();
      formData.append("media_type", mediaType);
      formData.append("lesson", id);
      formData.append("pdf", pdfFile);
      editLesson(formData);
    } else if (mediaType === "quiz" || mediaType === "assignment") {
      const quizData = {
        lesson: id,
        media_type: mediaType,
        quiz_name: quizName,
        duration: duration,
        start_date: startDate,
        expire_date: endDate,
      };
      editLesson(quizData);
    }
  };

  useEffect(() => {
    const handler = (e) => {
      if (!modalRef.current?.contains(e.target)) {
        setShowLessonEdit(false);
      }
    };
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  });

  return (
    <div className="single-lesson-edit-modal">
      <div className="single-lesson-edit-card" ref={modalRef}>
        <h1>Edit {mediaType}</h1>

        {mediaType === "text" || mediaType === "homework" ? (
          <label>
            <p>Enter Text Content</p>
            <textarea
              name="text_coontent"
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
            />
          </label>
        ) : (
          <></>
        )}
        {mediaType === "quiz" || mediaType === "assignment" ? (
          <div className="quiz-content">
            <label>
              <p>Enter Content Name</p>
              <input
                type="text"
                value={quizName}
                onChange={(e) => setQuizName(e.target.value)}
              />
            </label>
            <label>
              <p>Enter Duration</p>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </label>
            <label>
              <p>Enter Start Date</p>
              <input
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </label>
            <label>
              <p>Enter End Date</p>
              <input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </label>
          </div>
        ) : (
          <></>
        )}

        {mediaType === "pdf" && (
          <label>
            <p>Upload Document</p>
            <input
              type="file"
              onChange={(e) => setPdfFile(e.target.files[0])}
            />
          </label>
        )}

        {mediaType === "video" && (
          <div
            className="video-content"
            style={{
              display: "flex",
              flexDirection: "column",
              height: " 150px",
              justifyContent: "space-around",
            }}
          >
            <label>
              <p>Enter video url</p>
              <input
                type="text"
                name="video_url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
              />
            </label>
            <label>
              <p>Enter video Description</p>
              <textarea
                name="video_desc"
                value={videoDescription}
                onChange={(e) => setVideoDescription(e.target.value)}
              />
            </label>
          </div>
        )}

        <div className="modal-btn">
          <button onClick={editCourseContent}>Create Lesson Content</button>
          <button onClick={() => setShowLessonEdit(false)}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleClass;
