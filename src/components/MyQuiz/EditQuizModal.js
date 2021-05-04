import { useEffect, useRef, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import axios from "../../axios/axios";
import Loader from "../Loader/Loader";

const getCorrectDateFormat = (d) => {
  const date = d.split(" ")[0].split("/");
  const time = d.split(" ")[1];
  return `${date[2]}-${date[1]}-${date[0]}T${time}`;
};

const ScheduleClass = ({
  setEditQuiz,
  quizTitle,
  duration,
  startDate,
  expireDate,
  user,
  id,
  getCourses,
}) => {
  const [quizName, setQuizName] = useState(quizTitle);
  const [quizDuration, setQuizDuration] = useState(duration);
  const [startdate, setStartdate] = useState(() =>
    getCorrectDateFormat(startDate)
  );
  const [expiredate, setExpireDate] = useState(() =>
    getCorrectDateFormat(expireDate)
  );
  const [loading, setLoading] = useState(false);
  const modalRef = useRef(null);

  const editQuiz = async () => {
    if (!quizName || !quizDuration || !startdate || !expiredate)
      return alert("Please fill all the fields!");
    try {
      const postData = {
        quiz_name: quizName,
        duration: quizDuration,
        start_date: startdate + ":00+05:30",
        expire_date: expiredate + ":00+05:30",
        questions: [],
      };
      const config = {
        headers: { Authorization: `Bearer ${user.access}` },
      };
      setLoading(true);
      const { data } = await axios.patch(
        `/teacher/quiz/editQuiz/${id}`,
        postData,
        config
      );
      getCourses();
      setLoading(false);
      console.log(data);
      setEditQuiz(false);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    const handler = (e) => {
      if (!modalRef.current?.contains(e.target)) {
        setEditQuiz(false);
      }
    };
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  });

  return (
    <div className="schedule-class-modal">
      <div className="schedule-class-modal-card" ref={modalRef}>
        <h1>Edit Quiz</h1>
        <button onClick={() => setEditQuiz(false)} className="close-btn">
          <IoCloseOutline />
        </button>
        <div className="schedule-class-form">
          <br />
          <label>Name</label>
          <input
            type="text"
            placeholder="Topic..."
            value={quizName}
            onChange={(e) => setQuizName(e.target.value)}
          />
          <br />
          <label>Duration (format: hh:mm:ss)</label>
          <input
            type="text"
            placeholder="Link..."
            value={quizDuration}
            onChange={(e) => setQuizDuration(e.target.value)}
          />
          <br />
          <label>Expire Date</label>
          <input
            type="datetime-local"
            value={startdate}
            onChange={(e) => setStartdate(e.target.value)}
          />
          <br />
          <label>Start Date</label>
          <input
            type="datetime-local"
            value={expiredate}
            onChange={(e) => setExpireDate(e.target.value)}
          />
          <br />
          <button className="submit-btn" onClick={editQuiz}>
            Submit
          </button>
        </div>
      </div>
      {loading && (
        <div className="quiz-loader">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default ScheduleClass;
