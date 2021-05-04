import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "../../axios/axios";
import UserContext from "../../context/authContext";
import parse from "html-react-parser";
import "./QuizEditPage.css";

const QuizEditPage = () => {
  const [questionBank, setQuestionBank] = useState(null);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const { userDetails } = useContext(UserContext);
  const { id } = useParams();

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

  return (
    <div>
      <h1>Question Bank</h1>
      {!questionBank && <p>Loading...</p>}
      <button disabled={selectedQuestions.length === 0} onClick={addQuestions}>
        Add Questions
      </button>
      {questionBank?.map((question) => (
        <div key={question.id}>
          <br />
          <input type="checkbox" onChange={() => handleChange(question.id)} />
          {parse(question.question)}
          <br />
        </div>
      ))}
    </div>
  );
};

export default QuizEditPage;
