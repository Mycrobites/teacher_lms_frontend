import { useState } from "react";
import { useHistory } from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import EditQuizModal from "./EditQuizModal";
import months from "../../assets/months/months";
import axios from "../../axios/axios";
import ReactHtmlParser from "react-html-parser";

const getTime = (time) => {
  const t = time.split("T")[1].split("+")[0];
  const d = time.split("T")[0].split("-")[2];
  const m = time.split("T")[0].split("-")[1];
  const y = time.split("T")[0].split("-")[0];
  return `${d} ${
    m < 10 ? months[m.split("")[1] - 1] : months[m - 1]
  } ${y} ${t}`;
};

const QuizCard = (props) => {
  const {
    id,
    title,
    desc,
    duration,
    starttime,
    endtime,
    userDetails,
    fetchAllQuizzes,
  } = props;
  const [editQuiz, setEditQuiz] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const history = useHistory();

  const deleteQuiz = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${userDetails.access}` },
      };
      setLoading(true);
      await axios.delete(`/api/edit-quiz/${id}`, config);
      setShowConfirmDelete(false);
      fetchAllQuizzes();
    } catch (err) {
      console.log(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="teacher-quiz-card">
      {showConfirmDelete && (
        <div className="confirm-delete-modal">
          <div className="confirm-delete">
            <p>Are you sure you want to delete this quiz?</p>
            <div className="confirm-delete-buttons">
              <button onClick={deleteQuiz}>Yes</button>
              <button onClick={() => setShowConfirmDelete(false)}>No</button>
            </div>
          </div>
        </div>
      )}
      <div className="title-1">
        <h2 className="title">{title}</h2>
      </div>
      <div className="description-1">
        <p className="desc">{ReactHtmlParser(desc)}</p>
      </div>
      <p className="duration">
        <span>Duration: </span>
        {duration}
      </p>
      <p className="time" style={{ color: "#000000", marginLeft: 0 }}>
        <span>Start Time: </span>
        {getTime(starttime)}
      </p>
      <p className="time">
        <span>End Time: </span>
        {getTime(endtime)}
      </p>
      <div className="teacher-quiz-card-buttons">
        <button onClick={() => history.push(`/quizquestions/${id}`)}>
          View
        </button>
        <button onClick={() => setEditQuiz(!editQuiz)}>Edit</button>
        <button onClick={() => setShowConfirmDelete(true)}>Delete</button>
      </div>
      {editQuiz && <EditQuizModal {...props} setEditQuiz={setEditQuiz} />}
      {loading && (
        <div className="quiz--loader">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default QuizCard;
