import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import UserContext from "../../context/authContext";
import axios from "../../axios/axios";

const QuizQuestions = () => {
  const [questions, setQuestions] = useState(null);
  const { userDetails } = useContext(UserContext);
  const { id } = useParams();

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
        console.log(data);
        setQuestions(data.quiz_details.questions);
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <div>
      {!questions && <p>Loading...</p>}
      {questions?.length === 0 && <p>Add questions in this quiz</p>}
    </div>
  );
};

export default QuizQuestions;
