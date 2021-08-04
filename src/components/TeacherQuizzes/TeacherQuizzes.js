import { useState, useEffect, useContext } from "react";
import UserContext from "../../context/authContext";
import CreateQuizModal from "./CreateQuizModal";
import CreateGroupModal from "./CreateGroup";
import Loader from "../../components/Loader/Loader";
import { AiFillDelete } from "react-icons/ai";
import QuizCard from "./QuizCard";
import axios from "../../axios/axios";
import "./TeacherQuizzes.css";
import AddCircleOutlineRoundedIcon from "@material-ui/icons/AddCircleOutlineRounded";
import { useHistory } from "react-router-dom";
import ReactHtmlParser from "react-html-parser";
import DeleteQuiz from "./DeleteQuiz";
import EditQuiz from "./EditQuiz";

const TeacherQuizzes = () => {
  const [showCreateQuizModal, setShowCreateQuizModal] = useState(false);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [active, setactive] = useState(true);
  const { userDetails } = useContext(UserContext);
  const [upcoming, setupcoming] = useState(false);
  const [attempted, setattempted] = useState(false);

  const [upcomingquiz, setUpcoming] = useState([]);
  const [attemptedquiz, setattemptedQuiz] = useState([]);
  const [activequiz, setActiveQuiz] = useState([]);
  const [groupnumber, setGroupnumber] = useState(0);
  const [data, setdata] = useState([]);
  const [groupnames, setGroupnames] = useState([]);
  const [groupIds, setGroupIds] = useState([]);
  const [index, setindex] = useState(0);
  const [quizCounts, setQuizCounts] = useState([]);
  const [open, setopen] = useState(true);
  const history = useHistory();

  const [editQuiz, setEditQuiz] = useState(false);
  const [deleteQuiz, setDeleteQuiz] = useState(true);

  const fetchquizzes = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${userDetails.access}` },
      };
      setLoading(true);
      const res = await axios.get(`api/get-all-quiz`, config);
      console.log("quiz=>", res.data);
      setdata(res.data);
      setattemptedQuiz(res.data[groupnumber]["attempted"]);
      setUpcoming(res.data[groupnumber]["upcoming"]);
      setActiveQuiz(res.data[groupnumber]["active"]);

      res.data.map((names) => {
        setGroupnames([...groupnames, names.name]);
      });

      let counts = [];
      if (res.data.length > 0) {
        for (let h = 0; h < res.data.length; h++) {
          counts[h] = {
            active: res.data[h]["active"].length,
            upcoming: res.data[h]["upcoming"].length,
            attempted: res.data[h]["attempted"].length,
          };
        }
      }

      setQuizCounts(counts);
      setLoading(false);
    } catch (err) {
      console.log(err.message);
    }
  };

  const setGroupdata = (group) => {
    for (let y = 0; y < data.length; y++) {
      if (data[y].name === group) {
        setindex(y);
      }
      setattemptedQuiz(data[index]["attempted"]);
      setUpcoming(data[index]["upcoming"]);
      setActiveQuiz(data[index]["active"]);
    }
  };

  const setgroups = () => {
    let groups = [];
    let groupIds = [];
    for (let x = 0; x < data.length; x++) {
      groups.push(data[x].name);
      groupIds.push(data[x].id);
    }
    setGroupnames(groups);
    setGroupIds(groupIds);
  };

  // console.log(groupIds);

  useEffect(() => {
    fetchquizzes();
  }, []);
  // console.log(data[index].name);

  useEffect(() => {
    setgroups();
  }, [groupnames.length]);

  useEffect(() => {
    setGroupdata();
  }, [index]);

  const [groups, setGroupInfo] = useState(null);
  const getGroupQuiz = async () => {
    try {
      console.log(userDetails);
      if (!groups) setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${userDetails.access}` },
      };
      const { data } = await axios.get(`/api/create-group`, config);

      setGroupInfo(data);
      // console.log("groupid", groups);
    } catch (err) {
      console.log(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    getGroupQuiz();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="teacher-quizzes">
      {
        <div className="all">
          <div className="cont">
            <div className="side">
              <div
                className="create-group"
                onClick={() => setShowCreateGroupModal(true)}
              >
                <p>Create Group</p>
                <AddCircleOutlineRoundedIcon />
              </div>

              {showCreateGroupModal && (
                <CreateGroupModal
                  apidata={data}
                  userDetails={userDetails}
                  setShowCreateGroupModal={setShowCreateGroupModal}
                  fetchquizzes={fetchquizzes}
                />
              )}

              <div
                className="create-group"
                onClick={() => setShowCreateQuizModal(true)}
              >
                <p>Create Quiz</p>
                <AddCircleOutlineRoundedIcon />
              </div>

              {showCreateQuizModal && (
                <CreateQuizModal
                  groups={groups}
                  userDetails={userDetails}
                  setShowCreateQuizModal={setShowCreateQuizModal}
                  fetchquizzes={fetchquizzes}
                />
              )}

              {groupnames.length > 0 &&
                quizCounts.length > 0 &&
                groupnames.map((group, idx) => {
                  return (
                    <>
                      <div
                        key={idx}
                        className="side-bar-item-advanced-1"
                        onClick={() => {
                          setopen(!open);
                          setGroupdata(group);
                          setDeleteQuiz(true);
                        }}
                      >
                        {group}
                        {/* <button 
                                      onClick={() => setDeleteQuiz(true)}
                                      class="delete-icon" ><AiFillDelete /></button> */}
                        {deleteQuiz && (
                          <DeleteQuiz
                            id={groupIds[idx]}
                            deleteQuizGroup={deleteQuiz}
                          />
                        )}
                      </div>
                      <div
                        className="tabs"
                        style={{
                          display:
                            data[index].name === group && open
                              ? "block"
                              : "none",
                        }}
                      >
                        <div className="type-count">
                          <p
                            className="side-bar-item"
                            onClick={() => {
                              setactive(true);
                              setupcoming(false);
                              setattempted(false);
                            }}
                          >
                            Active{" "}
                          </p>
                          <p className="side-bar-item">
                            {quizCounts[idx].active}
                          </p>
                        </div>
                        <div className="type-count">
                          <p
                            className="side-bar-item"
                            onClick={() => {
                              setactive(false);
                              setupcoming(true);
                              setattempted(false);
                            }}
                          >
                            Upcoming
                          </p>
                          <p className="side-bar-item">
                            {quizCounts[idx].upcoming}
                          </p>
                        </div>

                        <div className="type-count">
                          <p
                            className="side-bar-item"
                            onClick={() => {
                              setactive(false);
                              setupcoming(false);
                              setattempted(true);
                            }}
                          >
                            Attempted
                          </p>
                          <p className="side-bar-item">
                            {quizCounts[idx].attempted}
                          </p>
                        </div>
                      </div>
                    </>
                  );
                })}
            </div>

            <div className="mainbar">
              {activequiz.length > 0 &&
                upcoming == false &&
                attempted == false &&
                data.length > 0 && (
                  <div className="active">
                    <div className="active-active">
                      <p className="active-title">
                        {data[index].name} - Active
                      </p>
                    </div>
                    {activequiz.map((quiz, index) => {
                      return (
                        <div className="active-quiz" key={index}>
                          <div className="active-quiz-description">
                            <p className="active-quiz-title">
                              {ReactHtmlParser(quiz.title)}
                            </p>
                            <p className="active-quiz-des">
                              {ReactHtmlParser(quiz.desc)}
                            </p>
                            {/* <b>Instructions</b>
                                <p className="instructions-box">
                                  {ReactHtmlParser(quiz.instructions)}
                                </p> */}
                            <p className="question-time">
                              Duration : {quiz.duration}
                            </p>
                            <p className="start">
                              Start Date :{" "}
                              {quiz.start_date.slice(0, 10) +
                                "     " +
                                quiz.start_date.slice(11, 16) +
                                " GMT"}
                            </p>
                            <p className="end">
                              End Date :{" "}
                              {quiz.expire_date.slice(0, 10) +
                                "     " +
                                quiz.expire_date.slice(11, 16) +
                                " GMT"}
                            </p>
                          </div>

                          <div className="but">
                            <button
                              className="view"
                              onClick={() =>
                                history.push(`/quizquestions/${quiz.id}`)
                              }
                            >
                              View
                            </button>
                            <EditQuiz
                              id={quiz.id}
                              title={quiz.title}
                              desc={quiz.desc}
                              starttime={quiz.start_date}
                              endtime={quiz.expire_date}
                              duration={quiz.duration}
                              instructions={quiz.instructions}
                              userDetails={userDetails}
                            />
                            {/* {console.log("grp=>", groups)} */}
                            <DeleteQuiz id={groups[0].id} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

              {activequiz.length == 0 &&
                upcoming == false &&
                attempted == false &&
                data.length > 0 && (
                  <div className="active">
                    <div className="active-active">
                      <p className="active-title">
                        {data[index].name} - Active
                      </p>
                    </div>
                    <div className="active-quiz">
                      <p className="empty">
                        Currently no active quizzes to show.
                      </p>
                    </div>
                  </div>
                )}

              {upcomingquiz.length > 0 &&
                active == false &&
                attempted == false &&
                data.length > 0 && (
                  <div className="active">
                    <div className="active-active">
                      <p className="active-title">
                        {data[index].name} - Upcoming
                      </p>
                    </div>
                    {upcomingquiz.map((quiz, index) => {
                      return (
                        <div className="active-quiz" key={index}>
                          <div className="active-quiz-description">
                            <p className="active-quiz-title">
                              {ReactHtmlParser(quiz.title)}
                            </p>
                            <p className="active-quiz-des">
                              {ReactHtmlParser(quiz.desc)}
                            </p>
                            {/* <b>Instructions</b> */}
                            {/* <p className="instructions-box">
                                    {ReactHtmlParser(quiz.instructions)}
                                  </p> */}
                            <p className="question-time">
                              Duration : {quiz.duration}
                            </p>
                            <p className="start">
                              Start Date :{" "}
                              {quiz.start_date.slice(0, 10) +
                                "     " +
                                quiz.start_date.slice(11, 16) +
                                " GMT"}
                            </p>
                            <p className="end">
                              End Date :{" "}
                              {quiz.expire_date.slice(0, 10) +
                                "     " +
                                quiz.expire_date.slice(11, 16) +
                                " GMT"}
                            </p>
                          </div>
                          <div className="but">
                            <button
                              className="view"
                              onClick={() =>
                                history.push(`/quizquestions/${quiz.id}`)
                              }
                            >
                              View
                            </button>
                            <EditQuiz
                              id={quiz.id}
                              title={quiz.title}
                              desc={quiz.desc}
                              starttime={quiz.start_date}
                              endtime={quiz.expire_date}
                              duration={quiz.duration}
                              instructions={quiz.instructions}
                              userDetails={userDetails}
                            />
                            <DeleteQuiz id={quiz.id} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

              {upcomingquiz.length == 0 &&
                active == false &&
                attempted == false &&
                data.length > 0 && (
                  <div className="active">
                    <div className="active-active">
                      <p className="active-title">
                        {data[index].name} - Upcoming
                      </p>
                    </div>
                    <div className="active-quiz">
                      <p className="empty">
                        Currently no upcoming quizzes to show.
                      </p>
                    </div>
                  </div>
                )}

              {attemptedquiz.length > 0 &&
                active == false &&
                upcoming == false &&
                data && (
                  <div className="active">
                    <div className="active-active">
                      <p className="active-title">
                        {data[index].name} - attempted
                      </p>
                    </div>
                    {attemptedquiz.map((quiz, index) => {
                      return (
                        <div className="active-quiz" key={index}>
                          <div className="active-quiz-description">
                            <p className="active-quiz-title">
                              {ReactHtmlParser(quiz.title)}
                            </p>
                            <p className="active-quiz-des">
                              {ReactHtmlParser(quiz.desc)}
                            </p>
                            {/* <b>Instructions</b> */}
                            {/* <p className="instructions-box">
                                    {ReactHtmlParser(quiz.instructions)}
                                  </p> */}
                            <p className="question-time">
                              Duration : {quiz.duration}
                            </p>
                            <p className="start">
                              Start Date :{" "}
                              {quiz.start_date.slice(0, 10) +
                                "     " +
                                quiz.start_date.slice(11, 16) +
                                " GMT"}
                            </p>
                            <p className="end">
                              End Date :{" "}
                              {quiz.expire_date.slice(0, 10) +
                                "     " +
                                quiz.expire_date.slice(11, 16) +
                                " GMT"}
                            </p>
                          </div>
                          {/* {quiz.resultid && (
                                  <div className="view-result">
                                    <button className="view-result-button" 
                                    onClick={() => history.push(`/studentreport/${quiz.resultid}`)}>View Result</button>
                                </div>
                                )} */}
                          <div className="but">
                            <button
                              className="view"
                              onClick={() =>
                                history.push(`/quizquestions/${quiz.id}`)
                              }
                            >
                              View
                            </button>
                            <EditQuiz
                              id={quiz.id}
                              title={quiz.title}
                              desc={quiz.desc}
                              starttime={quiz.start_date}
                              endtime={quiz.expire_date}
                              duration={quiz.duration}
                              instructions={quiz.instructions}
                              userDetails={userDetails}
                            />
                            <DeleteQuiz id={quiz.id} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

              {attemptedquiz.length == 0 &&
                active == false &&
                upcoming == false &&
                data.length > 0 && (
                  <div className="active">
                    <div className="active-active">
                      <p className="active-title">
                        {data[index].name} - Attempted
                      </p>
                    </div>
                    <div className="active-quiz">
                      <p className="empty">
                        Currently no attempted quizzes to show.
                      </p>
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      }

      {loading && (
        <div className="quizquestion-loader">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default TeacherQuizzes;
