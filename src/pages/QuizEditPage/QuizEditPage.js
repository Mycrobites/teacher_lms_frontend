import { useState, useEffect, useContext } from "react";
import { useParams, history, useHistory } from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import axios from "../../axios/axios";
import UserContext from "../../context/authContext";
import parse from "html-react-parser";
import "./QuizEditPage.css";

const QuizEditPage = () => {
  const [questionBank, setQuestionBank] = useState(null);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
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
      console.log(postData);
      const { data } = await axios.post(
        "/teacher/addQuestionToQuiz",
        postData,
        config
      );
      alert(data.message);
      if (data.message === "added successfully")
        history.push(`/quizQuestions/${id}`);
      console.log(data);
    } catch (err) {
      console.log(err.message);
    }
  };
  console.log(selectedQuestions);

  useEffect(() => {
    const getQuestionBank = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${userDetails.access}` },
        };
        const { data } = await axios.get("/teacher/getQuestionsFromQB", config);
        // console.log(data);
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
            {!ques.question.includes("img") &&
              ques.option.map((op, idx) => {
                const ops = ["A", "B", "C", "D"];
                return (
                  <div className="options">
                    ({ops[idx]}) {parse(op)}
                  </div>
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuizEditPage;
