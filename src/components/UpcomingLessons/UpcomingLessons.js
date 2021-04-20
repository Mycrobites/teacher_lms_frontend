import { useState, useEffect, useRef , useContext } from "react";
import Loader from "../Loader/Loader";
import Lesson from "./Lesson";
import axios from "../../axios/axios";
import "./UpcomingLessons.css";
import UserContext from "../../context/authContext";

const getUpcomingLessonsFromLocalStorage = () => {
  const lessons = localStorage.getItem("upcoming-lessons");
  if (lessons) {
    return JSON.parse(lessons);
  } else {
    return null;
  }
};

const UpcomingLessons = ({user}) => {
  const [upcomingEvents, setUpcomingEvents] = useState(
    getUpcomingLessonsFromLocalStorage
  );
  const [isLoading, setIsLoading] = useState(false);
  const mountedRef = useRef(true);
  const{userDetails}= useContext(UserContext)

  useEffect(() => {
    // let isUnmounted = false;
    const fetchUpcomingEvents = async () => {
      if (!upcomingEvents) setIsLoading(true);
      try {
        const config = {
          headers: { Authorization: `Bearer ${userDetails.key}` },
        };
        const { data } = await axios.get(`/api/upcomingEvents/${user?.username}`,config);
        if (mountedRef.current) {
          const sortedData = data
            .sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp))
            .reverse();
          localStorage.setItem("upcoming-lessons", JSON.stringify(sortedData));
          setUpcomingEvents(sortedData);
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
  }, [upcomingEvents, user?.username]);

  return (
    <div className="UpcomingLessons">
      <h1>Upcoming Lessons</h1>
      {isLoading && <Loader />}
      <div className="lesson">
        {upcomingEvents?.map((event) => (
          <Lesson key={event.id} {...event} />
        ))}
      </div>
    </div>
  );
};

export default UpcomingLessons;
