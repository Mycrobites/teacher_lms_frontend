import { useEffect, useRef, useState } from "react";
import Loader from "../Loader/Loader";
import axios from "../../axios/axios";
import "./SingleLessonEdit.css";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { getCookie } from "../Posts/getCookie";

const ScheduleClass = ({
  setShowLessonEdit,
  mediaType,
  user,
  id,
  description,
  text_content,
  url,
  fetchLessonContent,
}) => {
  const modalRef = useRef(null);
  const [textContent, setTextContent] = useState(text_content);
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState(url);
  const [videoDescription, setVideoDescription] = useState(description);
  const [pdfFile, setPdfFile] = useState(null);
  const csrftoken = getCookie("csrftoken");

  const editLesson = async (postData) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.access}` },
      };
      setLoading(true);
      await axios.patch(`/teacher/editLessonContent/${id}`, postData, config);
      fetchLessonContent();
      setShowLessonEdit(false);
    } catch (err) {
      console.log(err.message);
    }
    setLoading(false);
  };

  const editCourseContent = () => {
    if (mediaType === "video") {
      const videoData = {
        link: videoUrl,
        link_desc: videoDescription,
      };
      editLesson(videoData);
    } else if (mediaType === "text" || mediaType === "homework") {
      const textData = {
        text_content: textContent,
      };
      editLesson(textData);
    } else if (mediaType === "pdf") {
      let formData = new FormData();
      formData.append("pdf", pdfFile);
      editLesson(formData);
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
    <div className="single-lesson-edit">
      {loading && (
        <div className="course-loader">
          <Loader />
        </div>
      )}
      <div className="single-lesson-editcard" ref={modalRef}>
        <h1>Edit {mediaType}</h1>
        {mediaType === "text" || mediaType === "homework" ? (
          <label>
            <p>Enter Text Content</p>
            <CKEditor
              editor={ClassicEditor}
              data={textContent}
              config={{
                ckfinder: {
                  uploadUrl:
                    "https://lab.progressiveminds.in/api/uploadimages?command=QuickUpload&type=Images&responseType=json",
                  options: {
                    resourceType: "Images",
                  },
                  credentials: "include",
                  headers: {
                    "X-CSRF-TOKEN": csrftoken,
                    csrftoken: csrftoken,
                    csrfmiddlewaretoken: csrftoken,
                  },
                },
              }}
              onChange={(event, editor) => {
                const data = editor.getData();
                setTextContent(data);
              }}
            />
          </label>
        ) : (
          <></>
        )}
        {mediaType === "quiz" || mediaType === "assignment" ? (
          <p>Edit these content in Myquiz Section</p>
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
              />
            </label>
          </div>
        )}

        <div className="lesson-edit-btn">
          <button
            onClick={editCourseContent}
            disabled={mediaType === "quiz" || mediaType === "assignment"}
          >
            Apply
          </button>
          <button onClick={() => setShowLessonEdit(false)}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleClass;
