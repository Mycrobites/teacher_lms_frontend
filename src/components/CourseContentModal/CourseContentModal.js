import React, { useState } from "react";
import Loader from "../Loader/Loader";
import axios from "../../axios/axios";
import "./CourseContentModal.css";

const CourseContentModal = ({
  setShowNewContent,
  id,
  user,
  fetchLessonContent,
}) => {
  const [mediaType, setMediaType] = useState("text");
  const [textContent, setTextContent] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [quizName, setQuizName] = useState("");
  const [duration, setDuration] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  const mediaList = ["text", "video", "homework", "pdf", "quiz", "assignment"];

  const sendCreateRequest = async (data) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.access}` },
      };
      setLoading(true);
      await axios.post("/teacher/createlessoncontent/", data, config);
      setShowNewContent(false);
      fetchLessonContent();
    } catch (err) {
      console.log(err.message);
    }
    setLoading(false);
  };

  const createCourseContent = () => {
    if (mediaType === "video") {
      const videoData = {
        media_type: mediaType,
        lesson: id,
        link: videoUrl,
        link_desc: videoDescription,
      };
      sendCreateRequest(videoData);
      return;
    } else if (mediaType === "text" || mediaType === "homework") {
      const textData = {
        media_type: mediaType,
        lesson: id,
        text_content: textContent,
      };
      sendCreateRequest(textData);
      return;
    } else if (mediaType === "pdf") {
      let formData = new FormData();
      formData.append("media_type", mediaType);
      formData.append("lesson", id);
      formData.append("pdf", pdfFile);

      sendCreateRequest(formData);
      return;
    } else if (mediaType === "quiz" || mediaType === "assignment") {
      const quizData = {
        lesson: id,
        media_type: mediaType,
        quiz_name: quizName,
        duration: duration,
        start_date: startDate,
        expire_date: endDate,
      };
      sendCreateRequest(quizData);
      return;
    }
  };

  return (
    <div className="course-content-modal">
      {loading && (
        <div className="course-loader">
          <Loader />
        </div>
      )}

      <div className="course-modal create-course-modal">
        <label style={{ flexDirection: "column", display: "flex" }}>
          <p>Select Content Type</p>
          <select
            value={mediaType}
            onChange={(e) => setMediaType(e.target.value)}
          >
            {mediaList?.map((media, idx) => (
              <option key={idx} value={media}>
                {media}
              </option>
            ))}
          </select>
        </label>

        {mediaType === "text" || mediaType === "homework" ? (
          <label>
            <p>Enter Text Content</p>
            <textarea
              name="text_coontent"
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="Add Text..."
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
                placeholder="Enter Content Name ..."
              />
            </label>
            <br />
            <br />
            <label>
              <p>Enter Duration (format: hh:mm:ss)</p>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Enter Duration HH:MM:SS"
              />
            </label>
            <br />
            <br />
            <label>
              <p>Enter Start Date</p>
              <input
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </label>
            <br />
            <br />
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
          <div className="video-content">
            <label>
              <p>Enter video url</p>
              <input
                type="text"
                name="video_url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="Add Video URL..."
              />
            </label>
            <br />
            <br />
            <label>
              <p>Enter video Description</p>
              <textarea
                name="video_desc"
                value={videoDescription}
                onChange={(e) => setVideoDescription(e.target.value)}
                placeholder="Add Description..."
              />
            </label>
          </div>
        )}

        <div className="modal-btn">
          <button onClick={createCourseContent}>Create Lesson</button>
          <button onClick={() => setShowNewContent(false)}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default CourseContentModal;
