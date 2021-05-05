import { useState } from "react";
import { useHistory } from "react-router-dom";
import EditQuizModal from "./EditQuizModal";
import months from "../../assets/months/months";

const getDateString = (now) => {
  const a = now.split(" ")[0].split("/");
  const b = now.split(" ")[1];
  return `${a[0]} ${
    a[1] < 10 ? months[a[1].split("")[1] - 1] : months[a[1] - 1]
  } ${a[2]} ${b}`;
};

const SingleQuiz = (props) => {
  const {
    belongs_to,
    duration,
    expire_date,
    quiz_title,
    start_date,
    id,
    user,
    getCourses,
  } = props;

  const [editQuiz, setEditQuiz] = useState(false);

  const history = useHistory();

  return (
    <div className="single-course-card single-quiz">
      <h2 className="single-course-title">{quiz_title}</h2>
      <div className="single-course-author">
        <h2>{belongs_to}</h2>
        <h5>Duration : {duration}</h5>
      </div>
      <p style={{ fontSize: "14px", fontWeight: "500" }}>
        Starts on : {getDateString(start_date)}
      </p>
      <p style={{ fontSize: "14px", fontWeight: "500" }}>
        Ends on : {getDateString(expire_date)}
      </p>
      <div className="lessons">
        <button
          className="enrollment-course-btn"
          onClick={() => history.push(`/quizQuestions/${id}`)}
        >
          View
        </button>
        <button
          className="enrollment-course-btn"
          onClick={() => setEditQuiz(!editQuiz)}
        >
          Edit
        </button>
      </div>
      {editQuiz && (
        <EditQuizModal
          setEditQuiz={setEditQuiz}
          quizTitle={quiz_title}
          duration={duration}
          startDate={start_date}
          expireDate={expire_date}
          user={user}
          id={id}
          getCourses={getCourses}
        />
      )}
    </div>
  );
};

export default SingleQuiz;
