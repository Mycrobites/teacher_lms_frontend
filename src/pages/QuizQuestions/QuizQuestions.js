import { useState, useEffect, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import UserContext from "../../context/authContext";
import Loader from "../../components/Loader/Loader";
import axios from "../../axios/axios";
import parse from "html-react-parser";
import MathJax from "react-mathjax3";
import { AiOutlineDelete } from "react-icons/ai";
import "./QuizQuestions.css";

const QuizQuestions = () => {
  const [questions, setQuestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const { userDetails } = useContext(UserContext);
  const { id } = useParams();
  const history = useHistory();

  const fetchQuestions = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${userDetails.access}` },
      };
      setLoading(true);
      const { data } = await axios.get(
        `teacher/quiz/getQuestions/${id}`,
        config
      );
      setQuestions(data.quiz_details);
      setLoading(false);
    } catch (err) {
      console.log(err.message);
    }
  };

  const deleteQuestion = async (qid) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${userDetails.access}` },
      };
      setLoading(true);
      await axios.delete(
        `/teacher/deleteQuestionFromQuiz/${id}/${qid}`,
        config
      );
      fetchQuestions();
      setLoading(false);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    fetchQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!questions) {
    return (
      <div className="quiz-questions-loader">
        <Loader />
      </div>
    );
  }

  return (
    <MathJax.Context
      input="tex"
      onLoad={() => {}}
      onError={(MathJax, error) => {
        console.warn(error);
        // console.log("Encountered a MathJax error, re-attempting a typeset!");
        MathJax.Hub.Queue(MathJax.Hub.Typeset());
      }}
      options={{
        messageStyle: "none",
        extensions: ["tex2jax.js"],
        jax: ["input/TeX", "output/HTML-CSS"],
        tex2jax: {
          inlineMath: [
            ["$", "$"],
            ["\\(", "\\)"],
          ],
          displayMath: [
            ["$$", "$$"],
            ["\\[", "\\]"],
          ],
          processEscapes: true,
        },
        TeX: {
          extensions: [
            "AMSmath.js",
            "AMSsymbols.js",
            "noErrors.js",
            "noUndefined.js",
          ],
        },
      }}
    >
      <div className="quiz-questions-div">
        <div className="quiz-question-header-1">
          <h2>{questions?.quiz_name} Questions</h2>
          <div className="quiz-header-buttons">
            <button
              className="enrollment-course-btn"
              onClick={() => history.push(`/quiz`)}
            >
              Back to Quiz
            </button>
            <button
              className="enrollment-course-btn"
              onClick={() => history.push(`/quizedit/${id}`)}
            >
              Add Questions
            </button>
          </div>
        </div>
        {questions?.questions.length === 0 && (
          <p className="no-questions">Add questions in this quiz!</p>
        )}
        <div className="quiz-questions">
          {questions?.questions.map((ques, idx) => (
            <div className="quiz-question" key={idx}>
              <h3>{idx + 1}.</h3>
              <div className="question-content">
                <div>
                  <MathJax.Html html={ques.question} />
                </div>
                <div className="question-tags">
                  <h4>Tags: </h4>
                  {ques?.dificulty_tag && <p>{ques?.dificulty_tag}</p>}
                  {ques?.skill && <p>{ques?.skill}</p>}
                  {ques?.subject_tag && <p>{ques?.subject_tag}</p>}
                  {ques?.topic_tag && <p>{ques?.topic_tag}</p>}
                  {ques?.subtopic_tag && <p>{ques?.subtopic_tag}</p>}
                </div>
                <div className="options">
                  {ques.question.includes("img") &&
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
              <div className="question-right-container">
                <div className="marks">
                  <p>Correct: {ques.correct_marks} Marks</p>
                  <p>Incorrect: -{ques.negative_marks} Marks</p>
                </div>
                <button
                  className="question-delete-btn"
                  onClick={() => deleteQuestion(ques.id)}
                >
                  <AiOutlineDelete />
                </button>
              </div>
            </div>
          ))}
        </div>
        {loading && (
          <div className="quizquestion-loader">
            <Loader />
          </div>
        )}
      </div>
    </MathJax.Context>
  );
};

export default QuizQuestions;
