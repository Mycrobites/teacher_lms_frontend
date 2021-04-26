import { useEffect, useRef, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import "./ScheduleClass.css";

const getCurrentDate = () => {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth() < 10 ? `0${now.getMonth() + 1}` : now.getMonth() + 1;
  const d = now.getDate() < 10 ? `0${now.getDate()}` : now.getDate();
  const hh = now.getHours() < 10 ? `0${now.getHours()}` : now.getHours();
  const mm = now.getMinutes() < 10 ? `0${now.getMinutes()}` : now.getMinutes();
  // console.log(`${y}-${m}-${d}T${hh}:${mm}`);
  return `${y}-${m}-${d}T${hh}:${mm}`;
};

const ScheduleClass = ({ setShowScheduleClass, courseList, user }) => {
  const [topic, setTopic] = useState("");
  const [link, setLink] = useState("");
  const [lectureDate, setLectureDate] = useState(getCurrentDate);
  const [courseid, setCourseid] = useState(null);
  const modalRef = useRef(null);

  console.log(courseid);

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
      <div className="schedule-class-modal-card" ref={modalRef}>
        <h1>Schedule Class</h1>
        <select>
          {courseList?.map((course) => (
            <option key={course.id} onClick={() => setCourseid(course.id)}>
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
          <label>Topic</label>
          <input
            type="text"
            placeholder="Topic..."
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
          <button className="submit-btn">Schedule</button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleClass;
