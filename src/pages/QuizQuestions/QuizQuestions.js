import { useState, useEffect, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import UserContext from "../../context/authContext";
import Loader from "../../components/Loader/Loader";
import axios from "../../axios/axios";
import parse from "html-react-parser";
import { AiFillDelete } from "react-icons/ai";
import "./QuizQuestions.css";

const QuizQuestions = () => {
  const [questions, setQuestions] = useState(null);
  const { userDetails } = useContext(UserContext);
  const { id } = useParams();
  const history = useHistory();

  const deleteQuestion = async (qid) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${userDetails.access}` },
      };
      const { data } = await axios.delete(
        `/teacher/deleteQuestionFromQuiz/${id}/${qid}`,
        config
      );
      console.log(data);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${userDetails.access}` },
        };
        const { data } = await axios.get(
          `teacher/quiz/getQuestions/${id}`,
          config
        );
        console.log(data.quiz_details);
        setQuestions(data.quiz_details);
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!questions) {
    return (
      <div className="quiz-questions-loader">
        <Loader />;
      </div>
    );
  }

  return (
    <div className="quiz-questions-div">
      <div className="quiz-question-header">
        <h2>{questions?.quiz_name} Questions</h2>
        <button
          className="enrollment-course-btn"
          onClick={() => history.push(`/quizedit/${id}`)}
        >
          Add Questions
        </button>
      </div>
      {questions?.questions.length === 0 && (
        <p className="no-questions">Add questions in this quiz!</p>
      )}
      <div className="quiz-questions">
        {questions?.questions.map((ques, idx) => (
          <div className="quiz-question" key={idx}>
            <div className="question-content">
              <div>{parse(ques.question)}</div>
            </div>
            <button
              className="question-delete-btn"
              onClick={() => deleteQuestion(ques.id)}
            >
              <AiFillDelete />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizQuestions;
