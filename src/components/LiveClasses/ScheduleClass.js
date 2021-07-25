import { useEffect, useRef, useState } from "react";
import Loader from "../Loader/Loader";
import { IoCloseOutline } from "react-icons/io5";
import axios from "../../axios/axios";
import "./ScheduleClass.css";

const getCurrentDate = () => {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth() < 10 ? `0${now.getMonth() + 1}` : now.getMonth() + 1;
  const d = now.getDate() < 10 ? `0${now.getDate()}` : now.getDate();
  const hh = now.getHours() < 10 ? `0${now.getHours()}` : now.getHours();
  const mm = now.getMinutes() < 10 ? `0${now.getMinutes()}` : now.getMinutes();
  return `${y}-${m}-${d}T${hh}:${mm}`;
};

const getDateString = (now) => {
  const a = now.split("T")[0].split("-");
  const b = now.split("T")[1];
  return `${a[2]}/${a[1]}/${a[0]} ${b}`;
};

const ScheduleClass = ({
  setShowScheduleClass,
  courseList,
  user,
  fetchUpcomingEvents,
}) => {
  const [topic, setTopic] = useState("");
  const [link, setLink] = useState("");
  const [lectureDate, setLectureDate] = useState(getCurrentDate);
  const [courseid, setCourseid] = useState(courseList[0].id ?  courseList[0].id : null );
  const [loading, setLoading] = useState(false);
  const modalRef = useRef(null);

  const createLiveClass = async () => {
    if (!topic || !link) {
      return alert("Please fill all the fields!");
    }
    try {
      const postData = {
        user: user.username,
        course: courseid,
        topic,
        link,
        timeStamp: getDateString(lectureDate),
      };
      const config = {
        headers: { Authorization: `Bearer ${user.access}` },
      };
      setLoading(true);
      await axios.post("/teacher/scheduleliveclass/", postData, config);
      setTopic("");
      setLink("");
      setCourseid(courseList[0].id);
      setShowScheduleClass(false);
      fetchUpcomingEvents();
    } catch (err) {
      console.log(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    const handler = (e) => {
      if (!modalRef.current?.contains(e.target)) {
        setShowScheduleClass(false);
      }
    };
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  });

  return (
    <div className="schedule-class-modal">
      {loading && (
        <div className="schedule-loader">
          <Loader />
        </div>
      )}
      <div className="schedule-class-modal-card" ref={modalRef}>
        <h1>Schedule Class</h1>
        <select value={courseid} onChange={(e) => setCourseid(e.target.value)}>
          {courseList?.map((course) => (
            <option key={course.id} value={course.id}>
              {course.course_name}
            </option>
          ))}
        </select>
        <button
          onClick={() => setShowScheduleClass(false)}
          className="close-btn"
        >
          <IoCloseOutline />
        </button>
        <div className="schedule-class-form">
          <br />
          <label>Class Title</label>
          <input
            type="text"
            placeholder="Class Title..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <br />
          <label>Link</label>
          <input
            type="text"
            placeholder="Link..."
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
          <br />
          <label>Time</label>
          <input
            type="datetime-local"
            value={lectureDate}
            onChange={(e) => setLectureDate(e.target.value)}
          />
          <br />
          <button className="submit-btn" onClick={createLiveClass}>
            Schedule
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleClass;
