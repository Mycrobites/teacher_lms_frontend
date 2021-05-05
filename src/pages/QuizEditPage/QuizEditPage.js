import { useState, useEffect, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import axios from "../../axios/axios";
import UserContext from "../../context/authContext";
import parse from "html-react-parser";
import { BsFilterRight } from "react-icons/bs";
import "./QuizEditPage.css";

const QuizEditPage = () => {
  //questionbank
  const [questionBank, setQuestionBank] = useState(null);
  const [filteredQuestionBank, setFilteredQuestionBank] = useState(null);
  //difficulty
  const [difficulty, setDifficulty] = useState(null);
  const [difficultyLevel, setDifficultyLevel] = useState("");
  //skills
  const [skills, setSkills] = useState(null);
  const [skillLevel, setSkillLevel] = useState("");
  //others
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  //context
  const { userDetails } = useContext(UserContext);
  //react-router
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

  const filterQuestions = () => {
    setFilteredQuestionBank(
      questionBank.filter(
        (ques) =>
          ques.dificulty_tag === difficultyLevel && ques.skill === skillLevel
      )
    );
    console.log(filteredQuestionBank);
  };

  const clearFilters = () => {
    setDifficultyLevel("");
    setSkillLevel("");
    setFilteredQuestionBank(questionBank);
  };

  useEffect(() => {
    const getQuestionBank = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${userDetails.access}` },
        };
        const { data } = await axios.get("/teacher/getQuestionsFromQB", config);
        //questionbank
        setQuestionBank(data.questions);
        setFilteredQuestionBank(data.questions);
        //difficulty
        setDifficulty(data.tags.dificulty);
        //skills
        setSkills(["Calculation", "Conceptual"]);
      } catch (err) {
        console.log(err.message);
      }
    };
    getQuestionBank();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log("f", filteredQuestionBank);
  console.log("q", questionBank);

  if (!questionBank) {
    return (
      <div className="quiz-questions-loader">
        <Loader />
      </div>
    );
  }

  return (
    <div className="quiz-questions-div">
      <div className="questionbank-header">
        <div className="quiz-question-header">
          <h1>Question Bank</h1>
          <button
            disabled={selectedQuestions.length === 0}
            onClick={addQuestions}
          >
            Add Questions
          </button>
          <button onClick={() => setShowFilter(!showFilter)}>
            Filter <BsFilterRight />
          </button>
        </div>
        {showFilter && (
          <div className="filter">
            <div className="difficulty-level">
              <label>Difficulty</label>
              <select
                value={difficultyLevel}
                onChange={(e) => setDifficultyLevel(e.target.value)}
              >
                {difficulty.map((d, i) => (
                  <option key={i} value={d}>
                    {d}
                  </option>
                ))}
                <option value="">All</option>
              </select>
            </div>
            <div className="skill-level">
              <label>Skils</label>
              <select
                value={skillLevel}
                onChange={(e) => setSkillLevel(e.target.value)}
              >
                {skills.map((s, i) => (
                  <option key={i} value={s}>
                    {s}
                  </option>
                ))}
                <option value="">All</option>
              </select>
            </div>
            <button onClick={clearFilters}>clear filters</button>
            <button onClick={filterQuestions}>Okay</button>
          </div>
        )}
      </div>
      {filteredQuestionBank?.map((ques) => (
        <div className="quiz-question" key={ques.id}>
          <div className="check-box">
            <input type="checkbox" onChange={() => handleChange(ques.id)} />
          </div>
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
          <div className="marks">
            <p>Correct: {ques.correct_marks} Marks</p>
            <p>Incorrect: -{ques.negative_marks} Marks</p>
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
