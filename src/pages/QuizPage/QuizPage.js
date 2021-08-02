import React, { useContext } from "react";
import MyCourseQuiz from "../../components/MyCourseQuiz/MyCourseQuiz";
import SideBar from "../../components/SideBar/SideBar";
import UserContext from "../../context/authContext";
import "./QuizPage.css";
import MyGroupQuiz from "../../components/MyGroupQuiz/MyGroupQuiz";
import TeacherQuizzes from '../../components/TeacherQuizzes/TeacherQuizzes'

const QuizPage = () => {
  const { userDetails } = useContext(UserContext);
  

  return (

    <>
      <SideBar active={"quiz"} />
      <div className="quiz-page">
        {/* <MyGroupQuiz user = {userDetails} />  
        <MyCourseQuiz user={userDetails} /> */}
        <TeacherQuizzes/>
      </div>
    </>
  );
};

export default QuizPage;
