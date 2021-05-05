import { useState, useEffect, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import axios from "../../axios/axios";
import UserContext from "../../context/authContext";
import parse from "html-react-parser";
import "./QuizEditPage.css";

const QuizEditPage = () => {
  const [questionBank, setQuestionBank] = useState(null);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const { userDetails } = useContext(UserContext);
  const { id } = useParams();
  const history = useHistory();

  const handleChange = (qid) => {
    if (selectedQuestions.includes(qid)) {
      setSelectedQuestions(
        selectedQuestions.filter((question) => question !== qid)
      );
    } else {
      setSelectedQuestions([...selectedQuestions, qid]);
    }
  };

  const addQuestions = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${userDetails.access}` },
      };
      const postData = {
        quiz_id: id,
        quest_id: selectedQuestions,
      };
      setLoading(true);
      const { data } = await axios.post(
        "/teacher/addQuestionToQuiz",
        postData,
        config
      );
      if (data) setLoading(false);
      alert(data.message);
      if (data.message === "added successfully")
        history.push(`/quizQuestions/${id}`);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    const getQuestionBank = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${userDetails.access}` },
        };
        const { data } = await axios.get("/teacher/getQuestionsFromQB", config);
        setQuestionBank(data.questions);
      } catch (err) {
        console.log(err.message);
      }
    };
    getQuestionBank();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!questionBank) {
    return (
      <div className="quiz-questions-loader">
        <Loader />;
      </div>
    );
  }

  return (
    <div className="quiz-questions-div">
      {!questionBank && <p>Loading...</p>}
      <div className="quiz-question-header">
        <h1>Question Bank</h1>
        <button
          disabled={selectedQuestions.length === 0}
          onClick={addQuestions}
        >
          Add Questions
        </button>
      </div>
      {questionBank?.map((ques) => (
        <div className="quiz-question" key={ques.id}>
          <input type="checkbox" onChange={() => handleChange(ques.id)} />
          <div className="question-content">
            <div>{parse(ques.question)}</div>
            <div className="options">
              {!ques.question.includes("img") &&
                ques.option.map((op, idx) => {
                  const ops = ["A", "B", "C", "D"];
                  return (
                    <div className="option" key={idx}>
                      <span>({ops[idx]})</span>&nbsp;{parse(op)}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      ))}
      {loading && (
        <div className="quizquestion-loader">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default QuizEditPage;
