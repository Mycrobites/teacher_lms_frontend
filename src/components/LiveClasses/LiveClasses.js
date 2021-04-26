import { useState, useEffect, useRef, useContext } from "react";
import ScheduleClass from "./ScheduleClass";
import Loader from "../Loader/Loader";
import Classes from "./Classes";
import axios from "../../axios/axios";
import "./UpcomingLessons.css";
import UserContext from "../../context/authContext";

const getLiveClassesFromLocalStorage = () => {
  const lessons = localStorage.getItem("upcoming-lessons");
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

  const mountedRef = useRef(true);
  const { userDetails } = useContext(UserContext);

  useEffect(() => {
    // let isUnmounted = false;
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
        // console.log(data.response);
        if (mountedRef.current) {
          const sortedData = data.response
            .sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp))
            .reverse();
          localStorage.setItem("upcoming-lessons", JSON.stringify(sortedData));
          localStorage.setItem("course-list", JSON.stringify(sortedData));
          setLiveClasses(sortedData);
          setCourseList(data["course list"]);
        }
      } catch (err) {
        console.log(err.message);
      }
      setIsLoading(false);
    };
    fetchUpcomingEvents();
    return function cleanup() {
      mountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liveClasses, user?.username]);

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
          user={user.username}
        />
      )}
    </div>
  );
};

export default UpcomingLessons;
