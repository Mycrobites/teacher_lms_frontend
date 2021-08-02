import { useContext } from "react";
import SideBar from "../../components/SideBar/SideBar";
import LiveClasses from "../../components/LiveClasses/LiveClasses";
import Calendar from "../../components/Calendar/Calendar";
import Courses from "../../components/Courses/Courses";
import Task from "../../components/Task/Task";
import UserContext from "../../context/authContext";
import PastQuiz from "../../components/PastQuiz/PastQuiz";
import "./DashBoard.css";

const DashBoard = () => {
  const { userDetails } = useContext(UserContext);

  return (
    <>
      <SideBar active="dashboard" />
      <div className="Dashboard">
        <div className="dashboard-items">
          <LiveClasses user={userDetails} />
          <Courses user={userDetails} />
          <Calendar />
          <Task user={userDetails} />
          <PastQuiz user={userDetails} />
        </div>
      </div>
    </>
  );
};

export default DashBoard;
