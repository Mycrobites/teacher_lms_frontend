import { useState, useContext } from "react";
import { months } from "../../assets/months/months";
import "./Classes.css";
import Loader from "../Loader/Loader";
import axios from "../../axios/axios";
import UserContext from "../../context/authContext";

const getCurrentDate = () => {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth() < 10 ? `0${now.getMonth() + 1}` : now.getMonth() + 1;
  const d = now.getDate() < 10 ? `0${now.getDate()}` : now.getDate();
  const hh = now.getHours() < 10 ? `0${now.getHours()}` : now.getHours();
  const mm = now.getMinutes() < 10 ? `0${now.getMinutes()}` : now.getMinutes();
  return `${y}-${m}-${d}T${hh}:${mm}`;
};

const getDateString = (now) => {
  const a = now.split("T")[0].split("-");
  const b = now.split("T")[1];
  return `${a[0]}-${a[1]}-${a[2]}T${b}`;
};

const Lesson = (props) => {
  const {
    id,
    course,
    link,
    timeStamp,
    topic,
    fetchUpcomingEvents,
  } = props

  const date = new Date(timeStamp);
  const [loading, setLoading] = useState(false);
  const[showEditClass, setShowEditClass ] = useState(false);
  const[showDeleteClass, setShowDeleteClass] = useState(false);
  const[className, setClassName] = useState(topic);
  const [classDate, setClassDate] = useState(getCurrentDate);
  const[classLink, setClassLink] = useState(link);
  const{userDetails} = useContext(UserContext);

  const handleDelete = async () => {
    setShowDeleteClass(false);
    try {
      const config = {
        headers: { Authorization: `Bearer ${userDetails.access}` },
      };
      setLoading(true);
      await axios.delete(`teacher/editliveclass/${id}`, config);
      fetchUpcomingEvents();
    } catch (err) {
		console.log(err.message);
    }
	setLoading(false);
  };

  const editClass = async () => {

    if(!className || !classLink || !classDate ){
      return alert("Please enter all fields!");
    }
		setLoading(true);
		const postData = {
      user: userDetails.user_id,
      id,
      course,
      topic: className,
      link: classLink,
      timeStamp: getDateString(classDate),
    };
    setLoading(true);
    try {
			const config = {
				headers: { Authorization: `Bearer ${userDetails.access}` },
			};
      setLoading(true);
			await axios.put(
        `teacher/editliveclass/${id}`,
				postData,
				config,
        );
        fetchUpcomingEvents();
        setShowEditClass(false);
      } catch (err) {
        console.log(err.message);
      }
      setLoading(false);
	};

  return (
    <div className="single-lesson">
      <div className="time">
        <h2>
          {months[date.getMonth()]} {date.getDate()}
        </h2>
        <p>
          {date.getHours() === 12
            ? date.getHours()
            : date.getHours() % 12 < 10
            ? `0${date.getHours() % 12}`
            : date.getHours() % 12}
          :
          {date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()}
          {date.getHours() < 12 ? " AM" : " PM"}
        </p>
      </div>
      <div className="title">
        <h2>{topic}</h2>
      </div>
      <div className="meeting-link">
        <a href={link} target="_blank" rel="noreferrer">
          Join here
        </a>
        <div className="meeting-link edit-class">
          <button onClick={() => setShowEditClass(true)}>Edit Class</button>
        </div>
        <div className="meeting-link delete-class">
          <button onClick={() => setShowDeleteClass(true)}>Delete Class</button>
        </div>
      </div>

      {loading && (
        <div className="schedule-loader">
          <Loader />
        </div>
      )}

      {showEditClass && (
          <div className="schedule-class-modal">  
            <div className="schedule-class-modal-card schedule-class-form">
              <h1>Edit Class</h1>
              <div className="schedule-class-form">
                <label>
                  <p>Class Name</p>
                  <input
                    type="text"
                    value={className}
                    name="topic"
                    onChange={(e) => setClassName(e.target.value)}
                    placeholder="Meeting Name"
                  />
                </label>
                <label>
                  <p>Date</p>
                  <input
                      type="datetime-local"
                      value={classDate}
                      // name={getDateString(date)}
                      onChange={(e) => setClassDate(e.target.value)}
                  />
                </label>
                <label>
                  <p>New Link</p>
                  <input
                    name="link"
                    type="text"
                    value={classLink}
                    onChange={(e) => setClassLink(e.target.value)}
                    placeholder="paste meeting link"
                  />
                </label>
              </div>

              <div className="edit-modal-button">
                <button onClick={editClass}>Apply</button>
                <button onClick={() => setShowEditClass(false)}>Cancel</button>
              </div>
            </div>
          </div>
      )}

      {showDeleteClass && (
        <div className="course-modal-wrapper">
          <div className="delete-modal">
            <p>Are you sure you want to delete this class ?</p>
            <div className="course-modal-buttons">
              <button onClick={() => setShowDeleteClass(false)} className="btn">
                Cancel
              </button>
              <button onClick={handleDelete} className="btn">
                Proceed and Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Lesson;
