import { useState, useEffect, useContext } from "react";
import ScheduleClass from "./ScheduleClass";
import Loader from "../Loader/Loader";
import Classes from "./Classes";
import axios from "../../axios/axios";
import UserContext from "../../context/authContext";
import "./UpcomingLessons.css";

const getLiveClassesFromLocalStorage = () => {
  const lessons = localStorage.getItem("live-class");
  if (lessons) {
    return JSON.parse(lessons);
  } else {
    return null;
  }
};

const getCourseListFromLocalStorage = () => {
  const lessons = localStorage.getItem("course-list");
  if (lessons) {
    return JSON.parse(lessons);
  } else {
    return null;
  }
};

const UpcomingLessons = ({ user }) => {
  const [liveClasses, setLiveClasses] = useState(
    getLiveClassesFromLocalStorage
  );
  const [courseList, setCourseList] = useState(getCourseListFromLocalStorage);
  const [isLoading, setIsLoading] = useState(false);
  const [showScheduleClass, setShowScheduleClass] = useState(false);
  const { userDetails } = useContext(UserContext);

  const fetchUpcomingEvents = async () => {
    if (!liveClasses) setIsLoading(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${userDetails.access}` },
      };
      const { data } = await axios.get(
        `/teacher/getLiveclass/${user.username}`,
        config
      );
      const sortedData = data.response
        .sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp))
        .reverse();
      localStorage.setItem("live-class", JSON.stringify(sortedData));
      localStorage.setItem("course-list", JSON.stringify(sortedData));
      setLiveClasses(sortedData);
      setCourseList(data["course list"]);
    } catch (err) {
      console.log(err.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUpcomingEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liveClasses]);

  return (
    <div className="UpcomingLessons">
      <div className="UpcomingLessons-header">
        <h1>Live Classes</h1>
        <button onClick={() => setShowScheduleClass(true)}>
          Schedule Class
        </button>
      </div>
      {isLoading && <Loader />}
      <div className="lesson">
        {liveClasses?.map((classs) => (
          <Classes key={classs.id} {...classs} />
        ))}
      </div>
      {showScheduleClass && (
        <ScheduleClass
          setShowScheduleClass={setShowScheduleClass}
          courseList={courseList}
          user={user}
          fetchUpcomingEvents={fetchUpcomingEvents}
        />
      )}
    </div>
  );
};

export default UpcomingLessons;
